var fs = require('fs');
var path = require('path')
var wav = require('node-wav');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
// var fullPathDirectory=path.join(desktopPath,'mastered_files')
inputDir='/Users/bernardahn/Desktop/tf_data_prep'
function mp3towav(inputDir){
    const Mp32Wav=require('mp3-to-wav')
    var content=fs.readdirSync(inputDir)
    var subDirs=[]
    for (index in content){    
        const stat = fs.lstatSync(path.join(inputDir,content[index]))
        if (stat.isDirectory()==true){
            subDirs.push(content[index])
        }
    }
    // console.log(subDirs)
    for (subDirIndex in subDirs){
        var subPath=path.join(inputDir,subDirs[subDirIndex])
        var subPathContent = fs.readdirSync(subPath)
        // console.log(subPath)
        for (fileIndex in subPathContent){
            var filePath = path.join(subPath,subPathContent[fileIndex])
            var fileName=path.basename(filePath)
            var fileNameOnly=fileName.split('.')[1]
            if(fileNameOnly=='mp3'){
                console.log(filePath)
                new Mp32Wav(filePath).exec()
                fs.unlinkSync(filePath)
            }
        }
    }
}
function startPrep(inputDir){
    var content=fs.readdirSync(inputDir)
    var subDirs=[]
    var fullJson={data:[]}
    var fullArray=[]
    for (index in content){
        const stat = fs.lstatSync(path.join(inputDir,content[index]))
        if (stat.isDirectory()==true){
            subDirs.push(content[index])
        }
    }
    for (subDirIndex in subDirs){
        var subPath=path.join(inputDir,subDirs[subDirIndex])
        var subPathContent = fs.readdirSync(subPath)
        for (fileIndex in subPathContent){
            var filePath = path.join(subPath,subPathContent[fileIndex])
            var fileName=path.basename(filePath)
            var fileNameOnly=fileName.split('.')[1]
            if(fileNameOnly=='wav'){
                var buffer=fs.readFileSync(filePath)
                var result = wav.decode(buffer);
                var arbitraryLength=result.channelData[0].length;
                var sampleRate = result.sampleRate;
                var quantizedLength=1024
                var jump=Math.floor(arbitraryLength/quantizedLength)
                //only take left channel
               // const float32arrayLeft = new Float32Array(quantizedLength);
                const arrayLeft = new Array(quantizedLength);
                var maxVal=0
                for (var i =0; i<quantizedLength; i+=jump){
                    // float32arrayLeft[i]=result.channelData[0][i];
                    // if(maxVal<Math.abs(float32arrayLeft[i])){
                    //     maxVal=Math.abs(float32arrayLeft[i])
                    // }
                    arrayLeft.push(result.channelData[0][i]);
                    if(maxVal<Math.abs(result.channelData[0][i])){
                        maxVal=Math.abs(result.channelData[0][i])
                    }
                }
                if(maxVal!==0){
                    for (var i =0; i<quantizedLength; i++){
                        arrayLeft[i]=arrayLeft[i]/maxVal
                    }
                }
                var obj={category:String(subDirs[subDirIndex]),sample:arrayLeft}
                fullArray.push(obj)
            }
        }
    }
    outputAddress=path.join(desktopPath,'soundData.json')
    fullJson.data=fullArray
    fs.write(outputAddress,fullJson,function(){
        console.log('check file at '+outputAddress)
    })
}
mp3towav(inputDir)