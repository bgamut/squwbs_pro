#include <memory.h>
#include <iostream>
#include <fstream>
#include <blob.h>
#include "./include/sndfile.h"
#include "./include/gaborator/gaborator.h"
#include "./include/gaborator/render.h"
#include "./include/ImageMagick/Magick++.h"
int main(int argc, char **argv){
    if(argc<3){
        std::cerr<<"usage:render input.wav output.pgm\n";
        exit(1);
    }
    SF_INFO sfinfo;
    memset(&sfinfo, 0, sizeof(sfinfo));
    SNDFILE *sf_in = sf_open(argv[1], SFM_READ,&sfinfo);
    if(!sf_in){
        std::cerr<<"could not open input audio file\n";
        exit(1);
    }
    double fs = sfinfo.samplerate;
    sf_count_t n_frames = sfinfo.frames;
    sf_count_t n_samples =sfinfo.frames*sfinfo.channels;
    std::vector<float> audio (n_samples);
    sf_count_t n_read = sf_readf_float(sf_in,audio.data(),n_frames);
    if(n_read!= n_frames){
        std::cerr<<"read error\n";
        exit(1);
    }
    sf_close(sf_in);
    int valid_start_frame=0;
    int valid_end_frame=0;
    int valid_frames=0;
    int endZeros=0;
    bool zeroPadEnded=false;
    
    //count actual samples without zero paddings
    int index = 0;
    // for (size_t i = 0; i < (size_t)n_frames; i++) {
    while (index<(int)n_frames||zeroPadEnded==false) {
        if(audio[index*sfinfo.channels+0]!=0.0){
            zeroPadEnded=true;
            valid_start_frame=index;
            break;
        }
        index++;
    }
    index=(int)n_frames;
    zeroPadEnded=false;
    while (index<(int)n_frames||zeroPadEnded==false) {
        if(audio[index*sfinfo.channels+0]!=0.0){
            zeroPadEnded=true;
            valid_end_frame=index;
            break;
        }
        index=index-1;
    }
    int new_vector_length=valid_end_frame-valid_start_frame+1;
    std::vector<float> left(new_vector_length);
    for (int i = 0; i < (int)new_vector_length; i++) {
        for (int c = 0; c < (int)sfinfo.channels; c++){
            left[i] = audio[(valid_start_frame+i) * sfinfo.channels + 0];
        }
    }
    gaborator::parameters params(48, 20.0/fs, 440.0/fs);
    gaborator::analyzer<float> analyzer(params);
    gaborator::coefs<float> coefs(analyzer);
    analyzer.analyze(left.data(),0,left.size(),coefs);
    
    int64_t x_origin=0;
    int64_t y_origin = analyzer.bandpass_bands_begin();
    int x_scale_exp=10;
    int y_scale_exp=0;
    while((new_vector_length>>x_scale_exp)>1000){
        x_scale_exp++;
    }
    int64_t x0=0;
    int64_t y0=0;
    int64_t x1=new_vector_length>>x_scale_exp;
    int64_t y1 = (analyzer.bandpass_bands_end()-analyzer.bandpass_bands_begin())>>y_scale_exp;
    std::vector<float> amplitudes((x1-x0)*(y1-y0));
    gaborator::render_p2scale(
        analyzer,
        coefs,
        x_origin,y_origin,
        x0,x1,x_scale_exp,
        y0,y1,y_scale_exp,
        amplitudes.data()
        );
    for(int i=0; i<amplitudes.size(); i++){
        //the following returns a single integer 0~255
        int grayscaleInt=int(gaborator::float2pixel_8bit(amplitudes[i]));
        int r=255-grayscaleInt;
        int g=255-grayscaleInt;
        int b=255;

        double red=double(1.0-amplitudes[i]);
        double green=double(1.0-amplitudes[i]);
        double blue=1.0;
    }

    // float gain =15;
    // std::ofstream f;
    // f.open(argv[2], std::ios::out | std::ios::binary);
    // f<<"P5\n"<<(x1-x0)<<' '<<(y1-y0)<<"\n255\n";
    // for(size_t i=0; i<amplitudes.size(); i++){
    //     f.put(gaborator::float2pixel_8bit(amplitudes[i]*gain));
    //     f.close();
    // }

    // Magick::Image img("rose:");
    // // img.addNoise(GaussianNoise); 
    // // Create cache of pixel data
    // Magick::Quantum * pixels = img.getPixels(5, 5, 1, 1);
    // // Set values
    // Magick::Color green("GREEN");
    // pixels[0] = green.quantumRed();
    // pixels[1] = green.quantumGreen();
    // pixels[2] = green.quantumBlue();
    // // Copy cache back.
    // img.syncPixels();
    // Magick::Image img;
    // img=Magick::Image image( 640, 480, "RGB", 0, pixels );
    // img.write("output.png");
    // Magick::Image image(Magick::Geometry(640,480),Magick::Color(0,0,0,1));
    // int width=640;
    // int height=480;
    // Magick::Geometry geo(width,height);
    // Magick::Image image(width,height,"RGB",0,'white');
    // for(int x=0; x<640; x++){
    //     for(int y=0; y<480; y++){
    //         int index=0;
    //         int grayscaleInt=int(gaborator::float2pixel_8bit(amplitudes[index]));
    //         int r=255-grayscaleInt;
    //         int g=255-grayscaleInt;
    //         int b=255;
    //         image.pixelColor(x,y,Magick::Color(r,g,b,255));
    //     }
    // }
    
    // MagickCore::ImageToBlob("somename",image,nullptr);
    // image.write()
    //Magic::Quantum * pixels=imgage.getPixels(x,y,1,1);
    Magick::Geometry geo("1024x512");
    Magick::Image image(geo, Magick::Color(0,0,0,1));
    // std::vector<auto> image_blob;
    // std::string image_blob;
    for(int x=0; x<1024; x++){
        for(int y=0; y<512; y++){
            int index=0;
            int grayscaleInt=int(gaborator::float2pixel_8bit(amplitudes[index]));
            int r=255-grayscaleInt;
            int g=255-grayscaleInt;
            int b=255;
            image.pixelColor(x,y,Magick::Color(r,g,b,255));
        }
    }
    Image.write('output.png');
}   