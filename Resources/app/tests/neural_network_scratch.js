class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this,null,4);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}


class ActivationFunction {
    constructor(func, dfunc) {
      this.func = func;
      this.dfunc = dfunc;
    }
  }
  
  let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
  );
  
  let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
  );
  
  
  class NeuralNetwork {
    /*
    * if first argument is a NeuralNetwork the constructor clones it
    * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
    */
    constructor(in_nodes, hid_nodes, out_nodes) {
      if (in_nodes instanceof NeuralNetwork) {
        let a = in_nodes;
        this.input_nodes = a.input_nodes;
        this.hidden_nodes = a.hidden_nodes;
        this.output_nodes = a.output_nodes;
  
        this.weights_ih = a.weights_ih.copy();
        this.weights_ho = a.weights_ho.copy();
  
        this.bias_h = a.bias_h.copy();
        this.bias_o = a.bias_o.copy();
      } else {
        this.input_nodes = in_nodes;
        this.hidden_nodes = hid_nodes;
        this.output_nodes = out_nodes;
  
        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();
  
        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();
      }
  
      // TODO: copy these as well
      this.setLearningRate();
      this.setActivationFunction();
  
  
    }
  
    predict(input_array) {
  
      // Generating the Hidden Outputs
      let inputs = Matrix.fromArray(input_array);
      let hidden = Matrix.multiply(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      // activation function!
      hidden.map(this.activation_function.func);
  
      // Generating the output's output!
      let output = Matrix.multiply(this.weights_ho, hidden);
      output.add(this.bias_o);
      output.map(this.activation_function.func);
  
      // Sending back to the caller!
      return output.toArray();
    }
  
    setLearningRate(learning_rate = 0.2) {
      this.learning_rate = learning_rate;
    }
  
    setActivationFunction(func = sigmoid) {
      this.activation_function = func;
    }
  
    train(input_array, target_array) {
      // Generating the Hidden Outputs
      let inputs = Matrix.fromArray(input_array);
      let hidden = Matrix.multiply(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      // activation function!
      hidden.map(this.activation_function.func);
  
      // Generating the output's output!
      let outputs = Matrix.multiply(this.weights_ho, hidden);
      outputs.add(this.bias_o);
      outputs.map(this.activation_function.func);
  
      // Convert array to matrix object
      let targets = Matrix.fromArray(target_array);
  
      // Calculate the error
      // ERROR = TARGETS - OUTPUTS
      let output_errors = Matrix.subtract(targets, outputs);
  
      // let gradient = outputs * (1 - outputs);
      // Calculate gradient
      let gradients = Matrix.map(outputs, this.activation_function.dfunc);
      gradients.multiply(output_errors);
      gradients.multiply(this.learning_rate);
  
  
      // Calculate deltas
      let hidden_T = Matrix.transpose(hidden);
      let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
  
      // Adjust the weights by deltas
      this.weights_ho.add(weight_ho_deltas);
      // Adjust the bias by its deltas (which is just the gradients)
      this.bias_o.add(gradients);
  
      // Calculate the hidden layer errors
      let who_t = Matrix.transpose(this.weights_ho);
      let hidden_errors = Matrix.multiply(who_t, output_errors);
  
      // Calculate hidden gradient
      let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
      hidden_gradient.multiply(hidden_errors);
      hidden_gradient.multiply(this.learning_rate);
  
      // Calcuate input->hidden deltas
      let inputs_T = Matrix.transpose(inputs);
      let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
  
      this.weights_ih.add(weight_ih_deltas);
      // Adjust the bias by its deltas (which is just the gradients)
      this.bias_h.add(hidden_gradient);
  
      // outputs.print();
      // targets.print();
      // error.print();
    }
  
    serialize() {
      return JSON.stringify(this,null,4);
    }
  
    static deserialize(data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
      nn.weights_ih = Matrix.deserialize(data.weights_ih);
      nn.weights_ho = Matrix.deserialize(data.weights_ho);
      nn.bias_h = Matrix.deserialize(data.bias_h);
      nn.bias_o = Matrix.deserialize(data.bias_o);
      nn.learning_rate = data.learning_rate;
      return nn;
    }
  
  
    // Adding function for neuro-evolution
    copy() {
      return new NeuralNetwork(this);
    }
  
    // Accept an arbitrary function for mutation
    mutate(func) {
      this.weights_ih.map(func);
      this.weights_ho.map(func);
      this.bias_h.map(func);
      this.bias_o.map(func);
    }
  
  
  
  }

var fs = require('fs')

  function sampleDataTrain() {

    // let training_data = [
    //     [[1,1], [1]],
    //     [[1,0], [0]],
    //     [[0,1], [0]],
    //     [[0,0], [0]],
    //   ];

    let training_data_pre=require('../src/assets/sampleDataLabels.json')
    let training_data=[]
    training_data_pre.data.forEach(function(data,index){
        var inputArray=data.hashes.slice()
        // var maxInput = Math.max(...inputArray)
        // inputArray.forEach(function(el,i){
        //     inputArray[i]=el/maxInput
        // })
        var outputArray=new Array(training_data_pre.header.length).fill(0)
        outputArray[data.category]=1
        //console.log(output)
        training_data.push([inputArray,outputArray])
    })
    console.log(training_data[0][0])
    let mynn = new NeuralNetwork(training_data[0][0].length,training_data[0][0].length,training_data[0][1].length);
    //mynn.setActivation(NeuralNetwork.ReLU)
    console.log("Before training...");
    console.log(mynn.predict(training_data[0][0]));
    var epoch=300000
    // several training epochs
    for(let i=0; i<epoch; i++) {
    var percent='percentage : '+String(Math.floor(i*100000000/epoch)/1000000)
      //console.clear()
      console.log(percent)
      let tdata = training_data[Math.floor(Math.random() * training_data.length)];
      mynn.train(tdata[0], tdata[1]);
    }
    console.log("After training...");
    console.log(mynn.predict(training_data[0][0]));
    fs.writeFile('../src/assets/scratchNN.json', mynn.serialize(), 'utf8', function(){
        console.log('./src/assets/scratchNN.json written')
        var copyWB=require('../src/assets/scratchNN.json')
        console.log(copyWB)
        var newMyAnn=NeuralNetwork.deserialize(copyWB)
        console.log("cloned train data...");
        for (var i =0; i<8; i++){
            var randomPick=Math.floor(Math.random() * training_data.length)
            var oneHot=newMyAnn.predict(training_data[randomPick][0]);
            var sum = oneHot.reduce(function(a,b){return a+b},0)
            var max=Math.max(...oneHot)
            function checkValue(val){
                return val==max
            }
            console.log("============")
            console.log(training_data_pre.data[randomPick].path)
            console.log(training_data_pre.header[oneHot.findIndex(checkValue)]+" confidence : "+Math.floor(oneHot[oneHot.findIndex(checkValue)]*10000/sum)/100 + "%")
        }
        console.log("============")
        
    })
  }
  
  function predict(filePath){
    var baseData=require('../src/assets/sampleDataLabels.json').header
    var initHashDict={}
    baseData.forEach(function(keyword,index){
      initHashDict[keyword]=0
    })
    function makeHotInput(filePath){ 
      filePath.split('/').forEach(function(word){
          var actualWord=word.toLowerCase()
          //keywordList.forEach(function(key){
          Object.keys(initHashDict).forEach(function(key){
              if(actualWord.indexOf(key)!==-1){
                  initHashDict[key]+=1
              }
          })
      })
      return Object.values(initHashDict)
    }
    var copyWB=require('../src/assets/scratchNN.json')
    //console.log(copyWB)
    var newMyAnn=NeuralNetwork.deserialize(copyWB)
    var hotInput=makeHotInput(filePath)
    //console.log(hotInput)
    var oneHot=newMyAnn.predict(hotInput);
    var sum = oneHot.reduce(function(a,b){return a+b},0)
    var max=Math.max(...oneHot)
    function checkValue(val){
        return val==max
    }
    //console.log("============")
    //console.log(filePath)
    //console.log(Object.keys(initHashDict)[oneHot.findIndex(checkValue)]+" confidence : "+Math.floor(oneHot[oneHot.findIndex(checkValue)]*10000/sum)/100 + "%")
    return {
      path:filePath,
      confidence:Math.floor(oneHot[oneHot.findIndex(checkValue)]*10000/sum)/100 + "%",
      classification:Object.keys(initHashDict)[oneHot.findIndex(checkValue)]
    }
  }

 // sampleDataTrain()

var a =predict('/Users/bernardahn/Splice/sounds/packs/#Twerktrap/PL00401_ACID_WAV_#Twerktrap/Prime_Loops_-_#Twerktrap/Vox_Dry/BallUpTheBass.wav')
console.log(a)