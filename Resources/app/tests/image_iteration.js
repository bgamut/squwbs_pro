var PNGImage = require('pngjs-image')
var path = require('path')
var fs = require('fs')
var wav = require('node-wav');
var rootDir='/Users/bernardahn/Desktop/tf_data_prep'
var todo=[]
fs.readdir(rootDir,function(err,files){
    
    for (var index =0; index<files.length; index++){
        // console.log(files[index])
        if(fs.lstatSync(path.join(rootDir,files[index])).isDirectory()){
            todo.push({
                path:path.join(rootDir,files[index]),
                label:files[index],
                subset:{
                    files:[],
                    raw:[]
                }
            })
        }
    }

    
    // for (var dirIndex =0; dirIndex<todo.length; dirIndex++){
    function iterate(i)
    {
        if(i<todo.length){
            var dirIndex=i
            // console.log(todo[dirIndex])
            var currentDir=todo[dirIndex]
            var files=fs.readdirSync(currentDir['path'])
            //console.log(files)
            todo[dirIndex]['subset']['files']=files
            

            iterate(i+1)
            //console.log(i+1)
        }
        else{
            
            for (var labelIndex=0; labelIndex<todo.length; labelIndex++){
                
                //console.log(todo[labelIndex]['subset']['files'])
                for (var fileIndex =0; fileIndex<todo[labelIndex]['subset']['files'].length; fileIndex++){
                    var extIndex=todo[labelIndex]['subset']['files'][fileIndex].split('.').length-1
                    if(todo[labelIndex]['subset']['files'][fileIndex].split('.')[extIndex]=='wav'){
                        //console.log(files[fileIndex])
                        var buffer = fs.readFileSync(path.join(todo[labelIndex]['path'],todo[labelIndex]['subset']['files'][fileIndex]))
                        var result = wav.decode(buffer);
                        var arbitraryLength=result.channelData[0].length;
                        var sampleRate=result.sampleRate
                        var newArray=[]
                        var frontSilenceTrim=false
                        var endSilenceTrim=false
                        for (var i=0; i<arbitraryLength; i++){
                            if (result.channelData[0][i]!==0.0){
                                frontSilenceTrim=true
                            }
                            if(frontSilenceTrim==true){
                                newArray.push(result.channelData[0][i])
                            }
                        }
                        arbitraryLength=newArray.length
                        for (var i=arbitraryLength; i>=0; i-=1){
                            if(endSilenceTrim==false){
                                if (result.channelData[0][i]==0.0){
                                    newArray.splice(-1,1)
                                }
                                else{
                                    endSilenceTrim=true
                                }
                            }
                        }
                        //newArray=new Float32Array(newArray)
                        
                        // console.log(path.join(todo[dirIndex]['path'],files[fileIndex]))
                        // console.log(newArray.length)
                        todo[labelIndex]['subset']['raw'].push({
                            sampleRate:sampleRate,
                            array:newArray,
                            truncated:undefined,
                            fileName:todo[labelIndex]['subset']['files'][fileIndex],
                            spectrogram:undefined
                        })
                        
                    } 
                }
            }
            const buildSpectrogram = require('../src/binary_build/spline/build/Release/addon');
            for (var labelIndex=0; labelIndex<todo.length; labelIndex++){
                
                for(var fileIndex=0; fileIndex<todo[labelIndex]['subset']['raw'].length; fileIndex++){
                    var arbitraryLength=2048*512
                    var originalLength=todo[labelIndex]['subset']['raw'][fileIndex]['array'].length
                    var stride = originalLength/arbitraryLength
                    var tempArray=[]
                    for (var i =0; i<arbitraryLength; i++){
                       tempArray.push(todo[labelIndex]['subset']['raw'][fileIndex]['array'][Math.floor(i*stride)])
                    }
                    todo[labelIndex]['subset']['raw'][fileIndex]['truncated']=tempArray.slice()
                    var float32array=new Float32Array(tempArray)
                    var int32array = new Int32Array(float32array.buffer);
                    var spectrogram = buildSpectrogram.AcceptArrayBuffer(int32array.buffer,todo[labelIndex]['subset']['raw'][fileIndex]['sampleRate']);
                    todo[labelIndex]['subset']['raw'][fileIndex]['spectrogram']=spectrogram
                    //delete(todo[labelIndex]['files'])
                    //console.log(todo[labelIndex]['subset']['raw'][fileIndex])
                }
            }
            for(var i = 0; i<todo[0]['subset']['raw'][0]['spectrogram'].length; i++){
                if(todo[0]['subset']['raw'][0]['spectrogram'][i]!=0){
                    console.log(todo[0]['subset']['raw'][0]['spectrogram'][i])
                }
                
            }
            
            
            
            // for (var fileIndex =0; fileIndex<files.length; fileIndex++){
            //     var extIndex=files[fileIndex].split('.').length-1
            //     if(files[fileIndex].split('.')[extIndex]=='wav'){
            //         //console.log(files[fileIndex])
            //         var buffer = fs.readFileSync(path.join(todo[dirIndex]['path'],files[fileIndex]))
            //         var result = wav.decode(buffer);
            //         var arbitraryLength=result.channelData[0].length;
            //         var samplRate=result.sampleRate
            //         var newArray=[]
            //         var frontSilenceTrim=false
            //         var endSilenceTrim=false
            //         for (var i=0; i<arbitraryLength; i++){
            //             if (result.channelData[0][i]!==0.0){
            //                 frontSilenceTrim=true
            //             }
            //             if(frontSilenceTrim==true){
            //                 newArray.push(result.channelData[0][i])
            //             }
            //         }
            //         arbitraryLength=newArray.length
            //         for (var i=arbitraryLength; i>=0; i-=1){
            //             if(endSilenceTrim==false){
            //                 if (result.channelData[0][i]==0.0){
            //                     newArray.splice(-1,1)
            //                 }
            //                 else{
            //                     endSilenceTrim=true
            //                 }
            //             }
            //         }
            //         newArray=new Float32Array(newArray)
                    
            //         console.log(path.join(todo[dirIndex]['path'],files[fileIndex]))
            //         console.log(newArray.length)
            //         // todo[dirIndex]['subset'].push({
            //         //     raw:newArray
            //         // })
            //     } 
            // }
        }
    }
    iterate(0)
    // }

})



// for (var k =0; k<10; k++){
//     var image=PNGImage.createImage(150,150);
//     for (var j=0; j<150; j++){
        
//         var randomRed=Math.floor(Math.random()*255)
//         var randomGreen=Math.floor(Math.random()*255)
//         var randomBlue=Math.floor(Math.random()*255)
//         for(var i=0; i<150; i++){
//             if(j<50){
//                 image.setAt(i,j,{red:255,green:randomGreen,blue:randomBlue,alpha:200})
//             }
//             else{
//                 image.setAt(i,j,{red:randomRed,green:randomGreen,blue:randomBlue,alpha:200})
//             } 
//         }
//     }
//     var createdImagePath=path.join(process.cwd(),'eo'+k+'.png')
//     image.writeImage(createdImagePath, function (err) {
//         if (err) throw err;
//         console.log('Written to the file '+createdImagePath);
//     });
// }

