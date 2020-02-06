const binding = require('./build/Release/addon');
var fs = require('fs');
var wav = require('node-wav');

var wavPath='/Users/bernardahn/Desktop/tf_data_prep/clap/GET_sneek_clap_04.wav'
var buffer = fs.readFileSync(wavPath);
var result = wav.decode(buffer);
var arbitraryLength=result.channelData[0].length;
var sampleRate = result.sampleRate;
// var p5 =require('p5')
// function setup(){
//    console.log('setup function ran')
// }
// function draw(){

// }
if(result.channelData[1]==undefined){
    const float32arrayLeft = new Float32Array(arbitraryLength);
    const float32arrayRight = new Float32Array(arbitraryLength);
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
    // var canvas = createCanvas(2048,1024);
    // background(0,0,255);
    // saveCanvas(canvas,'saved_image','png')
    // var arrayRight = binding.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
}
for (var i = 0; i<arrayLeft.length; i++){
    // if(arrayLeft[i]!=0.0){
    //     if(arrayLeft[i]!=1.0){
    //         console.log(arrayLeft[i])
    //     }
    // }
    if(arrayLeft[i]>=1){
        console.log(arrayLeft[i])
    }
}

// var float32arrayLeft=new Float32Array(arrayLeft)
// var float32arrayRight=new Float32Array(arrayRight)
// var combinedChannel=[float32arrayLeft,float32arrayRight]

// var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})
// var newFilePath='/example.wav'
// fs.writeFile(newFilePath,newWav,function(){
//     console.log('check file')
// })