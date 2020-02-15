/**
 * Matrix library based on - https://github.com/CodingTrain/Toy-Neural-Network-JS/blob/master/lib/matrix.js
 */
class Matrix {
    /**
     * Values are initialized to 0
     * @param {number} Rows
     * @param {number} Columns
     */
    constructor(rows,cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = [];
  
      for(let i = 0 ; i < this.rows ; i++) {
        this.data[i] = [];
        for (let j=0; j < this.cols ; j++) {
          this.data[i][j] = 0;
        }
      }
    }
  
    multiply(n) {
      if(n instanceof Matrix) { //hadamard multiplication (corresponding element multiplies to this matrix)
        if(n.rows == this.rows && n.cols == this.cols) {
          for(let i=0; i < this.rows ; i++) {
            for(let j=0; j < this.cols ; j++) {
              this.data[i][j] *= n.data[i][j];
            }
          }
        }
        else {
          console.error("element wise multiplication failed because of size mismatch!");
          return -1; //failed bcoz of size mismatch
        }
      }
      else { //scalar multiply
        for (let i = 0; i < this.rows; i++) {
          for(let j=0; j <this.cols; j++) {
            this.data[i][j] *= n;
          }
        }
      }
    }
  
    static multiply(matx1, matx2) { //returns new matrix ARGS (matrix,matrix) or (matrix,scalar)
  
      if(matx1.cols == matx2.rows && matx1 instanceof Matrix && matx2 instanceof Matrix) { //actual matrix multiplication
        let nrows = matx1.rows; //new rows
        let ncols = matx2.cols; //new cols
        // let newmat = [];
        let newmat = new Matrix(matx1.rows,matx2.cols);
        for(let i = 0 ; i < nrows ; i++) {
          for (let j=0; j < ncols ; j++) {
            newmat.data[i][j] = 0;
            for(let k=0; k < matx1.cols ; k++) {
              newmat.data[i][j] += matx1.data[i][k]*matx2.data[k][j];
            }
          }
        }
        return newmat;
      }
      else {
        if(matx1 instanceof Matrix && !(matx2 instanceof Matrix)) { //scalar multiply
          let n = matx2; //scalar value
  
          //copying matx1 w/o reference
          let imat = new Matrix(matx1.rows,matx1.cols);
          for(let i=0;i<matx1.rows;i++)
            for(let j=0;j<matx1.cols;j++)
              imat.data[i][j] = matx1.data[i][j];
          //copying - END
  
          for (let i = 0; i < matx1.rows; i++) {
            for(let j=0; j <matx1.cols; j++) {
              imat.data[i][j] *= n;
            }
          }
          return imat;
        }
        else {
          if(!(matx1.cols == matx2.rows))
            console.error('size mismatch!');
          if(!(matx1 instanceof Matrix && matx2 instanceof Matrix))
            console.error('argument to matrix multiplication func should be only Matrix objects');
          console.error("Matrix multiplication failed!");
          return -1; //product not possible
        }
      }
    }
  
    copy() {
      let newmat = new Matrix(this.rows,this.cols);
      for(let i=0;i<this.rows;i++)
        for(let j=0;j<this.cols;j++)
          newmat.data[i][j] = this.data[i][j];
  
      return newmat;
    }
  
    print() {
      console.table(this.data);
    }
  
    static transpose(imat) { //returns transposed matrix
      let transposed = new Matrix(imat.cols,imat.rows);
  
      for(let i=0;i<imat.cols;i++) {
        for(let j=0;j<imat.rows;j++) {
          transposed.data[i][j] = imat.data[j][i];
        }
      }
  
      return transposed;
    }
  
    add(newdata) {
      if(newdata instanceof Matrix) { //add element wise
        for(let i=0;i<this.rows;i++)
          for(let j=0;j<this.cols;j++)
            this.data[i][j] += newdata.data[i][j];
      }
      else { //add newdata to each element
        for(let i=0;i<this.rows;i++)
          for(let j=0;j<this.cols;j++)
            this.data[i][j] += newdata;
      }
    }
  
    static add(m1,m2) { //adds n to each element of this matrix or adds 2 matrix (of same dimension) element wise
      if(m1 instanceof Matrix && m2 instanceof Matrix && m1.rows == m2.rows && m1.cols == m2.cols) {
        let newmat = new Matrix(m1.rows,m1.cols);
  
        for (let i = 0; i < m1.rows; i++) {
          for(let j=0; j <m1.cols; j++) {
            newmat.data[i][j] = m1.data[i][j] + m2.data[i][j];
          }
        }
  
        return newmat;
      }
      else {
        if(!(m1.rows == m2.rows && m1.cols == m2.cols)) {
          console.log('tried to add..')
          m1.print();
          console.log('this one ...')
          m2.print();
          console.error('invaild addition : size mismatch');
          return -1;
        }
        console.error('invaild addition');
        return -1;
      }
    }
  
    map(func) { //maps this matrix obj
      for(let i=0;i<this.rows;i++) {
        for(let j=0;j<this.cols;j++) {
          let val = this.data[i][j];
          this.data[i][j] = func(val);
        }
      }
    }
  
    //returns mapped matrix obj
    static map(matrix, func) {
      let newmat = new Matrix(matrix.rows,matrix.cols);
  
      for(let i=0;i<matrix.rows;i++) {
        for(let j=0;j<matrix.cols;j++) {
          newmat.data[i][j] = func(matrix.data[i][j]);
        }
      }
  
      return newmat;
    }
  
    //randomizes this matrix
    randomize() {
      for (let i = 0; i < this.rows; i++) {
        for(let j=0; j <this.cols; j++) {
          this.data[i][j] = (Math.random()*2) - 1 ; //random number between -1 and 1
        }
      }
    }
  
    /**
     * takes array of numbers and returns a 1d Matrix object
     * @param {array} arr - array of numbers
     */
    static fromArray(arr) {
      let rows = arr.length;
      let cols = 1;
  
      let matrix = new Matrix(rows,cols);
      for(let i=0; i<rows ;i++)
        matrix.data[i][0] = arr[i];
  
      return matrix;
    }
  
    //gives 1d array (need to update for any dimension of matrix)
    toArray() {
      let arr = [];
      for(let i=0;i<this.rows;i++)
        for(let j=0;j<this.cols;j++)
          arr.push(this.data[i][j]);
      return arr;
    }
  }
  class NeuralNetwork {
    /**
     * @param  {Array} arg_array - array of counts of neurons in each layer
     * Eg : new NeuralNetwork([3,4,2]); will instantiate ANN with 3 neurons as input layer, 4 as hidden and 2 as output layer
     */
    constructor(arg_array) {
  
      this.layer_nodes_counts = arg_array; // no of neurons per layer
      this.layers_count = arg_array.length; //total number of layers
  
      this.weights = []; //array of weights matrices in order
  
      const {layer_nodes_counts} = this;
  
      for(let i = 0 ; i < layer_nodes_counts.length - 1 ; i++) {
        let weights_mat = new Matrix(layer_nodes_counts[i+1],layer_nodes_counts[i]);
        weights_mat.randomize()
        this.weights.push(weights_mat);
      }
  
      this.biases = []; //array of bias matrices in order
  
      for(let i = 1 ; i < layer_nodes_counts.length ; i++) {
        let bias_mat = new Matrix(layer_nodes_counts[i],1);
        bias_mat.randomize()
        this.biases.push(bias_mat);
      }
  
      NeuralNetwork.SIGMOID = 1;
      NeuralNetwork.ReLU = 2;
  
      this.activation = null;
      this.activation_derivative = null;
      this.setActivation(NeuralNetwork.SIGMOID);
      this.learningRate = 0.2;
    }
  
    /**
     *
     * @param {Array} input_array - Array of input values
     * @param {Boolean} GET_ALL_LAYERS - if we need all layers after feed forward instead of just output layer
     */
    feedforward(input_array, GET_ALL_LAYERS) {
      const {layers_count} = this;
  
      if(!this._feedforward_args_validator(input_array)) {
        return -1;
      }
  
      let layers = []; //This will be array of layer arrays
  
      //input layer
      layers[0] = Matrix.fromArray(input_array);
  
      for(let i = 1 ; i < layers_count ; i++) {
        layers[i] = Matrix.multiply(this.weights[i-1],layers[i-1]);
        layers[i].add(this.biases[i-1]);
        layers[i].map(this.activation); //activation
      }
      if (GET_ALL_LAYERS == true) {
        return layers; //all layers (array of layer matrices)
      } else {
        return layers[layers.length-1].toArray(); //output layer array
      }
    }
  
    // Mutates weights and biases of ANN based on rate given
    mutate(rate) { //rate 0 to 1
      function mutator(val) {
        if(Math.random() < rate) {
          return val + Math.random() * 2 - 1;
        }
        else {
          return val;
        }
      }
  
      for(let i=0 ; i < this.weights.length ; i++) {
        this.weights[i].map(mutator);
        this.biases[i].map(mutator);
      }
    }
  
    // Returns a copy of ANN (instead of reference to original one)
    copy() {
      let new_ann = new NeuralNetwork(this.layer_nodes_counts);
      for(let i=0 ; i< new_ann.weights.length ; i++) {
        new_ann.weights[i] = this.weights[i].copy();
      }
      for(let i=0 ; i< new_ann.biases.length ; i++) {
        new_ann.biases[i] = this.biases[i].copy();
      }
      return new_ann;
    }
  
    // Trains with backpropogation
    train(input_array, target_array) {
      if(!this._train_args_validator(input_array, target_array)) {
        return -1;
      }
  
      let layers = this.feedforward(input_array, true); //layer matrices
      let target_matrix = Matrix.fromArray(target_array);
  
      let prev_error;
  
      for(let layer_index = layers.length-1; layer_index >= 1; layer_index--) {
        /* right and left are in respect to the current layer */
        let layer_matrix = layers[layer_index];
  
        let layer_error;
        //Error calculation
        if(layer_index == layers.length-1) { // Output layer
          layer_error = Matrix.add(target_matrix, Matrix.multiply(layer_matrix, -1));
        } else { //Hidden layer
          const right_weights = this.weights[layer_index];
          const right_weigths_t = Matrix.transpose(right_weights);
          layer_error = Matrix.multiply(right_weigths_t, prev_error);
        }

        prev_error = layer_error.copy(); //will be used for error calculation in hidden layers
  
        //Calculating layer gradient
        const layer_gradient = Matrix.map(layer_matrix, this.activation_derivative);
        layer_gradient.multiply(layer_error);
        layer_gradient.multiply(this.learningRate);
  
        //Calculating delta weights
        const left_layer_t = Matrix.transpose(layers[layer_index-1]);
        const left_weights_delta = Matrix.multiply(layer_gradient, left_layer_t);
  
        //Updating weights and biases
        this.weights[layer_index-1].add(left_weights_delta);
        this.biases[layer_index-1].add(layer_gradient);
      }
    }
    getLayers(){
        return([this.weights,this.biases])
    }
    activation(x) {
      return this.activation(x);
    }
  
    setActivation(TYPE) {
      switch (TYPE) {
        case NeuralNetwork.SIGMOID:
          this.activation = NeuralNetwork.sigmoid;
          this.activation_derivative = NeuralNetwork.sigmoid_derivative;
          break;
        case NeuralNetwork.ReLU:
          this.activation = NeuralNetwork.relu;
          this.activation_derivative = NeuralNetwork.relu_derivative;
          break;
        default:
          console.error('Activation type invalid, setting sigmoid by default');
          this.activation = NeuralNetwork.sigmoid;
          this.activation_derivative = NeuralNetwork.sigmoid_derivative;
      }
    }
  
    /**
     * @param {NeuralNetwork} ann - crossover partner
     */
    crossover(ann) {
      if(!this._crossover_validator(ann)) {
        return -1;
      }
      const offspring = new NeuralNetwork(this.layer_nodes_counts);
      for(let i = 0; i < this.weights.length; i++) {
        if(Math.random() < 0.5)  {
          offspring.weights[i] = this.weights[i];
        } else {
          offspring.weights[i] = ann.weights[i];
        }
  
        if(Math.random() < 0.5)  {
          offspring.biases[i] = this.biases[i];
        } else {
          offspring.biases[i] = ann.biases[i];
        }
      }
      return offspring;
    }
  
    // Activation functions
    static sigmoid(x) {
      return 1 / ( 1 + Math.exp(-1 * x));
    }
  
    static sigmoid_derivative(y) {
      return y*(1-y);
    }
  
    static relu(x) {
      if(x >= 0) {
        return x;
      } else {
        return 0;
      }
    }
  
    static relu_derivative(y) {
      if(y > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  
    // Argument validator functions
    _feedforward_args_validator(input_array) {
      let invalid = false;
      if(input_array.length != this.layer_nodes_counts[0]) {
        invalid = true;
        console.error("Feedforward failed : Input array and input layer size doesn't match.");
      }
      return invalid ? false : true;
    }
  
    _train_args_validator(input_array, target_array) {
      let invalid = false;
      if(input_array.length != this.layer_nodes_counts[0]) {
        console.error("Training failed : Input array and input layer size doesn't match.");
        invalid=true;
      }
      if(target_array.length != this.layer_nodes_counts[this.layers_count - 1]) {
        invalid=true;
        console.error("Training failed : Target array and output layer size doesn't match.");
      }
      return invalid ? false : true;
    }
  
    _crossover_validator(ann) {
      let invalid = false;
      if(ann instanceof NeuralNetwork) {
        if(this.layers_count == ann.layers_count) {
          for(let i = 0; i < this.layers_count; i++) {
            if(this.layer_nodes_counts[i] != ann.layer_nodes_counts[i]) {
              console.error("Crossover failed : Architecture mismatch (Different number of neurons in one or more layers).");
              invalid = true;
              break;
            }
          }
        } else {
          invalid=true;
          console.error("Crossover failed : Architecture mismatch (Different number of layers).");
        }
      } else {
        invalid=true;
        console.error("Crossover failed : NeuralNetwork object expected.");
      }
      return invalid ? false : true;
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
    let mynn = new NeuralNetwork([training_data[0][0].length,training_data[0][0].length,training_data[0][1].length]);
    mynn.setActivation(NeuralNetwork.ReLU)
    
  
    console.log("Before training...");
    console.log(mynn.feedforward(training_data[0][0]));
    var epoch=2000000
    // several training epochs
    for(let i=0; i<epoch; i++) {
    var percent=String(Math.floor(i*1000000/epoch)/10000)+' %'
      //console.clear()
      console.log(percent)
     
      let tdata = training_data[Math.floor(Math.random() * training_data.length)];
      mynn.train(tdata[0], tdata[1]);
    }
  
    console.log("After training...");
    console.log(mynn.feedforward(training_data[0][0]));
    fs.writeFile('../src/assets/scratchNN.json', JSON.stringify({weights:mynn.weights,biases:mynn.biases},null,4), 'utf8', function(){
        console.log('./src/assets/scratchNN.json written')
        // console.log(mynn.weights)
        // console.log(mynn.biases)
        var newMyAnn=new NeuralNetwork([training_data[0][0].length,training_data[0][0].length,training_data[0][1].length]);
        newMyAnn.setActivation(NeuralNetwork.ReLU)
        
        //newMyAnn.weights=Object.assign(Object.create(Object.getPrototypeOf(mynn.weights)), mynn.weights)
        //newMyAnn.biases=Object.assign(Object.create(Object.getPrototypeOf(mynn.biases)), mynn.biases)
        // newMyAnn.weights=mynn.weights
        // newMyAnn.biases=mynn.biases
        
        var copyWB=require('../src/assets/scratchNN.json')
        console.log(copyWB)
        newMyAnn.weights=copyWB.weights
        newMyAnn.biases=copyWB.biases
        
        console.log("cloned train data...");
        console.log(mynn.feedforward(training_data[0][0]));
    })
    

  }
  sampleDataTrain()
