// var exec = require('child_process').exec, child;
// const child_process=require('child_process')
// var fs = require('fs');
// var path = require('path')
// var programPath=''
// // var wav = require('node-wav')
// var isWav = require('is-wav');
// //var squwbs = require('./squwbs')
// const wavefile = require('wavefile');
// const Spline = require('cubic-spline')
// const {shell} = require('electron')
// const electron = require('electron')

// var fileIsLoaded=false
// var p5=require('p5')
// var readMode=false
// var left=[]
// var right=[]
// var mono=[]
// var side=[]
// var obj={}
// var deviationShow=false
// var binSize=2**8
// var globalArray=new Array(100).fill(0)
// var globalLeft = new Array(binSize).fill(0)
// var globalRight= new Array(binSize).fill(0)

// var globalMono= new Array(binSize).fill(0)
// var globalSide= new Array(binSize).fill(0)

// var leftFFT=new Array(binSize).fill([0,0])
// var rightFFT=new Array(binSize).fill([0,0])

// var monoFFTList=[]
// var sideFFTList=[]
// var monoFFT=new Array(binSize).fill([0,0])
// var sideFFT=new Array(binSize).fill([0,0])

// var monoFFTAverage=new Array(binSize/2).fill(0)
// var sideFFTAverage=new Array(binSize/2).fill(0)

// var monoFFTDeviation=new Array(binSize/2).fill(0)
// var sideFFTDeviation=new Array(binSize/2).fill(0)

// var sample = 0;
// var leftMagnitude=new Array(binSize).fill(0);
// var rightMagnitude=new Array(binSize).fill(0);
// var monoMagnitude=new Array(binSize/2).fill(0);
// var sideMagnitude=new Array(binSize/2).fill(0);
// var monoMagnitudeList=[]
// var sideMagnitudeList=[]

// const fft = require('fft-js').fft
// const ifft = require('fft-js').ifft
// const fftUtil = require('fft-js').util
// const fftInPlace = require('fft-js').fftInPlace
// function getFileExtension(filename)
// {
//   var ext = /^.+\.([^.]+)$/.exec(filename);
//   return ext == null ? "" : ext[1];
// }
// function move(oldPath, newPath, callback) {

//   //fs.rename(oldPath, newPath, function (err) {
//   fs.copyFile(oldPath, newPath, function (err) {
//       if (err) {
//           if (err.code === 'EXDEV') {
//               copy();
//           } else {
//               callback(err);
//           }
//           return;
//       }
//       callback();
//   });

//   function copy() {
//       var readStream = fs.createReadStream(oldPath);
//       var writeStream = fs.createWriteStream(newPath);

//       readStream.on('error', callback);
//       writeStream.on('error', callback);

//       readStream.on('close', function () {
//           //fs.unlink(oldPath, callback);
//           //console.log('copied')
//       });

//       readStream.pipe(writeStream);
//   }
// }


// document.getElementById('party').addEventListener('click', function() {
//     document.getElementById('business').click()
// })


// document.getElementById('business').onchange = function(e){ 
//   var skippedFiles=[]
//   var filesList=[]
//   var challengeList=[]
//   var pythonChallengeList=[]
//   var files = e.target.files; // FileList object
//   const desktopPath = (electron.app || electron.remote.app).getPath('desktop');
//   var fullPathDirectory=path.join(desktopPath,'mastered_files')
//   var errorPathDirectory=path.join(desktopPath,'error_files')
//   var inputFileDirectory=path.join(desktopPath,'mastered_files')
//   var outputFileDirectory=path.join(desktopPath,'mastered_fixed')
//   var nextFullPathDirectory=path.join(desktopPath,'mastered_fixed')
//   var baseBinaryPath = path.join(__dirname,'dist/spline')
//   var nextResourceBinary=path.join(__dirname,'dist/prep')
//   var nextBinaryPath = path.join(nextFullPathDirectory,'prep')
//   const prevCommand = nextResourceBinary.replace(/(\s+)/g, '\\$1')
//   const baseBinaryCommand = baseBinaryPath.replace(/(\s+)/g, '\\$1')
  
//   var ng=false
//   if (!fs.existsSync(fullPathDirectory)){
//     fs.mkdirSync(fullPathDirectory);
//   }
//   const mainFunction=function(files,i){
//     var filePath = files[i].path
//     var buffer = fs.readFileSync(filePath)
//     // var wav = new wavefile.WaveFile(buffer)
//     var fileName=path.basename(filePath)
//     var wavPath=path.join(fullPathDirectory,fileName)
    
//     function iterFiles(listOfFiles,index,baseCommand){
//       // console.log(listOfFiles)
//       // console.log(index)
//       // console.log(listOfFiles[index])
//       var pass=false
//       var filename=path.basename(listOfFiles[index])
//       var outputFilePath=path.join(outputFileDirectory,filename)
//       var errorFilePath=path.join(errorPathDirectory,filename)
//       var percentage=Math.floor((index/(listOfFiles.length-1))*10000)/100+'%'
//       if(fs.existsSync(errorFilePath)==true){
//         pass=true
//       }
//       else if(fs.existsSync(outputFilePath)==true){
//         pass=true
//       }
//       if(pass==false){
//         var kwargs={
//           'input_directory':inputFileDirectory,
//           'output_directory':outputFileDirectory,
//           'file_name':filename,
//           // 'json_path':jsonAbsolutePath,
//           'i':index
//         }
        
//         try{
//           // console.log('iterFiles : '+i+'/'+listOfFiles.length)
//           var buffer = fs.readFileSync(listOfFiles[index])
//           var pyWav = new wavefile.WaveFile(buffer)
//           var sr=pyWav.fmt.sampleRate
//           kwargs['sr']=sr
//           if(index<=listOfFiles.length-1){
//             var stringKwargs=''
//             Object.keys(kwargs).forEach(function(key){
//                 stringKwargs+=String(key)+'='+"'"+String(kwargs[key])+"'"+' '
//             })
//             stringKwargs=stringKwargs.substring(0,stringKwargs.length)
//             var command = baseCommand+' '+stringKwargs
//             console.log(command)
//             child_process.exec(command,function(err,stdout,stderr){
//               if(err!==null){  
//                 // console.log(err)
//                 pythonChallengeList.push({file:listOfFiles[index],error:err})
//                 global.pythonChallengeList=pythonChallengeList
//                 challengeList.push(listOfFiles[index])
//                 var challengeFileName=path.basename(listOfFiles[index])
//                 var challengeFileDir=null
//                 for (var i =0; i<files.length; i++){
//                   if(path.basename(files[i].path)==challengeFileName){
//                     console.log(challengeFileName+' challenge accepted!')
//                     challengeFileDir=path.dirname(files[i].path)
//                   }
//                 }
//                 if(challengeFileDir!=null){
//                   move(path.join(challengeFileDir,challengeFileName),path.join(errorPathDirectory,challengeFileName),function(){
//                     setTimeout(function(){
//                       // console.log('path 1')
//                       // console.log(index+1)
//                       iterFiles(listOfFiles,index+1,baseCommand)
//                     })
//                   })
//                 }
//                 else{
//                   fs.mkdir(fullPathDirectory,function(){
//                     setTimeout(function(){
//                       // console.log('path 2')
//                       // console.log(index+1)
//                       iterFiles(listOfFiles,index+1,baseCommand)
//                     })
//                   });
//                 }
                
                
//                 document.getElementById('text').innerHTML=percentage
//                 document.getElementById('bar').style.width = percentage
//                 // document.getElementById('bar').style.backgroundColor='rgb(255,179,78)'
//               }
//               else{
//                 // console.log(stdout)
//                 setTimeout(function(){
//                   // console.log('path 3')
//                   // console.log(index+1)
//                   iterFiles(listOfFiles,index+1,baseCommand)
//                 })
//                 document.getElementById('text').innerHTML=percentage
//                 document.getElementById('bar').style.width=percentage
//               }
//             })
//           } 
//         }
//         catch(e){
//             challengeList.push(listOfFiles[index])  
//             setTimeout(function(){
//               // console.log('path 4')
//               // console.log(index+1)
//               iterFiles(listOfFiles,index+1,baseCommand)
//             })
//             document.getElementById('text').innerHTML=percentage
//             document.getElementById('bar').style.width = percentage
//         }
//       }
//       else{
//         setTimeout(function(){
//           iterFiles(listOfFiles,index+1,baseCommand)
//         })
//         document.getElementById('text').innerHTML=percentage
//         document.getElementById('bar').style.width=percentage
//       }
//     }
//     function cb(){
//       if(i<files.length-1){
//         var percentage=Math.floor((i/(files.length-1))*10000)/100+'%'
//         document.getElementById('text').innerHTML= percentage
//         document.getElementById('bar').style.width = percentage;
//         setTimeout(function(){
//           mainFunction(files,i+1)
//         }) 
//       }
//       else if(i>=files.length-1){
//         document.getElementById('text').innerHTML="Please Wait For mastered_fixed folder to be filled"
//         document.getElementById('bar').style.width = '99%';
//         fs.readdirSync(inputFileDirectory).forEach(function(file){
//           if(getFileExtension(file)=='wav'){
//               filesList.push(path.join(inputFileDirectory,file))
//           }
//         })
//         setTimeout(function(){
//           if (!fs.existsSync(outputFileDirectory)){
//             fs.mkdirSync(outputFileDirectory);
//           }
//           // iterFiles(filesList,0,'python test/outputTest.py')
//           // child_process.exec(prevCommand,function(err,stdout,stderr){
//           //   if(err!==null){  
//           //       console.log(err)
//           //   }
//           //   else{
//           //       console.log(stdout)
//           //   }
//           // })
//           iterFiles(filesList,0,baseBinaryCommand)
          
          
//         })
//         document.getElementById('text').innerHTML='Ready'
//         document.getElementById('bar').style.width ='100%'
//       }
//     }
    
//     if(fs.existsSync(wavPath)==false){
//       try{
//         if(isWav(buffer)==true){
//           var wav = new wavefile.WaveFile(buffer)
//           if(wav.fmt.bitsPerSample!=16){
//             wav.toBitDepth('16')
//             fs.writeFile(wavPath,wav.toBuffer(),function(){
//               cb()
//             })
//           }
//           else{
//             move(files[i].path,wavPath,function(){
//               cb()
//             })
//           }
//         }
//         else{
//           // console.log(path.basename(files[i].path)+' is not wav')
//           mainFunction(files,i+1)
//         } 
//       }
//       catch(e){
//         // console.log('skipped '+path.basename(files[i].path)+' due to error conditions')
//         skippedFiles.push({'path':files[i].path,'error':e})
//         global.skippedFiles=skippedFiles
//         if(ng==false){
//           if (!fs.existsSync(errorPathDirectory)){
//             fs.mkdirSync(errorPathDirectory);
//           }
//         }
//         ng=true
//         move(files[i].path,path.join(errorPathDirectory,fileName),function(){
//           mainFunction(files,i+1)
//         })          
//       }
//     }
//     else{
//       // console.log('File Already exists')
//       // mainFunction(files,i+1)
//       cb()
//     }
//   }
//   mainFunction(files,0)  
// }

var fs = require('fs');
var path = require('path')
var isWav = require('is-wav');
const wavefile = require('wavefile');
const electron = require('electron');
const FileType = require('file-type');
const child_process=require('child_process')
var totalSplineTime=0;
var splineFunctionTotal=0;
function getFileExtension(filename){
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}
function warmWav(wavPath, newFilePath){
    const binding = require('./binary_build/build/Release/addon');
    var fs = require('fs');
    var wav = require('node-wav');
    var buffer = fs.readFileSync(wavPath);
    var result = wav.decode(buffer);
    var arbitraryLength=result.channelData[0].length;
    var sampleRate = result.sampleRate;
    var start=process.hrtime()
    if(result.channelData[1]==undefined){
        const float32arrayLeft = new Float32Array(arbitraryLength);
        for (var i =0; i<arbitraryLength; i++){
            float32arrayLeft[i]=result.channelData[0][i];
        }
        var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
        var arrayLeft = binding.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
        var arrayRight = arrayLeft.slice();
    }
    else{
        const float32arrayLeft = new Float32Array(arbitraryLength);
        const float32arrayRight = new Float32Array(arbitraryLength);
        for (var i =0; i<arbitraryLength; i++){
            float32arrayLeft[i]=result.channelData[0][i];
            float32arrayRight[i]=result.channelData[1][i];
        }
        var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
        var int32arrayRight = new Int32Array(float32arrayRight.buffer);
        var arrayLeft = binding.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
        var arrayRight = binding.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
    }
    var elapsed=process.hrtime(start)[1]/1000000
    var float32arrayLeft=new Float32Array(arrayLeft)
    var float32arrayRight=new Float32Array(arrayRight)
    var combinedChannel=[float32arrayLeft,float32arrayRight]
    var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})

    fs.writeFile(newFilePath,newWav,function(){
        var precision = 3;
        // console.log(newFilePath+' created in '+elapsed.toFixed(precision)+' ms')
        totalSplineTime+=elapsed;
        splineFunctionTotal++;
    })
}
function move(oldPath, newPath, callback) {
  //fs.rename(oldPath, newPath, function (err) {
  fs.copyFile(oldPath, newPath, function (err) {
      if (err) {
          if (err.code === 'EXDEV') {
              copy();
          } else {
              callback(err);
          }
          return;
      }
      callback();
  });
  function copy() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);
      readStream.on('error', callback);
      writeStream.on('error', callback);
      readStream.on('close', function () {
          //fs.unlink(oldPath, callback);
          //console.log('copied')
      });
      readStream.pipe(writeStream);
  }
}
document.getElementById('party').addEventListener('click', function() {
    document.getElementById('business').click()
})
document.getElementById('business').onchange = function(e){ 
  var skippedFiles=[]
  var filesList=[]
  var challengeList=[]
  var pythonChallengeList=[]
  var files = e.target.files; // FileList object
  const desktopPath = (electron.app || electron.remote.app).getPath('desktop');
  var fullPathDirectory=path.join(desktopPath,'mastered_files')
  var tempAudioDir=path.join(desktopPath,'temp_audio')
  var tempAudioExists=false
  var filesInTempAudioList=[]
  var errorPathDirectory=path.join(desktopPath,'error_files')
  var inputFileDirectory=path.join(desktopPath,'mastered_files')
  var outputFileDirectory=path.join(desktopPath,'mastered_fixed')
  var nextFullPathDirectory=path.join(desktopPath,'mastered_fixed')
  var baseBinaryPath = path.join(__dirname,'dist/spline')
  var nextResourceBinary=path.join(__dirname,'dist/prep')
  var nextBinaryPath = path.join(nextFullPathDirectory,'prep')
  const prevCommand = nextResourceBinary.replace(/(\s+)/g, '\\$1')
  const baseBinaryCommand = baseBinaryPath.replace(/(\s+)/g, '\\$1')

  var ng=false
  
  const mainFunction=function(files,i){
    if(files.length-1!==i){
      if(files[i].path!==undefined){
        var filePath = files[i].path
        var buffer = fs.readFileSync(filePath)
        //to do if file is AIFF. run ffmpeg -i "files[i].path" "temp.wav"
        var fileName=path.basename(filePath)
        var wavPath=path.join(fullPathDirectory,fileName)
        var percentage=Math.floor((i/(files.length-1))*10000)/100+'%'
        function upPercentage(percentage){
          //console.log(path.basename(files[i].path)+' is not wav')
          //console.log('not wav run')
          document.getElementById('text').innerHTML= percentage
          document.getElementById('bar').style.width = percentage;
          setTimeout(function(){
            mainFunction(files,i+1)
          })
        }
        if(fs.existsSync(wavPath)==true){
          // console.log('file exists run')     
          // document.getElementById('text').innerHTML= percentage
          // document.getElementById('bar').style.width = percentage;
          // setTimeout(function(){
          //   mainFunction(files,i+1)
          // }) 
          upPercentage(percentage);
        }
        else{
          // try{
            if(isWav(buffer)==true){
                // console.log('normal run')
                try{
                  warmWav(files[i].path,wavPath)
                  upPercentage(percentage);
                }
                catch(e){
                  console.log(fileName+' isWav Error')
                  upPercentage(percentage)
                }
                // document.getElementById('text').innerHTML= percentage
                // document.getElementById('bar').style.width = percentage;
                // setTimeout(function(){
                //   mainFunction(files,i+1)
                // }) 
                
            }
            else{
              //to do if file is AIFF. run ffmpeg -i "files[i].path" "temp.wav"
              function checkFileIsAudio(buffer,callback){
                FileType.fromBuffer(buffer).then(function(res){
                  if(res==undefined){
                    // console.log(fileName+' mime : '+res)
                  }
                  else{
                    fileMime=res.mime.match('audio')!==null
                    callback(fileMime)
                  }
                    upPercentage(percentage)
                }) 
              }
              // function FFMPEGIT(inPath,outPath,errorPathDirectory,callback){
              function FFMPEGIT(inPath,outPath,errorPathDirectory){  
                var outPathDir = path.dirname(outPath)
                var fileName=path.basename(inPath)
                // var tempFilePath = path.join(outPathDir,'temp.wav')
                var newFileName=path.parse(fileName).name+'.wav'
                var newOutWavPath=path.join(outPathDir,newFileName)
                if (!fs.existsSync(outPathDir)){
                  fs.mkdirSync(outPathDir,{recursive:true});
                }
                // var command = "ffmpeg -i "+"\""+ inPath +"\""+" "+"\""+ tempFilePath +"\"";
                var command = "ffmpeg -i "+"\""+ inPath +"\""+" "+"\""+ newOutWavPath +"\"";
                child_process.exec(command,function(err,stdout,stderr){
                  if(err!==null){  
                    console.log('ffmpeg ng run : ' +fileName)
                    // console.log(err)
                    // skippedFiles.push({'path':inPath,'error':err})
                    // global.skippedFiles=skippedFiles
                    if(ng==false){
                      if (!fs.existsSync(errorPathDirectory)){
                        fs.mkdirSync(errorPathDirectory,{recursive:true});
                      }
                    }
                    ng=true
                    move(inPath,path.join(errorPathDirectory,fileName),function(){
                      // document.getElementById('text').innerHTML= percentage
                      // document.getElementById('bar').style.width = percentage;
                      // setTimeout(function(){
                      //   mainFunction(files,i+1)
                      // }) 
                      //callback()
                      upPercentage(percentage);
                    })  
                  }
                  else{
                    // mainFunction(files,i+1)
                    
                    console.log('ffmpeg->warmWav : '+newFileName)
                    try{
                      // warmWav(tempFilePath,newOutWavPath)
                      warmWav(newOutWavPath,newOutWavPath)
                      upPercentage(percentage);
                    }
                    catch(e){
                      console.log(fileName+' ffmpeg->warmWav Error')
                      upPercentage(percentage)
                    }
                    // document.getElementById('text').innerHTML= percentage
                    // document.getElementById('bar').style.width = percentage;
                    // setTimeout(function(){
                    //   mainFunction(files,i+1)
                    // }) 
                    //callback()
                    upPercentage(percentage);
                  }
                })
                
              }
              
              function thisOrThat(cond1){
                if(cond1==true){
                  // FFMPEGIT(files[i].path,wavPath,errorPathDirectory)
                  if(tempAudioExists==false){
                    if(fs.existsSync(tempAudioDir)==false){
                      fs.mkdirSync(tempAudioDir,{recursive:true})
                    }
                  }
                  tempAudioExists=true
                  var tempAudioPath=path.join(tempAudioDir,fileName)
                  move(files[i].path,tempAudioPath,console.log)
                  filesInTempAudioList.push(tempAudioPath)
                }
                else{
                  console.log(path.basename(files[i].path)+' is not audio')
                  upPercentage(percentage)
                }
              }
              checkFileIsAudio(buffer,thisOrThat)
              
               
            } 
          // }
          // catch(e){
          //   // console.log('skipped '+path.basename(files[i].path)+' due to error conditions')
          //   console.log('ng run')
          //   skippedFiles.push({'path':files[i].path,'error':e})
          //   global.skippedFiles=skippedFiles
          //   if(ng==false){
          //     if (!fs.existsSync(errorPathDirectory)){
          //       fs.mkdirSync(errorPathDirectory);
          //     }
          //   }
          //   ng=true
          //   move(files[i].path,path.join(errorPathDirectory,fileName),function(){
          //     // document.getElementById('text').innerHTML= percentage
          //     // document.getElementById('bar').style.width = percentage;
          //     // setTimeout(function(){
          //     //   mainFunction(files,i+1)
          //     // }) 
          //     upPercentage(percentage);
          //   })          
          // }
          
        }
      }
      else{
        console.log('file path undefined run')
        // document.getElementById('text').innerHTML= percentage
        // document.getElementById('bar').style.width = percentage;
        // setTimeout(function(){
        //   mainFunction(files,i+1)
        // }) 
        upPercentage(percentage);
      }
    }
    else{
      console.log('finish run')
      console.log(filesInTempAudioList)
      // todo : python convert.py inputDir="/Users/bernardahn/Splice" outputDir="/Users/bernardahn/Desktop/temp_audio" errorDir="/Users/bernardahn/Desktop/error_files""
      document.getElementById('text').innerHTML='Ready'
      document.getElementById('bar').style.width ='100%'
    }
  }
  if (!fs.existsSync(fullPathDirectory)){
    fs.mkdirSync(fullPathDirectory);
  }
  mainFunction(files,0)  
}