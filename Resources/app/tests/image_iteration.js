var PNGImage = require('pngjs-image')
var path = require('path')
var fs = require('fs')
var wav = require('node-wav');
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
                    var width=2048
                    var height=2048
                    var arbitraryLength=width*height
                    var stride = originalLength/arbitraryLength
                    var tempArray=[]
                    for (var i =0; i<arbitraryLength; i++){
                        tempArray.push(newArray[Math.floor(i*stride)])
                    }
                    var float32array=new Float32Array(tempArray.slice())
                    var int32array = new Int32Array(float32array.buffer);
                    var buildSpectrogram = require('../src/binary_build/spline/build/Release/addon');
                    var spectrogram = buildSpectrogram.AcceptArrayBuffer(int32array.buffer,sampleRate);
                    var image=PNGImage.createImage(width,height);
                    for (var j=0; j<width; j++){
                        for(var i=0; i<height; i++){
                            image.setAt(i,j,{red:Math.floor(spectrogram[i*height+(height-j)]*255),green:Math.floor(spectrogram[i*height+(height-j)]*255),blue:Math.floor(spectrogram[i*height+(height-j)]*255),alpha:200})
                        }
                    }
                    var createdImagePath=path.join(currentDir,files[fileIndex]+'.png')
                    image.writeImage(createdImagePath, function (err) {
                        if (err) throw err;
                        console.log('Written to the file '+createdImagePath);
                    });
                    console.log(process.memoryUsage().heapUsed / 1024 / 1024)
                }
            }
        }
    }
    console.log(todo)
})



