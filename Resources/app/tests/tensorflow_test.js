var tf = require('@tensorflow/tfjs')
var json = require('../src/assets/sampleDataLabels.json')
var path = require('path')
var header=json.header
var data=json.data
var testXS=[]
var testYS=[]
data.forEach(function(entry){
    var initArray= new Array(header.length).fill(0)
    //console.log(entry)
    testXS.push(entry.hashes)
    initArray[Number(entry.category)]=1
    testYS.push(initArray)
})
//console.log(testXS)
//console.log(testYS)

async function run() {
    // Create a simple model.
    const model = tf.sequential();
    // model.add(tf.layers.dense({ inputShape: [3], units: 5 ,activation:"relu"}));
    // model.add(tf.layers.dense({units: 5, activation: 'softmax'}));
    model.add(tf.layers.dense({ inputShape: [header.length], units: header.length ,activation:"relu"}));
    model.add(tf.layers.dense({units: header.length, activation: 'softmax'}));
    // Prepare the model for training: Specify the loss and the optimizer.
    // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    model.compile({ metrics:['accuracy'],loss: 'meanSquaredError', optimizer: 'adam' });
  
    // Generate some synthetic data for training. (y = 2x - 1)
    //const xs = tf.tensor([[-1, 2, 3], [0, 2, 3], [1, 2, 3], [2, 2, 3], [3, 2, 3], [4, 2, 3]]);
    //const ys = tf.tensor([[1,0,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,0,1]]);
    const xs = tf.tensor(testXS)
    const ys = tf.tensor(testYS)
    // Train the model using the data.
    await model.fit(xs, ys, { 
        epochs: 30000 ,
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
      var a =model.predict(tf.tensor([[3, 2, 3]])).dataSync()
      for(index in a){
          if(Math.round(a[index])==1){
              console.log(index)
          }
      }
    //   console.log(a);
    //model.save()
  }
  async function loadModel(){
    const model = await tf.loadLayersModel('http://127.0.0.1:8000/model-json')
    console.log(model)
    return model
  }
  
loadModel()