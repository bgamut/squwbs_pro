const fs = require('fs')
const Spectro = require('spectro')
const PNG = require('pngjs').PNG
console.log('starting init')
const colorMap = {
	'130': '#fff',
	'90': '#f00',
	'40': '#00f',
	'10': '#000',
}
var cFunc = Spectro.colorize(colorMap)

const wFunc = 'Blackman'
var spectro = new Spectro({
	overlap: 0.5,
	wFunc: wFunc
})

console.log('reading file')
var audioFile = fs.createReadStream('/Users/bernardahn/Desktop/tf_data_prep/loops/140_G#m_Dolphin_SoftChords.wav', {start: 44})
audioFile.pipe(spectro)


function createImage(spectrogram) {
    console.log('creating image')
	// Create a png
	var png = new PNG({
		width: spectrogram.length,
		height: spectrogram[0].length,
		filterType: -1
	})
	for (var y = 0; y < png.height; y++) {
		for (var x = 0; x < png.width; x++) {

			// Get the color
			var intensity = spectrogram[x][png.height - y - 1]
			// Now we can use the colorize function to get rgb values for the amplitude
			var col = cFunc(intensity)

			// Draw the pixel
			var idx = (png.width * y + x) << 2
			png.data[idx  ] = col[0]
			png.data[idx+1] = col[1]
			png.data[idx+2] = col[2]
			png.data[idx+3] = 255
        }
        console.log(y/png.height)
	}
	png.pack().pipe(fs.createWriteStream(__dirname + wFunc + '.png'))
	console.log(`Spectrogram written to ${wFunc}.png`)
}

// Capture when the file stream completed
var fileRead = false
audioFile.on('end', () => {fileRead = true,console.log('done reading file')})

spectro.on('data', (err, frame) => {
	// Check if any error occured
	if (err) return console.error('Spectro ended with error:', err)
})

spectro.on('end', (err, data) => {
	// Check if the file was read completely
	if (fileRead !== true) return console.log('Have not finished reading file')
	// Check if any error occured
	if (err) return console.error('Spectro ended with error:', err)
	// Stop spectro from waiting for data and stop all of it's workers
	spectro.stop()
	
	const time = (spectro.getExecutionTime() / 1000) + 's'
	console.log(`Spectrogram created in ${time}`)

	const max = Spectro.maxApplitude(data)
	const min = Spectro.minApplitude(data)
	console.log(`Max amplitude is ${max}, min amplitude is ${min}`)

	createImage(data)
})

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
const commonPath=require('common-path')
var totalSplineTime=0;
var splineFunctionTotal=0;
function getFileExtension(filename){
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}
const readdirSync = (p, a = []) => {
  if (fs.statSync(p).isDirectory())
    fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a))
  return a
}


function warmWav(wavPath, newFilePath){
    const binding = require('./binary_build/spline/build/Release/addon');
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
  // var tempAudioDir=path.join(desktopPath,'temp_audio')
  var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  var tempAudioDirExists=false
  var wavDirectory=path.join(fullPathDirectory,'wav')
  var filesInTempAudioList=[]
  // var errorPathDirectory=path.join(desktopPath,'error_files')
  var errorPathDirectory=path.join(fullPathDirectory,'error_files')
  // var inputFileDirectory=path.join(desktopPath,'mastered_files')
  var inputFileDirectory=path.join(fullPathDirectory,'mastered_files')
  // var outputFileDirectory=path.join(desktopPath,'mastered_fixed')
  var outputFileDirectory=path.join(fullPathDirectory,'mastered_fixed')
  // var nextFullPathDirectory=path.join(desktopPath,'mastered_fixed')
  var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
  var baseBinaryPath = path.join(__dirname,'dist/spline')
  var nextResourceBinary=path.join(__dirname,'dist/prep')
  var nextBinaryPath = path.join(nextFullPathDirectory,'prep')
  const prevCommand = nextResourceBinary.replace(/(\s+)/g, '\\$1')
  const baseBinaryCommand = baseBinaryPath.replace(/(\s+)/g, '\\$1')
  var wavDirectoryExists=false
  var ng=false
  

  const mainFunction=function(files,i){
    if(files.length-1!==i){
      if(files[i]!==undefined){
        var filePath = files[i].path
        //var buffer = fs.readFileSync(filePath)
        //to do if file is AIFF. run ffmpeg -i "files[i].path" "temp.wav"
        var fileName=path.basename(filePath)
        // var wavPath=path.join(fullPathDirectory,fileName)
        var wavPath=path.join(wavDirectory,fileName)
        if(wavDirectoryExists==false){
          if(fs.existsSync(wavDirectory)==false){
            fs.mkdirSync(wavDirectory) 
          }
          wavDirectoryExists=true
        }
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
        // function checkFileIsAudio(buffer,callback){
        //   FileType.fromBuffer(buffer).then(function(res){
        //     if(res==undefined){
        //       // console.log(fileName+' mime : '+res)
        //     }
        //     else{
        //       fileMime=res.mime.match('audio')!==null
        //       callback(fileMime)
        //     }
        //       upPercentage(percentage)
        //   }) 
        // }
        if(fs.existsSync(wavPath)==true){
          console.log('file exists run')     
          document.getElementById('text').innerHTML= percentage
          document.getElementById('bar').style.width = percentage;
          setTimeout(function(){
            mainFunction(files,i+1)
          })
        }
        else{
          try{
            warmWav(files[i].path,wavPath)
            fs.unlinkSync(files[i].path)
            document.getElementById('text').innerHTML= percentage
            document.getElementById('bar').style.width = percentage;
            setTimeout(function(){
              mainFunction(files,i+1)
            })
          }
          catch(e){
            var errorFilePath=path.join(errorPathDirectory,fileName)
            // move(files[i].path,errorFilePath,function(){
            //   console.log(fileName+' warmwav Error : '+e)
            // })
            document.getElementById('text').innerHTML= percentage
            document.getElementById('bar').style.width = percentage;
            setTimeout(function(){
              mainFunction(files,i+1)
            })
          }               
        }
      }
      else{
        console.log('file path undefined run')
        document.getElementById('text').innerHTML= percentage
        document.getElementById('bar').style.width = percentage;
        setTimeout(function(){
          mainFunction(files,i+1)
        })
      }
    }
    else{
      console.log('finish run')
      var newFileList=readdirSync(wavDirectory)
      function postWork(fileList,i,desiredExt){
        var fileName=path.basename(fileList[i])
        var fileNameOnly=fileName.split('.')[0]
        var newFileName=fileNameOnly+'.'+desiredExt
        var percentage=Math.floor((i/(fileList.length-1))*10000)/100+'%'
        document.getElementById('text').innerHTML= percentage
        document.getElementById('bar').style.width = percentage;
        if(fs.lstatSync(fileList[i]).isDirectory()==false){
          if(path.extname(fileList[i])=='.'+desiredExt){
            move(fileList[i],path.join(fullPathDirectory,fileName),function(){
              if(i+1<fileList.length){
                setTimeout(function(){
                  postWork(fileList,i+1,desiredExt)
                })
              }
              else{
                console.log('callback should fit here')
                fs.readdir(wavDirectory,function(err,files){
                  files.forEach(function(file){
                    fs.unlinkSync(file)
                  })
                })
                document.getElementById('text').innerHTML='Ready'
                document.getElementById('bar').style.width ='100%'
              }
            })  
          }
          else{
            var newOutputFilePath=path.join(fullPathDirectory,newFileName)
            var baseCommand=path.join(process.cwd(),'binary_build/ffmpeg_convert/dist/convert')
            var command=baseCommand+' inputFilePath="'+fileList[i]+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
            // console.log(command)
            child_process.exec(command,function(err,stdout,stderr){
              if(err!==null){  
                console.log(err)
              }
              else{
                // console.log(stdout)
              }
              if(i+1<fileList.length){

                setTimeout(function(){
                  fs.unlinkSync(fileList[i])
                  postWork(fileList,i+1,desiredExt)
                })
                
              }
              else{
                console.log('callback should fit here')
                
                fs.readdir(wavDirectory,function(err,files){
                  files.forEach(function(file){
                    // fs.unlinkSync(file)
                    var tempFilePath=path.join(tempAudioDir,fileName)
                    var fullPath=path.join(wavDirectory,file)
                    move(fullPath,tempFilePath,function(){
                      console.log(file+ 'moved to error files')
                    })
                  })
                })
                document.getElementById('text').innerHTML='Ready'
                document.getElementById('bar').style.width ='100%'
              }
            })  
          }
        }
        else{
          postWork(fileList,i+1,desiredExt)
        }
      }
      postWork(newFileList,0,'mp3')
      //console.log(filesInTempAudioList)
    }
  }
  const preMastering=function(inputDir,tempAudioDir,errorPathDirectory){
    // document.getElementById('text').innerHTML= 'preprocessing in progress'
    // document.getElementById('bar').style.color = 'green';
    var baseCommand=path.join(process.cwd(),'binary_build/ffmpeg_convert/dist/convert')
      // todo : python convert.py inputDir="/Users/bernardahn/Splice" outputDir="/Users/bernardahn/Desktop/temp_audio" errorDir="/Users/bernardahn/Desktop/error_files""
      // var newFileList=[]
      var newFileList=readdirSync(inputDir)
      console.log(newFileList)
      // fs.readdir(inputDir,function(err,files){
      //   files.forEach(function(file){
      //     newFileList.push({'path':path.join(inputDir,file)})
      //   })
        // console.log(newFileList)
        //var command=baseCommand+' inputDir="'+inputDir+'" outputDir="'+tempAudioDir+'" errorDir="'+errorPathDirectory+'"'
        // for (var i=0; i<newFileList.length;i++){
        function preWork(fileList,i,desiredExt){
          var fileName=path.basename(fileList[i])
          var fileNameOnly=fileName.split('.')[0]
          var newFileName=fileNameOnly+'.'+desiredExt
          // console.log(newFileName)
          var percentage=Math.floor((i/(fileList.length-1))*10000)/100+'%'
          document.getElementById('text').innerHTML= percentage
          document.getElementById('bar').style.width = percentage;
          
            if(fs.lstatSync(fileList[i]).isDirectory()==false){
              if(fs.existsSync(path.join(tempAudioDir,fileName))==true){
                if(i+1<fileList.length){
                  setTimeout(function(){
                    preWork(fileList,i+1,desiredExt)
                  })
                }
                else{
                  console.log('callback should fit here')
                  var newFileList=[]
                  fs.readdir(tempAudioDir,function(err,files){
                    files.forEach(function(file){
                      newFileList.push({'path':path.join(tempAudioDir,file)})
                    })
                  })
                  mainFunction(newFileList,0) 
                }
              }
              else{
                if(path.extname(fileList[i])=='.'+desiredExt){
                  move(fileList[i],path.join(tempAudioDir,fileName),function(){
                    if(i+1<fileList.length){
                      setTimeout(function(){
                        preWork(fileList,i+1,desiredExt)
                      })
                    }
                    else{
                      console.log('callback should fit here')
                      var newFileList=[]
                      fs.readdir(tempAudioDir,function(err,files){
                        files.forEach(function(file){
                          newFileList.push({'path':path.join(tempAudioDir,file)})
                        })
                      })
                      mainFunction(newFileList,0) 
                    }
                  })  
                }
                else{
                  var newOutputFilePath=path.join(tempAudioDir,newFileName)
                  var command=baseCommand+' inputFilePath="'+fileList[i]+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
                  // console.log(command)
                  child_process.exec(command,function(err,stdout,stderr){
                    if(err!==null){  
                      console.log(err)
                    }
                    else{
                      // console.log(stdout)
                    }
                    if(i+1<fileList.length){

                      setTimeout(function(){
                        preWork(fileList,i+1,desiredExt)
                      })
                      
                    }
                    else{
                      console.log('callback should fit here')
                      var newFileList=[]
                      fs.readdir(tempAudioDir,function(err,files){
                        files.forEach(function(file){
                          newFileList.push({'path':path.join(tempAudioDir,file)})
                        })
                      })
                      mainFunction(newFileList,0) 
                    }
                  })  
                }
              }
            }
            else{
              preWork(fileList,i+1,desiredExt)
            }
          
        }
        preWork(newFileList,0,'wav')
  }
  if (!fs.existsSync(fullPathDirectory)){
    fs.mkdirSync(fullPathDirectory);
    fs.mkdirSync(tempAudioDir);
    fs.mkdirSync(errorPathDirectory);
    fs.mkdirSync(wavDirectory)
  }
  function moveToTemp(files,i){
    var origPath=files[i].path
    var percentage=Math.floor((i/(files.length-1))*10000)/100+'%'
    var paths=[]
    for(var i=0; i<files.length; i++){
      var fileName=path.basename(files[i].path)
      var tempAudioPath=path.join(tempAudioDir,fileName)
      paths.push(files[i].path)
    }
    var common = commonPath(paths).commonDir
    console.log(common)
    preMastering(common,tempAudioDir,errorPathDirectory)
  }

  
  moveToTemp(files,0) 
}