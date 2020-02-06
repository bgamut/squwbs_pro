var PNGImage = require('pngjs-image')
var path = require('path')
var fs = require('fs')
var wav = require('node-wav');
var fft = require('fft-js').fft
var ifft= require('fft-js').ifft
var fftUtil = require('fft-js').util
var rootDir='/Users/bernardahn/Desktop/tf_data_prep'

var todo=[]
fs.readdir(rootDir,function(err,directories){
    // console.log(files)
    for (var index =0; index<directories.length; index++){
        
        var currentDir=path.join(rootDir,directories[index])
        //console.log(currentDir)
        if(fs.lstatSync(currentDir).isDirectory()){
            var files=fs.readdirSync(currentDir)
            for (var fileIndex=0; fileIndex<files.length; fileIndex++){
                var extIndex=files[fileIndex].split('.').length-1
                if(files[fileIndex].split('.')[extIndex]=='wav'){
                    console.log(path.join(currentDir,files[fileIndex]))
                    var buffer = fs.readFileSync(path.join(currentDir,files[fileIndex]))
                    var result = wav.decode(buffer);
                    var originalLength=result.channelData[0].length;
                    var sampleRate=result.sampleRate
                    var newArray=[]
                    var frontSilenceTrim=false
                    var endSilenceTrim=false
                    console.log('trimming...')
                    var start=process.hrtime();
                    for (var i=0; i<originalLength; i++){
                        if (result.channelData[0][i]!==0.0){
                            frontSilenceTrim=true
                        }
                        if(frontSilenceTrim==true){
                            newArray.push(result.channelData[0][i])
                        }
                    }
                    originalLength=newArray.length
                    for (var i=originalLength-1; i>=0; i-=1){
                        if(endSilenceTrim==false){
                            if (result.channelData[0][i]==0.0){
                                newArray.splice(-1,1)
                            }
                            else{
                                endSilenceTrim=true
                                originalLength=i+1
                            }
                        }
                    }
                    var end = process.hrtime(start)
                    console.log('took %ds %dms',end[0],end[1])
                    var width=2048
                    var bins=2048
                    var height=bins/2
                    var arbitraryLength=width*height
                    // if(originalLength>width){
                    console.log('Making Spectrogram Array...')
                    start=process.hrtime()
                    var stride = (originalLength-bins)/width
                    var spectrogram=[]
                    for (var i =0; i<width; i++){
                        var tempArray=[]
                        for(var j=0; j<bins; j++){
                            tempArray[j]=(newArray[Math.floor(i*stride)+j])
                        }
                        var phasors=fft(tempArray)
                        spectrogram.push(fftUtil.fftMag(phasors))
                    }
                    end = process.hrtime(start)
                    console.log('took %ds %dms',end[0],end[1])
                    // var float32array=new Float32Array(tempArray.slice())
                    // var int32array = new Int32Array(float32array.buffer);
                    // var buildSpectrogram = require('../src/binary_build/spline/build/Release/addon');
                    // var spectrogram = buildSpectrogram.AcceptArrayBuffer(int32array.buffer,sampleRate);
                    var image=PNGImage.createImage(width,height);
                    image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:200})
                    for (var j=0; j<height; j++){
                        for(var i=0; i<width; i++){
                            var gray=Math.floor(255*spectrogram[i][j])
                            //image.setAt(i,j,{red:Math.floor(spectrogram[(j)*width+(i)]*255),green:Math.floor(spectrogram[(j)*width+(i)]*255),blue:Math.floor(spectrogram[(j)*width+(i)]*255),alpha:200})
                            //image.setAt(i,Math.floor((tempArray[i]+1)*height/2)-1,{red:0,green:0,blue:0,alpha:200})
                            //image.setAt(i,Math.floor((tempArray[i]+1)*height/2),{red:0,green:0,blue:0,alpha:200})
                            //image.setAt(i,Math.floor((tempArray[i]+1)*height/2)+1,{red:0,green:0,blue:0,alpha:200})
                            //image.setAt(i-1,Math.floor((tempArray[i]+1)*height/2),{red:0,green:0,blue:0,alpha:200})
                            //image.setAt(i+1,Math.floor((tempArray[i]+1)*height/2),{red:0,green:0,blue:0,alpha:200})
                            //image.fillRect(i,j,3,3,{red:0,green:0,blue:0,alpha:200})
                            image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:200})
                        }

                    }
                    // }
                    // else{
                    //     var stride = arbitraryLength/originalLength
                    //     var tempArray=[]
                    //     for (var i =0; i<originalLength; i++){
                    //         tempArray.push(newArray[Math.floor(i*stride)])
                    //     }
                    //     var float32array=new Float32Array(tempArray.slice())
                    //     var int32array = new Int32Array(float32array.buffer);
                    //     var buildSpectrogram = require('../src/binary_build/spline/build/Release/addon');
                    //     var spectrogram = buildSpectrogram.AcceptArrayBuffer(int32array.buffer,sampleRate);
                    //     var image=PNGImage.createImage(width,height);
                    //     //image.fillRect(0,0,width,height,'white')
                    //     for (var j=0; j<height; j++){
                    //         for(var i=0; i<arbitraryLength; i++){
                    //             image.setAt(i,j,{red:Math.floor(spectrogram[(j*i)]*255),green:Math.floor(spectrogram[(width-j)*width+(i)]*255),blue:Math.floor(spectrogram[(width-j)*width+(i)]*255),alpha:200})
                    //             //image.setAt(i,Math.floor((tempArray[i]+1)*height/2),{red:0,green:0,blue:0,alpha:200})
                    //         }
                    //     }
                    // }
                    
                    
                    var createdImagePath=path.join(currentDir,files[fileIndex]+'.png')
                    image.writeImage(createdImagePath, function (err) {
                        if (err) throw err;
                        console.log('Written to the file '+createdImagePath);
                    });
                    console.log('using memory : '+process.memoryUsage().heapUsed / 1024 / 1024)
                }
            }
        }
    }
})



