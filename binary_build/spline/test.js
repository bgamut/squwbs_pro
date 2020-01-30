// // note that the compiled addon is placed under following path
// const {Hello} = require('./build/Release/addon');

// // `Hello` function returns a string, so we have to console.log it!
// console.log(Hello());

// const {IsPrime} = require('./build/Release/addon'); // native c++
// const isPrime = require('./isPrime'); // js

// const number = 654188429; // thirty-fifth million first prime number (see https://primes.utm.edu/lists/small/millions/)
// const NATIVE = 'native';
// const JS = 'js';

// console.time(NATIVE);
// console.log(`${NATIVE}: checking whether ${number} is prime... ${IsPrime(number)}`);
// console.timeEnd(NATIVE);
// console.log('');
// console.time(JS);
// console.log(`${JS}: checking whether ${number} is prime... ${isPrime(number)}`);
// console.timeEnd(JS);

// const addon = require('./build/Release/addon');
// console.log(addon.add(3,5))
//const exampleWavPath='/Users/bernardahn/Desktop/mastered_files/05_130BPM_Dmin_Rise_FX_1.wav'
const wavPath='/input.wav'
const binding = require('./build/Release/addon');
var fs = require('fs');
var wav = require('node-wav');
var buffer = fs.readFileSync(wavPath);
var result = wav.decode(buffer);
//console.log(result.channelData);
var arbitraryLength=result.channelData[0].length;
var sampleRate = result.sampleRate;
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
    var arrayRight = binding.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
}

// console.log(sampleRate)
console.log(arbitraryLength)
console.log(arrayLeft.length)
console.log(arrayRight.length)
var float32arrayLeft=new Float32Array(arrayLeft)
var float32arrayRight=new Float32Array(arrayRight)
var combinedChannel=[float32arrayLeft,float32arrayRight]
// for(var i =0; i<arrayLeft.length; i++){
//     console.log(float32arrayRight[i])
// }
//console.log(int32arrayRight)
var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})
var newFilePath='/example.wav'
fs.writeFile(newFilePath,newWav,function(){
    console.log('check file')
  })