var express = require('express');
const cors = require('cors')

require('module-alias/register')
const path = require('path');
var cookieParser = require('cookie-parser')
var flash = require('connect-flash')
var net = require('net')
var fs=require('fs')
var wav = require('node-wav');
var isWav=require('is-wav')
var child_process=require('child_process')
const binding = require('../binary_build/spline/build/Release/addon');
const fft = require('../binary_build/fft/build/Release/addon').AcceptArrayBuffer;
var PNGImage = require('pngjs-image')



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

console.log(require('path').join(require('os').homedir(), 'Desktop'))
var server = net.createServer(function(socket){
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
// server.listen(1337)

module.exports.expressServer = function (portnumber){
if (process.env.DYNO) {
  trustProxy = true;
}
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine','ejs')
app.use((err, req, res, next) => {
  res.locals.session = req.session
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})
app.use(cookieParser('keyboard cat'))
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(flash())
app.use(express.static(path.join(__dirname, '/../../build')));
app.use(express.static(path.join(__dirname, '/html/*/*')));
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
app.get('/',cors(), function (req, res) {
    res.render(path.join(__dirname, 'build','index.html'));
})
app.get('/handshake',cors(),function(req,res){
  var obj={message:'hand shook',number:req.query.number}
  console.log(JSON.stringify(obj))
  //var child=child_process.execSync('node ./tests/image_iteration.js')
  //console.log(child)
  res.send(obj)
})
app.get('/reset-port-number',cors(),function(req,res){
  //console.log(path.join(__dirname,"../sharedInfo.json"))
  var json=JSON.parse(fs.readFileSync(path.join(__dirname,"../assets/sharedInfo.json")))
  json.portnumber=null
  fs.writeFile(path.join(__dirname,"../assets/sharedInfo.json"),JSON.stringify(json),function(){
    console.log('port number reset')
  })
  res.send({message:'port number reset'})
})
app.get('/file-path-list',cors(),function(req,res){
  var fileList=[]
  filesListLength=Object.keys(req.query.files).length
  // for (var i =0; i<filesListLength; i++){
  //   if(path.extname(req.query.files[i])=='.wav'){
  //     console.log(isWav(fs.readFileSync(req.query.files[i]))+req.query.files[i])
  //     // console.log(req.query.files[i])
  //     fileList.push(req.query.files[i])
  //   } 
  // }
  for (var i =0; i<filesListLength; i++){
    if(path.extname(req.query.files[i])=='.png'){
      //console.log(isWav(fs.readFileSync(req.query.files[i]))+req.query.files[i])
      // console.log(req.query.files[i])
      fileList.push({path:req.query.files[i],class:path.basename(path.resolve(req.query.files[i],'..'))})
    } 
  }
  var json={data:fileList}
  fs.writeFile(path.join(__dirname,"../assets/fileList.json"),JSON.stringify(json),function(){
    console.log('fileList written')
  })
  console.log(fileList)
  res.send({data:fileList})
})
app.post('/all-files',cors(),function(req,res){
  //var files=req.param('files')
  var files=req.body.data
  console.log(files)
  var response=[]
  function writePNG(file){
    //console.log(file)
    var extIndex=file.split('.').length-1
    var fileName = path.basename(file)
    if(file.split('.')[extIndex]=='wav'){
        var buffer = fs.readFileSync(file)
        var result = wav.decode(buffer);
        var originalLength=result.channelData[0].length;
        var sampleRate=result.sampleRate
        var newArray=[]
        var frontSilenceTrim=false
        var endSilenceTrim=false
        var start=process.hrtime();
        for (var i=0; i<originalLength; i++){
            if (Math.abs(result.channelData[0][i])>0.0025){
                frontSilenceTrim=true
            }
            if(frontSilenceTrim==true){
                newArray.push(result.channelData[0][i])
            }
        }
        originalLength=newArray.length
        for (var i=originalLength-1; i>=0; i-=1){
            if(endSilenceTrim==false){
                if (Math.abs(result.channelData[0][i])<0.0025){
                    newArray.splice(-1,1)
                }
                else{
                    endSilenceTrim=true
                    originalLength=i+1
                }
            }
        }
        var width=2048
        var bins=2048
        var height=bins/2
        var arbitraryLength=width*height
        var stride = (originalLength-bins)/width
        var spectrogram=[]
        for (var i =0; i<width; i++){
            var tempArray=[]
            for(var j=0; j<bins; j++){
                tempArray[j]=(newArray[Math.floor(i*stride)+j])
            }
            const float32arrayLeft = new Float32Array(tempArray);
            var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
            spectrogram.push(fft(int32arrayLeft.buffer,sampleRate));
        }
        // var end = process.hrtime(start)
        var image=PNGImage.createImage(width,height);
        image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:255})
        for (var j=0; j<height; j++){
            for(var i=0; i<width; i++){
                var gray=Math.floor(255*spectrogram[i][j])
                image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:255})
            }
        }
        // var createdImagePath=path.join('../assets',fileName+'.png')
        var createdImagePath=path.join(__dirname,'../assets/images/'+fileName+'.png')
        image.writeImage(createdImagePath, function (error) {
          //console.log('server Image creation : '+error)
          function check(filePath,i,endIndex,timeout){
            PNGImage.readImage(filePath, function (err, image) {
              if(typeof(err)==='undefined'){
                // return(true)
                var obj={file:filePath,message:'success'}
                console.log(obj)
                response.push(obj)
                //res.send({data:obj})
              }
              else{
                if(i<endIndex){
                  setTimeout(function(){check(filePath,i+1,endIndex,timeout)},timeout)
                }
                else{
                  //return false;
                  var obj={file:filePath,message:'questionable'}
                  console.log(obj)
                  //res.send({data:obj})
                  response.push(obj)
                }
              }
            });
          }
          check(createdImagePath,0,10,800)
        })
      }
  }
  for (var i=0; i<files.length; i++){
    writePNG(files[i])
  }
  res.send({data:response})
})
app.get('/one-file',cors(),function(req,res){

  var filePath=req.query.file
  var userDetails;
  const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  var fullPathDirectory=path.join(desktopPath,'mastered_files')
  var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  var wavDirectory=path.join(fullPathDirectory,'wav')
  var errorPathDirectory=path.join(fullPathDirectory,'error_files')
  var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
  //var tempAudioDir=path.join(fullPathDirectory,'.temp_audio')
  //var wavDirectory=path.join(fullPathDirectory,'.wav')
  //var errorPathDirectory=path.join(fullPathDirectory,'.error_files')
  //var nextFullPathDirectory=path.join(fullPathDirectory,'.mastered_fixed')
  if(fs.existsSync(fullPathDirectory)==false){
    fs.mkdir(fullPathDirectory,function(){
      if(fs.existsSync(tempAudioDir)==false){
        fs.mkdirSync(tempAudioDir) 
      }
      if(fs.existsSync(wavDirectory)==false){
        fs.mkdirSync(wavDirectory) 
      }
      if(fs.existsSync(errorPathDirectory)==false){
        fs.mkdirSync(errorPathDirectory) 
      }
      if(fs.existsSync(nextFullPathDirectory)==false){
        fs.mkdirSync(nextFullPathDirectory) 
      }
    }) 
  }
  else{
    if(fs.existsSync(tempAudioDir)==false){
      fs.mkdirSync(tempAudioDir) 
    }
    if(fs.existsSync(wavDirectory)==false){
      fs.mkdirSync(wavDirectory) 
    }
    if(fs.existsSync(errorPathDirectory)==false){
      fs.mkdirSync(errorPathDirectory) 
    }
    if(fs.existsSync(nextFullPathDirectory)==false){
      fs.mkdirSync(nextFullPathDirectory) 
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  function writePNG(file){
    //console.log(file)
    var extIndex=file.split('.').length-1
    var fileName = path.basename(file)
   
    if(file.split('.')[extIndex]=='wav'){
        var buffer = fs.readFileSync(file)
        var result = wav.decode(buffer);
        var originalLength=result.channelData[0].length;
        var sampleRate=result.sampleRate
        var newArray=[]
        var frontSilenceTrim=false
        var endSilenceTrim=false
        var start=process.hrtime();
        function changeSoundExt(filePath,targetDir,desiredExt,cb){
          var fileName=path.basename(filePath)
          var fileNameOnly=fileName.split('.')[0]
          var newFileName=fileNameOnly+'.'+desiredExt
          //var newOutputFilePath=path.join(tempAudioDir,newFileName)
          var newOutputFilePath=path.join(targetDir,newFileName)
          console.log(newOutputFilePath)
          var baseCommand=path.join(__dirname,'../binary_build/ffmpeg_convert/dist/convert')
          var command=baseCommand+' inputFilePath="'+filePath+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
          child_process.exec(command,function(err,stdout,stderr){
            console.log(stdout)
            if(err!==null){  
              console.log(err)
            }
            if(typeof(cb)!=='undefined'){
              cb()
            }
          }) 
        }
        function warmWav(wavPath, newFilePath){
          const warmer = require('../binary_build/spline/build/Release/addon');
          var buffer = fs.readFileSync(wavPath);
          var result = wav.decode(buffer);
          var arbitraryLength=result.channelData[0].length;
          var sampleRate = result.sampleRate;
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
              var arrayLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
              var arrayRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
          }
          var float32arrayLeft=new Float32Array(arrayLeft)
          var float32arrayRight=new Float32Array(arrayRight)
          var combinedChannel=[float32arrayLeft,float32arrayRight]
          var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})
          function callbackTwo(){
            fs.unlink(path.join(tempAudioDir,fileName),function(){
              fs.unlinkSync(path.join(wavDirectory,fileName))
            })
          }
          fs.writeFile(newFilePath,newWav,function(){
            changeSoundExt(newFilePath,fullPathDirectory,'mp3',callbackTwo)
          })
        }

        for (var i=0; i<originalLength; i++){
            if (Math.abs(result.channelData[0][i])>0.0025){
                frontSilenceTrim=true
            }
            if(frontSilenceTrim==true){
                newArray.push(result.channelData[0][i])
            }
        }
        originalLength=newArray.length
        for (var i=originalLength-1; i>=0; i-=1){
            if(endSilenceTrim==false){
                if (Math.abs(result.channelData[0][i])<0.0025){
                    newArray.splice(-1,1)
                }
                else{
                    endSilenceTrim=true
                    originalLength=i+1
                }
            }
        }
        var bins=2<<7
        var width=bins/2
        var height=bins/8
        var arbitraryLength=width*height
        var stride = (originalLength-bins)/width
        var spectrogram=[]
        for (var i =0; i<width; i++){
            var tempArray=[]
            for(var j=0; j<bins; j++){
                tempArray[j]=(newArray[Math.floor(i*stride)+j])
            }
            const float32arrayLeft = new Float32Array(tempArray);
            var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
            spectrogram.push(fft(int32arrayLeft.buffer,sampleRate));
        }
        // var end = process.hrtime(start)
        var image=PNGImage.createImage(width,height);
        image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:255})
        for (var j=0; j<height; j++){
            for(var i=0; i<width; i++){
                var gray=Math.floor(255*spectrogram[i][j])
                image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:255})
            }
        }

        // var createdImagePath=path.join('../assets',fileName+'.png')
        var createdImagePath=path.join(__dirname,'../assets/images/'+fileName+'.png')
        image.writeImage(createdImagePath, function (error) {
          //console.log('server Image creation : '+error)
          function callbackOne(){
            warmWav(path.join(tempAudioDir,fileName),path.join(wavDirectory,fileName))
          }
          changeSoundExt(filePath,tempAudioDir,'wav',function(){
            console.log(fileName)
            callbackOne()
          })
          function check(filePath,i,endIndex,timeout){
            PNGImage.readImage(filePath, function (err, image) {
              // changeSoundExt(filePath,tempAudioDir,'wav',function(){
              //   console.log(fileName)
              // })
              if(typeof(err)==='undefined'){
                // return(true)
                var obj={file:filePath,message:'success'}
                console.log(obj)
                res.send({data:obj})
              }
              else{
                // if(i<endIndex){
                //   setTimeout(function(){check(filePath,i+1,endIndex,timeout)},timeout)
                // }
                // else{
                //   //return false;
                  var obj={file:filePath,message:'questionable'}
                  console.log(obj)
                  res.send({data:obj})
                // }
              }
              
              
            });
          }
          check(createdImagePath,0,10,800)
        })

      }
    else{
      var obj={file:filePath,message:'not wav'}
        console.log(obj)
        res.send({data:obj})
      }
    }
  
  writePNG(filePath)
    

    
    // console.log("----")
    //console.log(filePath)
    
    // if(typeof(loggit)==='undefined'){
    //   check(filePath,0,10,5000)
    // }
    // console.log("loggit + filePath " + loggit+ ' : '+filePath)
    // var obj={file:filePath}
    //console.log(result)
    //res.send({data:obj})
  
  
  
})
//console.log(path.join(__dirname,'../../build'))
console.log('server started in port number : '+String(portnumber))
app.listen(process.env['PORT'] || portnumber);
}