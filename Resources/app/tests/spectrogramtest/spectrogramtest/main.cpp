#include <memory.h>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include "include/gaborator/gaborator.h"
#include "include/gaborator/render.h"
//#include "include/ImageMagick/Magick++.h"
#include <Magick++.h>
int main(int argc, char **argv){

    int new_vector_length=12*44100;
    
    std::vector<float> left(new_vector_length);
    for (int i = 0; i < (int)new_vector_length; i++) {
//        for (int c = 0; c < (int)2; c++){
            left[i]=std::rand();
//            std::cout<<left[i]<<std::endl;
//            left[i] = audio[(valid_start_frame+i) * sfinfo.channels + 0];
//        }
    }
    gaborator::parameters params(48, 20.0/44100, 440.0/44100);
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
        
        std::cout<<amplitudes[i]<<std::endl;
    }
    
    return 0;
}
