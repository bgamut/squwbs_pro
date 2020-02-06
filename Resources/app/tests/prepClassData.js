var fs = require('fs');
var path = require('path')
var wav = require('node-wav');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
var tf = require('@tensorflow/tfjs')
var ml5 = require('ml5')
const fft = require('../src/binary_build/fft/build/Release/addon').AcceptArrayBuffer;
// var fullPathDirectory=path.join(desktopPath,'mastered_files')
var inputDir='/Users/bernardahn/Desktop/tf_data_prep'
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
                const arrayLeft = new Array(quantizedLength);
                var maxVal=0
                for (var i =0; i<quantizedLength; i+=jump){
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
//mp3towav(inputDir)

var rootDir='/Users/bernardahn/Desktop/tf_data_prep'
async function run(rootDir) {
    console.log('hello world')
    console.log('ml5 version:', ml5.version);
    const classifier = ml5.featureExtractor('MobileNet',modelLoaded)
    var todo=[]
    var classNames=[]
    var className=""
    fs.readdir(rootDir,function(err,directories){
        for (var index =0; index<directories.length; index++){
            var currentDir=path.join(rootDir,directories[index])
            if(fs.lstatSync(currentDir).isDirectory()){
                var files=fs.readdirSync(currentDir)
                for (var fileIndex=0; fileIndex<files.length; fileIndex++){
                    var extIndex=files[fileIndex].split('.').length-1
                    if(files[fileIndex].split('.')[extIndex]=='wav'){
                        className=path.basename(currentDir)
                        if (classNames.includes(className)==false){
                            classNames.push(className)
                        }
                        console.log(path.join(currentDir,files[fileIndex]))
                        //console.log(path.basename(currentDir))
                        var buffer = fs.readFileSync(path.join(currentDir,files[fileIndex]))
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
                            var oneLine=fft(int32arrayLeft.buffer,sampleRate)
                            for(var k=0; k<oneLine.length; k++){
                                //console.log(oneLine[k])
                                spectrogram.push(oneLine[k]);
                            }
                        }
                        var end = process.hrtime(start)
                        console.log('took %d.%ds',end[0],end[1])
                        console.log(spectrogram.length)
                        var summary={input:spectrogram.slice(),outputClass:className,output:[]}
                        todo.push(summary)
                    }
                }
            }
        }
        classNames.sort()
        var inputLength=todo[0].input.length
        var oneHotLength=classNames.length
        var inputs=[]
        var outputs=[]
        for(var i =0; i<todo.length; i++){
            var hotIndex=classNames.indexOf(todo[i].outputClass)
            for(var j=0; j<oneHotLength; j++){
                if(j==hotIndex){
                    todo[i].output[j]=1
                }
                else{
                    todo[i].output[j]=0
                }
            }
            inputs.push(todo[i].input)
            outputs.push(todo[i].output)
        }

        console.log(todo)
        async function modelCreate(inputs,outputs,inputLength,oneHotLength){
            const model = tf.sequential();
            model.add(tf.layers.dense({ inputShape: [inputLength], units: oneHotLength ,activation:"relu"}));
            model.add(tf.layers.dense({units: oneHotLength, activation: 'softmax'}));
            // Prepare the model for training: Specify the loss and the optimizer.
            // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
            model.compile({ metrics:['accuracy'],loss: 'meanSquaredError', optimizer: 'adam' });

            // Generate some synthetic data for training. (y = 2x - 1)
            //const xs = tf.tensor([[-1, 2, 3], [0, 2, 3], [1, 2, 3], [2, 2, 3], [3, 2, 3], [4, 2, 3]]);
            //const ys = tf.tensor([[1,0,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,0,1]]);
            const xs = tf.tensor(inputs)
            const ys = tf.tensor(outputs)

            // Train the model using the data.
            await model.fit(xs, ys, { 
                epochs: 20000 ,
                validationSplit:0.125, 
                shuffle:true,
                callbacks:{
                    onTrainBegin:function(){console.log('began')},
                    onEpochEnd:function(num,logs){console.log('epoch # '+num +' loss : '+logs.loss+" memory : "+tf.memory().numTensors)},
                    onBatchEnd:function(num,logs){tf.nextFrame()},
                    onTrainEnd:function(){console.log('end')},
                }
            });

            // Use the model to do inference on a data point the model hasn't seen.
            // Should print approximately 39.
            var a =model.predict(tf.tensor([todo[0].input])).dataSync()
            for(index in a){
                if(Math.round(a[index])==1){
                    console.log(index)
                    console.log(classNames[index])
                }
            }
            var modelPath=path.join(inputDir,'saved_model.json')
            await model.save(modelPath)
            console.log('model saved')
        }
            modelCreate(inputs,outputs,inputLength,oneHotLength)
        })

}
run(rootDir)