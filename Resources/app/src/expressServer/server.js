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

    let training_data_pre=require('../assets/sampleDataLabels.json')
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
    fs.writeFile('../assets/scratchNN.json', mynn.serialize(), 'utf8', function(){
        console.log('./assets/scratchNN.json written')
        var copyWB=require('../assets/scratchNN.json')
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
    var baseData=require('../assets/sampleDataLabels.json').header
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
    var copyWB=require('../assets/scratchNN.json')
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

var express = require('express');
const cors = require('cors')

require('module-alias/register')
const path = require('path');
var cookieParser = require('cookie-parser')
var flash = require('connect-flash')
var net = require('net')
// var fs=require('fs')
var wav = require('node-wav');
var isWav=require('is-wav')
var child_process=require('child_process')
//=============
const binding = require('../binary_build/spline/build/Release/addon');
const fft = require('../binary_build/fft/build/Release/addon').AcceptArrayBuffer;
const squwbs = require('../binary_build/squwbs/export.js').squwbs;
//=============
// var PNGImage = require('pngjs-image')
var extensions=[    
  'wav',
  'caf',
  'mp3',
  'flac'
]
processingList=[]
doProcess=true
linearProcessingStarted=false
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
app.post('/create-json',cors(),function(req,res){
  //var files=req.param('files')
  // res.header("Access-Control-Allow-Origin", "*");
  
  console.log(req.body)
  //var response=[]

  fs.writeFile(path.join(__dirname,"../assets/sampleDataLabels.json"),JSON.stringify(req.body,null,4),function(){
    console.log('sampleDataLabels.json written at assets/sampleDataLabels.json')
  })
  res.send({message:'sampleDataLabels.json written at assets/sampleDataLabels.json'})

  // var origJson=req.body
  // var newJson={}
  // var ws=[]
  // var xs=[]
  // var ys=[]
  // var zs=[]
  // origJson.data.forEach(function(data){
  //     // var initW=null
  //     var initX={}
  //     var initY={'label':''}
  //     var initZ=''
      
  //     for(var i=0; i<data.hashes.length;i++){
  //         //console.log(data.hashes)
          
  //         initX[origJson.header[i]]=data.hashes[i]
  //         if(i==Number(data.category)){
  //             initY['label']=origJson.header[i]
  //             initZ=origJson.header[i]
  //         }
  //     }
  //     // ws.push(initW)
  //     ws.push(data.hashes)
  //     xs.push(initX)
  //     ys.push(initY)
  //     zs.push(initZ)
  // })
  // newJson.ws=ws
  // newJson.xs=xs
  // newJson.ys=ys
  // newJson.zs=zs
  // fs.writeFile(path.join(__dirname,"../assets/sampleDataLabels.json"),JSON.stringify(newJson,null,4),function(){
  //     console.log('sampleDataLabels.json written at assets/sampleDataLabels.json')
  //   })
    
  // res.send(newJson)
})
// app.post('/all-files',cors(),function(req,res){
//   //var files=req.param('files')
//   var files=req.body.data
//   console.log(files)
//   var response=[]
//   function writePNG(file){
//     //console.log(file)
//     var extIndex=file.split('.').length-1
//     var fileName = path.basename(file)
//     // if(file.split('.')[extIndex]=='wav'){
//     if(extensions.includes(file.split('.')[extIndex])){
//         var buffer = fs.readFileSync(file)
//         var result = wav.decode(buffer);
//         var originalLength=result.channelData[0].length;
//         var sampleRate=result.sampleRate
//         var newArray=[]
//         var frontSilenceTrim=false
//         var endSilenceTrim=false
//         var start=process.hrtime();
//         for (var i=0; i<originalLength; i++){
//             if (Math.abs(result.channelData[0][i])>0.0025){
//                 frontSilenceTrim=true
//             }
//             if(frontSilenceTrim==true){
//                 newArray.push(result.channelData[0][i])
//             }
//         }
//         originalLength=newArray.length
//         for (var i=originalLength-1; i>=0; i-=1){
//             if(endSilenceTrim==false){
//                 if (Math.abs(result.channelData[0][i])<0.0025){
//                     newArray.splice(-1,1)
//                 }
//                 else{
//                     endSilenceTrim=true
//                     originalLength=i+1
//                 }
//             }
//         }
//         var width=2048
//         var bins=2048
//         var height=bins/2
//         var arbitraryLength=width*height
//         var stride = (originalLength-bins)/width
//         var spectrogram=[]
//         for (var i =0; i<width; i++){
//             var tempArray=[]
//             for(var j=0; j<bins; j++){
//                 tempArray[j]=(newArray[Math.floor(i*stride)+j])
//             }
//             const float32arrayLeft = new Float32Array(tempArray);
//             var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
//             spectrogram.push(fft(int32arrayLeft.buffer,sampleRate));
//         }
//         // var end = process.hrtime(start)
//         var image=PNGImage.createImage(width,height);
//         image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:255})
//         for (var j=0; j<height; j++){
//             for(var i=0; i<width; i++){
//                 var gray=Math.floor(255*spectrogram[i][j])
//                 image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:255})
//             }
//         }
//         // var createdImagePath=path.join('../assets',fileName+'.png')
//         var createdImagePath=path.join(__dirname,'../assets/images/'+fileName+'.png')
//         image.writeImage(createdImagePath, function (error) {
//           //console.log('server Image creation : '+error)
//           function check(filePath,i,endIndex,timeout){
//             PNGImage.readImage(filePath, function (err, image) {
//               if(typeof(err)==='undefined'){
//                 // return(true)
//                 var obj={file:filePath,message:'success'}
//                 console.log(obj)
//                 response.push(obj)
//                 //res.send({data:obj})
//               }
//               else{
//                 if(i<endIndex){
//                   setTimeout(function(){check(filePath,i+1,endIndex,timeout)},timeout)
//                 }
//                 else{
//                   //return false;
//                   var obj={file:filePath,message:'questionable'}
//                   console.log(obj)
//                   //res.send({data:obj})
//                   response.push(obj)
//                 }
//               }
//             });
//           }
//           check(createdImagePath,0,10,800)
//         })
//       }
//   }
//   for (var i=0; i<files.length; i++){
//     writePNG(files[i])
//   }
//   res.send({data:response})
// })
app.get('/model-json', (req, res) => {

  // fs.readFile('./data/db.json', (err, json) => {
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname,"../assets/model.json")))
  //let obj = JSON.parse(json);
  res.json(obj);
 

});
app.get('/clean-empty',cors(),function(req,res){
  const isDirectory = filePath => fs.statSync(filePath).isDirectory();
  const getDirectories = filePath =>
      fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDirectory);

  const isFile = filePath => fs.statSync(filePath).isFile();  
  const getFiles = filePath =>
      fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isFile);

  const getFilesRecursively = (filePath) => {
      let dirs = getDirectories(filePath);
      let files = dirs
          .map(dir => getFilesRecursively(dir)) // go through each directory
          .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
      return files.concat(getFiles(filePath));
  };
  const isDir = filePath => fs.statSync(filePath).isDirectory(); 
  const getDirs = filePath =>
      fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDir);

  const getDirsRecursively = (filePath) => {
      let dirs = getDirs(filePath);
      
      let subDirs = dirs
          .map(dir => getDirsRecursively(dir)) // go through each directory
          .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
      return subDirs.concat(getDirs(filePath));
  };
  const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  var fullPathDirectory=path.join(desktopPath,'mastered_files')
  var allSubDirectories=getDirsRecursively(fullPathDirectory)
  function cleanIt(){
    const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
    var fullPathDirectory=path.join(desktopPath,'mastered_files')
    var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
    var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
    var filesToMovefromTemp=fs.readdirSync(tempAudioDir)
    var wavDirectory=path.join(fullPathDirectory,'wav')
    var filesToMovefromWav=fs.readdirSync(wavDirectory)
    
    filesToMovefromTemp.forEach((file,index)=>{ 
      function filemovecb(){
        console.log(file+' moved')
      }
      //move(path.join(tempAudioDir,file),path.join(errorPathDirectory,file),filemovecb)
      //var newFileName=file.split('.').slice()[0]+'.wav'
      var newFileName=file
      var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
      var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
      var filesToMovefromTemp=fs.readdirSync(tempAudioDir)
      var wavDirectory=path.join(fullPathDirectory,'wav')
      function backupWarmWav(wavPath, newFilePath){
        const warmer = require('../binary_build/spline/build/Release/addon');
        try{
          wavtPath=wavPath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
          var buffer = fs.readFileSync(wavPath);
          const wavefile = require('wavefile')
          var wavData = new wavefile.WaveFile(buffer)
          wavData.toSampleRate(44100)
          var samples = wavData.getSamples(false,Int32Array)
          var squwbsResult =squwbs(samples[0],samples[1],44100);
          const float32arrayLeft=new Float32Array(squwbsResult.left);
          const float32arrayRight=new Float32Array(squwbsResult.right);
          var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
          var int32arrayRight = new Int32Array(float32arrayRight.buffer);
          var arrayLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,44100);
          var arrayRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,44100);
          var finalFloat32arrayLeft=new Float32Array(arrayLeft)
          var finalFloat32arrayRight=new Float32Array(arrayRight)
          var combinedChannel=[finalFloat32arrayLeft,finalFloat32arrayRight]
          var newWav=wav.encode(combinedChannel,{sampleRate:44100,float:true,})
          function callbackTwo(){
            try{
              var newFileName=fileName.split('.').slice()[0]+'.wav'
              fs.unlink(path.join(tempAudioDir,newFileName),function(){
                try{
                  fs.unlinkSync(path.join(wavDirectory,newFileName))
                  // linearProcessing()
                }
                catch(err){
                  console.log(err)
                  doProcess=true
                  // linearProcessing()
                }
              })
            }
            catch(err){
              doProcess=true
              console.log(err)
              // linearProcessing()
            }
          }
          fs.writeFile(newFilePath,newWav,function(){
            //changeSoundExt(newFilePath,fullPathDirectory,'mp3',callbackTwo)
            function changeSoundExt(filePath,targetDir,desiredExt,cb){
              var fileName=path.basename(filePath)
              var fileNameOnly=fileName.split('.')[0]
              var newFileName=fileNameOnly+'.'+desiredExt
    
              var newOutputFilePath=path.join(targetDir,newFileName)
              console.log(newOutputFilePath)
              //var baseCommand=path.join(__dirname,'../binary_build/ffmpeg_convert/dist/convert')
              //var command=baseCommand+' inputFilePath="'+filePath+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
              var baseCommand=path.join(__dirname,'../bin/ffmpeg')
              // var command=baseCommand+' -i '+filePath+' -y -hide_banner '+newOutputFilePath
              // var terminalFilePath=filePath.replace(/(\s+)/g, '\\$1');
              // var terminalNewOutputFilePath=newOutputFilePath.replace(/(\s+)/g, '\\$1');
              var terminalFilePath=filePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
              var terminalNewOutputFilePath=newOutputFilePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
              var terminalNewOutputFilePath=terminalNewOutputFilePath.replace(/(&)/g, '\\$1');
              if(desiredExt=='wav'){  
                var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner -ab 16 '+terminalNewOutputFilePath
              }
              else{
                var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner '+terminalNewOutputFilePath
              }
              
              child_process.exec(command,function(err,stdout,stderr){
                console.log(stdout)
                if(err!==null){  
                  function child_process_message(){
                    console.log(err)
                  }
                  move(filePath,path.join(errorPathDirectory,fileName),child_process_message)
                }
                if(typeof(cb)!=='undefined'){
                  try{
                    cb()
                  }
                  catch(err){
                    console.log(err)
                    doProcess=true
                    //linearProcessing()
                  }
                }
              }) 
            }
            const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
            var fullPathDirectory=path.join(desktopPath,'mastered_files')
            var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
            var wavDirectory=path.join(fullPathDirectory,'warmWav')
            var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
            var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
            var miscDirectory=path.join(fullPathDirectory,'Misc')
            var drumsDirectory=path.join(fullPathDirectory,'Drum')
            var loopsDirectory=path.join(fullPathDirectory,'Loops')
            var inDrumsDir=['Clap','Cymbal','Open Hat','Closed Hat','Kick','Percussion','Shaker','Snare','Tom']
            var inOtherDir=['Loops','Chords','One Shots','Vocals']
            var inOtherDirSingular=['Loop','Chord','One Shot','Vocal']
            var oneshotsDirectory=path.join(fullPathDirectory,'One Shots')
            var chordsDirectory=path.join(fullPathDirectory,'Chords')
            var vocalsDirectory=path.join(fullPathDirectory,'Vocals')
            var classification=predict(file).classification
            function getFinalPathDir(classification){
              const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
              var fullPathDirectory=path.join(desktopPath,'mastered_files')
              var finalFullPathDirectory= path.join(fullPathDirectory,'Misc')
              inDrumsDir.forEach((subDirName)=>{
                if(classification==subDirName.toLowerCase()){
                  finalFullPathDirectory=path.join(drumsDirectory,subDirName)
                }
              })
              inOtherDirSingular.forEach((classCheck,index)=>{
                if(classification==classCheck.toLowerCase()){
                  finalFullPathDirectory=path.join(fullPathDirectory,inOtherDir[index])
                }
              })
              

              return finalFullPathDirectory
            }
            var classification=predict(newFilePath).classification
            var finalFullPathDirectory=getFinalPathDir(classification)
            changeSoundExt(newFilePath,finalFullPathDirectory,'mp3',callbackTwo)
          })
        }
        catch(err){
          var originalPath=wavPath
          var erroredFileName=path.basename(wavPath)
          var errorPath=path.join(errorPathDirectory,erroredFileName)
          var errorCallback= function(){
            console.log('file error : moving to '+errorPath)
          }
          move(originalPath, errorPath, errorCallback)
          console.log(err)
          doProcess=true
          // linearProcessing()
        }
        
      }
      backupWarmWav(path.join(tempAudioDir,newFileName),path.join(wavDirectory,newFileName))
    })
    filesToMovefromWav.forEach((file,index)=>{
      function filemovecb(){
        console.log(file+' moved')
      }
      const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
      var fullPathDirectory=path.join(desktopPath,'mastered_files')
      var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
      var wavDirectory=path.join(fullPathDirectory,'warmWav')
      var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
      var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
      var miscDirectory=path.join(fullPathDirectory,'Misc')
      var drumsDirectory=path.join(fullPathDirectory,'Drum')
      var loopsDirectory=path.join(fullPathDirectory,'Loops')
      var inDrumsDir=['Clap','Cymbal','Open Hat','Closed Hat','Kick','Percussion','Shaker','Snare','Tom']
      var inOtherDir=['Loops','Chords','One Shots','Vocals']
      var inOtherDirSingular=['Loop','Chord','One Shot','Vocal']
      var oneshotsDirectory=path.join(fullPathDirectory,'One Shots')
      var chordsDirectory=path.join(fullPathDirectory,'Chords')
      var vocalsDirectory=path.join(fullPathDirectory,'Vocals')
      var classification=predict(file).classification
      function getFinalPathDir(classification){
        const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
        var fullPathDirectory=path.join(desktopPath,'mastered_files')
        var finalFullPathDirectory= path.join(fullPathDirectory,'Misc')
        inDrumsDir.forEach((subDirName)=>{
          if(classification==subDirName.toLowerCase()){
            finalFullPathDirectory=path.join(drumsDirectory,subDirName)
          }
        })
        inOtherDirSingular.forEach((classCheck,index)=>{
          if(classification==classCheck.toLowerCase()){
            finalFullPathDirectory=path.join(fullPathDirectory,inOtherDir[index])
          }
        })
        

        return finalFullPathDirectory
      }
      var classification=predict(file).classification
      var finalFullPathDirectory=getFinalPathDir(classification)
      move(path.join(tempAudioDir,file),path.join(finalFullPathDirectory,file),filemovecb)
      
    })
    //var filesToMovefromError=fs.readdirSync(errorPathDirectory)
    // filesToMovefromError.forEach((file,index)=>{
    //   function filemovecb(){
    //     console.log(file+' moved')
    //   }
    //   move(path.join(tempAudioDir,file),path.join(errorPathDirectory,file),filemovecb)
    // })
    allSubDirectories.forEach((dir,index)=>{
      fs.readdir(dir,(err,files)=>{
        if(files.length==0){
          fs.rmdirSync(dir)
        }
      })
    })
  }
  setTimeout(function(){
    console.log('cleanIt function executed.')
    cleanIt()
  },8000)
  
})
app.get('/clean-slate',cors(),function(req,res){
  processingList=[]
  res.send({data:'cleaned the slate!'})
})
app.get('/one-file',cors(),function(req,res){

  var filePath=req.query.file
  processingList.push(filePath)
  var fraction=req.query.fraction
  var currentGame=req.query.currentGame
  var endGame=req.query.endGame
  var userDetails;
  const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  var fullPathDirectory=path.join(desktopPath,'mastered_files')
  var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  var wavDirectory=path.join(fullPathDirectory,'wav')
  var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
  var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
  var miscDirectory=path.join(fullPathDirectory,'Misc')
  var drumsDirectory=path.join(fullPathDirectory,'Drum')
  var loopsDirectory=path.join(fullPathDirectory,'Loops')
  var inDrumsDir=['Clap','Cymbal','Open Hat','Closed Hat','Kick','Percussion','Shaker','Snare','Tom']
  var inOtherDir=['Loops','Chords','One Shots','Vocals']
  var inOtherDirSingular=['Loop','Chord','One Shot','Vocal']
  var oneshotsDirectory=path.join(fullPathDirectory,'One Shots')
  var chordsDirectory=path.join(fullPathDirectory,'Chords')
  var vocalsDirectory=path.join(fullPathDirectory,'Vocals')
  var classification=predict(filePath).classification
  function getFinalPathDir(classification){
    const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
    var fullPathDirectory=path.join(desktopPath,'mastered_files')
    var finalFullPathDirectory= path.join(fullPathDirectory,'Misc')
    inDrumsDir.forEach((subDirName)=>{
      if(classification==subDirName.toLowerCase()){
        finalFullPathDirectory=path.join(drumsDirectory,subDirName)
      }
    })
    inOtherDirSingular.forEach((classCheck,index)=>{
      if(classification==classCheck.toLowerCase()){
        finalFullPathDirectory=path.join(fullPathDirectory,inOtherDir[index])
      }
    })
    

    return finalFullPathDirectory
  }
  var finalFullPathDirectory=getFinalPathDir(classification)
  //console.log(finalFullPathDirectory)
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
      if(fs.existsSync(drumsDirectory)==false){
        fs.mkdirSync(drumsDirectory)
      }
      inDrumsDir.forEach(function(subDir){
        var subPath=path.join(drumsDirectory,subDir)
        if(fs.existsSync(subPath)==false){
          fs.mkdirSync(subPath)
        }
      })
      if(fs.existsSync(oneshotsDirectory)==false){
        fs.mkdirSync(oneshotsDirectory)
      }
      if(fs.existsSync(loopsDirectory)==false){
        fs.mkdirSync(loopsDirectory)
      }
      if(fs.existsSync(chordsDirectory)==false){
        fs.mkdirSync(chordsDirectory)
      }
      if(fs.existsSync(miscDirectory)==false){
        fs.mkdirSync(miscDirectory)
      }
      if(fs.existsSync(vocalsDirectory)==false){
        fs.mkdirSync(vocalsDirectory)
      }

      // inDrumsDir.forEach(function(subDirName){
      //   if (classification==subDirName.toLowerCase()){
      //     if(fs.existsSync(drumsDirectory)==false){
      //       fs.mkdir(drumsDirectory,function(){
      //         var subPath=path.join(drumsDirectory,subDir)
      //         if(fs.existsSync(subPath)==false){
      //           fs.mkdirSync(subPath)
      //           finalFullPathDirectory=subPath
      //         }
      //       })
      //     }
      //   }
      // })
      // if(classification='one shot'){
      //   if(fs.existsSync(oneshotsDirectory)==false){
      //     fs.mkdirSync(oneshotsDirectory)
      //   }
      //   finalFullPathDirectory=oneshotsDirectory
      // }
      // else if(classification='loop'){
      //   if(fs.existsSync(loopsDirectory)==false){
      //     fs.mkdirSync(loopsDirectory)
      //   }
      //   finalFullPathDirectory=oneshotsDirectory
      // }
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
    if(fs.existsSync(drumsDirectory)==false){
      fs.mkdirSync(drumsDirectory)
    }
    // inDrumsDir.forEach(function(subDirName){
    //   if (classification==subDirName.toLowerCase()){
    //     if(fs.existsSync(drumsDirectory)==false){
    //       fs.mkdir(drumsDirectory,function(){
    //         var subPath=path.join(drumsDirectory,subDir)
    //         if(fs.existsSync(subPath)==false){
    //           fs.mkdirSync(subPath)
    //           finalFullPathDirectory=subPath
    //         }
    //       })
    //     }
    //   }
    // })
    // if(classification='one shot'){
    //   if(fs.existsSync(oneshotsDirectory)==false){
    //     fs.mkdirSync(oneshotsDirectory)
    //   }
    //   finalFullPathDirectory=oneshotsDirectory
    // }
    // else if(classification='loop'){
    //   if(fs.existsSync(loopsDirectory)==false){
    //     fs.mkdirSync(loopsDirectory)
    //   }
    //   finalFullPathDirectory=oneshotsDirectory
    // }
    inDrumsDir.forEach(function(subDir){
      var subPath=path.join(drumsDirectory,subDir)
      if(fs.existsSync(subPath)==false){
        fs.mkdirSync(subPath)
      }
    })
    if(fs.existsSync(oneshotsDirectory)==false){
      fs.mkdirSync(oneshotsDirectory)
    }
    if(fs.existsSync(loopsDirectory)==false){
      fs.mkdirSync(loopsDirectory)
    }
    if(fs.existsSync(chordsDirectory)==false){
      fs.mkdirSync(chordsDirectory)
    }
    if(fs.existsSync(miscDirectory)==false){
      fs.mkdirSync(miscDirectory)
    }
    if(fs.existsSync(vocalsDirectory)==false){
      fs.mkdirSync(vocalsDirectory)
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  // function writePNG(file){
  //   //console.log(file)
  //   var extIndex=file.split('.').length-1
  //   var fileName = path.basename(file)
   
  //   if(file.split('.')[extIndex]=='wav'){
  //       var buffer = fs.readFileSync(file)
  //       var result = wav.decode(buffer);
  //       var originalLength=result.channelData[0].length;
  //       var sampleRate=result.sampleRate
  //       var newArray=[]
  //       var frontSilenceTrim=false
  //       var endSilenceTrim=false
  //       var start=process.hrtime();
  //       function changeSoundExt(filePath,targetDir,desiredExt,cb){
  //         var fileName=path.basename(filePath)
  //         var fileNameOnly=fileName.split('.')[0]
  //         var newFileName=fileNameOnly+'.'+desiredExt
  //         //var newOutputFilePath=path.join(tempAudioDir,newFileName)
  //         var newOutputFilePath=path.join(targetDir,newFileName)
  //         console.log(newOutputFilePath)
  //         var baseCommand=path.join(__dirname,'../binary_build/ffmpeg_convert/dist/convert')
  //         var command=baseCommand+' inputFilePath="'+filePath+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
  //         child_process.exec(command,function(err,stdout,stderr){
  //           console.log(stdout)
  //           if(err!==null){  
  //             console.log(err)
  //           }
  //           if(typeof(cb)!=='undefined'){
  //             cb()
  //           }
  //         }) 
  //       }
  //       function warmWav(wavPath, newFilePath){
  //         const warmer = require('../binary_build/spline/build/Release/addon');
  //         var buffer = fs.readFileSync(wavPath);
  //         var result = wav.decode(buffer);
  //         var arbitraryLength=result.channelData[0].length;
  //         var sampleRate = result.sampleRate;
  //         if(result.channelData[1]==undefined){
  //             const float32arrayLeft = new Float32Array(arbitraryLength);
  //             for (var i =0; i<arbitraryLength; i++){
  //                 float32arrayLeft[i]=result.channelData[0][i];
  //             }
  //             var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
  //             var arrayLeft = binding.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
  //             var arrayRight = arrayLeft.slice();
  //         }
  //         else{
  //             const float32arrayLeft = new Float32Array(arbitraryLength);
  //             const float32arrayRight = new Float32Array(arbitraryLength);
  //             for (var i =0; i<arbitraryLength; i++){
  //                 float32arrayLeft[i]=result.channelData[0][i];
  //                 float32arrayRight[i]=result.channelData[1][i];
  //             }
  //             var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
  //             var int32arrayRight = new Int32Array(float32arrayRight.buffer);
  //             var arrayLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
  //             var arrayRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
  //         }
  //         var float32arrayLeft=new Float32Array(arrayLeft)
  //         var float32arrayRight=new Float32Array(arrayRight)
  //         var combinedChannel=[float32arrayLeft,float32arrayRight]
  //         var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})
  //         function callbackTwo(){
  //           fs.unlink(path.join(tempAudioDir,fileName),function(){
  //             fs.unlinkSync(path.join(wavDirectory,fileName))
  //           })
  //         }
  //         fs.writeFile(newFilePath,newWav,function(){
  //           //changeSoundExt(newFilePath,fullPathDirectory,'mp3',callbackTwo)
  //           changeSoundExt(newFilePath,finalFullPathDirectory,'mp3',callbackTwo)
  //         })
  //       }

  //       for (var i=0; i<originalLength; i++){
  //           if (Math.abs(result.channelData[0][i])>0.0025){
  //               frontSilenceTrim=true
  //           }
  //           if(frontSilenceTrim==true){
  //               newArray.push(result.channelData[0][i])
  //           }
  //       }
  //       originalLength=newArray.length
  //       for (var i=originalLength-1; i>=0; i-=1){
  //           if(endSilenceTrim==false){
  //               if (Math.abs(result.channelData[0][i])<0.0025){
  //                   newArray.splice(-1,1)
  //               }
  //               else{
  //                   endSilenceTrim=true
  //                   originalLength=i+1
  //               }
  //           }
  //       }
  //       var bins=2<<7
  //       var width=bins/2
  //       var height=bins/8
  //       var arbitraryLength=width*height
  //       var stride = (originalLength-bins)/width
  //       var spectrogram=[]
  //       for (var i =0; i<width; i++){
  //           var tempArray=[]
  //           for(var j=0; j<bins; j++){
  //               tempArray[j]=(newArray[Math.floor(i*stride)+j])
  //           }
  //           const float32arrayLeft = new Float32Array(tempArray);
  //           var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
  //           spectrogram.push(fft(int32arrayLeft.buffer,sampleRate));
  //       }
  //       // var end = process.hrtime(start)
  //       var image=PNGImage.createImage(width,height);
  //       image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:255})
  //       for (var j=0; j<height; j++){
  //           for(var i=0; i<width; i++){
  //               var gray=Math.floor(255*spectrogram[i][j])
  //               image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:255})
  //           }
  //       }

  //       // var createdImagePath=path.join('../assets',fileName+'.png')
  //       var createdImagePath=path.join(__dirname,'../assets/images/'+fileName+'.png')
  //       image.writeImage(createdImagePath, function (error) {
  //         //console.log('server Image creation : '+error)
  //         function callbackOne(){
  //           warmWav(path.join(tempAudioDir,fileName),path.join(wavDirectory,fileName))
  //         }
  //         changeSoundExt(filePath,tempAudioDir,'wav',function(){
  //           console.log(fileName)
  //           callbackOne()
  //         })
  //         function check(filePath,i,endIndex,timeout){
  //           PNGImage.readImage(filePath, function (err, image) {
  //             // changeSoundExt(filePath,tempAudioDir,'wav',function(){
  //             //   console.log(fileName)
  //             // })
  //             if(typeof(err)==='undefined'){
  //               // return(true)
  //               var obj={file:filePath,message:'success',fraction:fraction,currentGame:currentGame,endGame:endGame}
  //               // console.log(obj)
                
  //               console.log(currentGame + ' / '+endGame )
  //               res.send({data:obj})
  //             }
  //             else{
  //               // if(i<endIndex){
  //               //   setTimeout(function(){check(filePath,i+1,endIndex,timeout)},timeout)
  //               // }
  //               // else{
  //               //   //return false;
  //                 var obj={file:filePath,message:'questionable',fraction:fraction,currentGame:currentGame,endGame:endGame}
  //                 // console.log(obj)
  //                 console.log(currentGame + ' / '+endGame )
  //                 res.send({data:obj})
  //               // }
  //             }
              
              
  //           });
  //         }
  //         check(createdImagePath,0,10,800)
  //       })

  //     }
  //   else{
  //     var obj={file:filePath,message:'not wav',fraction:fraction,currentGame:currentGame,endGame:endGame}
  //       console.log(obj)
  //       res.send({data:obj})
  //     }
  //   }
  
  // writePNG(filePath)
  function soundBetter(file){
    doProcess=false
    var extensions = ['wav','caf','mp3','flac']
    var extIndex=file.split('.').length-1
    var fileName = path.basename(file)
   
    //if(file.split('.')[extIndex]=='wav'){
    if(extensions.indexOf(file.split('.')[extIndex])!=-1){
          function create_spectrogram(file){
            var buffer = fs.readFileSync(file)
            // todo: the following needs to be updated to accept wav file type fffe.
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
              return spectrogram
            }
          function changeSoundExt(filePath,targetDir,desiredExt,cb){
            var fileName=path.basename(filePath)
            var fileNameOnly=fileName.split('.')[0]
            var newFileName=fileNameOnly+'.'+desiredExt
  
            var newOutputFilePath=path.join(targetDir,newFileName)
            console.log(newOutputFilePath)
            //var baseCommand=path.join(__dirname,'../binary_build/ffmpeg_convert/dist/convert')
            //var command=baseCommand+' inputFilePath="'+filePath+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
            var baseCommand=path.join(__dirname,'../bin/ffmpeg')
            // var command=baseCommand+' -i '+filePath+' -y -hide_banner '+newOutputFilePath
            // var terminalFilePath=filePath.replace(/(\s+)/g, '\\$1');
            // var terminalNewOutputFilePath=newOutputFilePath.replace(/(\s+)/g, '\\$1');
            var terminalFilePath=filePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
            var terminalNewOutputFilePath=newOutputFilePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
            var terminalNewOutputFilePath=terminalNewOutputFilePath.replace(/(&)/g, '\\$1');
            if(desiredExt=='wav'){  
              var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner -ab 16 '+terminalNewOutputFilePath
            }
            else{
              var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner '+terminalNewOutputFilePath
            }
            
            child_process.exec(command,function(err,stdout,stderr){
              console.log(stdout)
              if(err!==null){  
                function child_process_message(){
                  console.log(err)
                }
                move(filePath,path.join(errorPathDirectory,fileName),child_process_message)
              }
              if(typeof(cb)!=='undefined'){
                try{
                  cb()
                }
                catch(err){
                  console.log(err)
                  doProcess=true
                  linearProcessing()
                }
              }
            }) 
          }
          function warmWav(wavPath, newFilePath){
            const warmer = require('../binary_build/spline/build/Release/addon');
            try{
              //wavtPath=wavPath.replace(/(\s+)/g, '\\$1');
              wavtPath=wavPath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
              var buffer = fs.readFileSync(wavPath);
              var result = wav.decode(buffer);
              var arbitraryLength=result.channelData[0].length;
              var sampleRate = result.sampleRate;
              if(result.channelData[1]==undefined){
                // const float32arrayLeft = new Float32Array(arbitraryLength);
                // for (var i =0; i<arbitraryLength; i++){
                //     float32arrayLeft[i]=result.channelData[0][i];
                // }
                var tempLeft= Array(arbitraryLength);

                for (var i =0; i<arbitraryLength; i++){
                  tempLeft[i]=result.channelData[0][i];
                }
                tempRight = arrayLeft.slice();
                var squwbsResult = squwbs(tempLeft,tempRight,sampleRate);
                const float32arrayLeft= new Float32Array(squwbsResult.left);
                var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
                var arrayLeft = binding.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
                var arrayRight = arrayLeft.slice();
                //var tempLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
                //var tempRight = arrayLeft.slice();
                // var squwbsResult = squwbs(tempLeft,tempRight,sampleRate);
                // var arrayLeft=squwbsResult.left;
                // var arrayRight=squwbsResult.right;
              }
              else{
                var tempLeft= Array(arbitraryLength);
                var tempRight=Array(arbitraryLength);
                for (var i =0; i<arbitraryLength; i++){
                  tempLeft[i]=result.channelData[0][i];
                  tempRight[i]=result.channelData[1][i];
                }
                var squwbsResult =squwbs(tempLeft,tempRight,sampleRate);
                //const float32arrayLeft = new Float32Array(arbitraryLength);
                //const float32arrayRight = new Float32Array(arbitraryLength);
                const float32arrayLeft=new Float32Array(squwbsResult.left);
                const float32arrayRight=new Float32Array(squwbsResult.right);
                // for (var i =0; i<arbitraryLength; i++){
                //     float32arrayLeft[i]=result.channelData[0][i];
                //     float32arrayRight[i]=result.channelData[1][i];
                // }
                var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
                var int32arrayRight = new Int32Array(float32arrayRight.buffer);
                var arrayLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
                var arrayRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
                // var tempLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,sampleRate);
                // var tempRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,sampleRate);
                // var squwbsResult = squwbs(tempLeft,tempRight,sampleRate);
                // var arrayLeft=squwbsResult.left;
                // var arrayRight=squwbsResult.right;
              }
              var finalFloat32arrayLeft=new Float32Array(arrayLeft)
              var finalFloat32arrayRight=new Float32Array(arrayRight)
              var combinedChannel=[finalFloat32arrayLeft,finalFloat32arrayRight]
              var newWav=wav.encode(combinedChannel,{sampleRate:sampleRate,float:true,})
              function callbackTwo(){
                try{
                  var newFileName=fileName.split('.').slice()[0]+'.wav'
                  //fs.unlink(path.join(tempAudioDir,fileName),function(){
                  fs.unlink(path.join(tempAudioDir,newFileName),function(){
                    try{
                      //fs.unlinkSync(path.join(wavDirectory,fileName))
                      fs.unlinkSync(path.join(wavDirectory,newFileName))
                      linearProcessing()
                    }
                    catch(err){
                      console.log(err)
                      doProcess=true
                      linearProcessing()
                    }
                  })
                }
                catch(err){
                  doProcess=true
                  console.log(err)
                  linearProcessing()
                }
              }
              fs.writeFile(newFilePath,newWav,function(){
                //changeSoundExt(newFilePath,fullPathDirectory,'mp3',callbackTwo)
                changeSoundExt(newFilePath,finalFullPathDirectory,'mp3',callbackTwo)
              })
            }
            catch(err){
              var originalPath=wavPath
              var erroredFileName=path.basename(wavPath)
              var errorPath=path.join(errorPathDirectory,erroredFileName)
              var errorCallback= function(){
                console.log('file error : moving to '+errorPath)
              }
              
              move(originalPath, errorPath, errorCallback)
              // try{
              //   fs.unlinkSync(path.join(wavDirectory,erroredFileName))
              //   fs.unlinkSync(path.join(tempAudioDir,erroredFileName))
              // }
              // catch(err){
                
              // }
              console.log(err)
              doProcess=true
              linearProcessing()
            }
            
          }
          function callbackOne(){
            //warmWav(path.join(tempAudioDir,fileName),path.join(wavDirectory,fileName))
            var newFileName=fileName.split('.').slice()[0]+'.wav'
            warmWav(path.join(tempAudioDir,newFileName),path.join(wavDirectory,newFileName))
          }
          changeSoundExt(filePath,tempAudioDir,'wav',function(){
            console.log(fileName)
            callbackOne()
          })
          function check(filePath,i,endIndex,timeout){
            var obj={file:filePath,message:'success',fraction:fraction,currentGame:currentGame,endGame:endGame}
            console.log(currentGame + ' / '+endGame )
            doProcess=true
            res.send({data:obj})
            
          }
          //check(finalFullPathDirectory,0,10,800)
          check(finalFullPathDirectory,0,endGame,800)
      }
    else{
      var obj={file:filePath,message:'not wav',fraction:fraction,currentGame:currentGame,endGame:endGame}
        console.log(obj)
        doProcess=true
        res.send({data:obj})
      }
    }
  //soundBetter(filePath)
  function linearProcessing(){
    if(processingList.length!=0){
      //if(doProcess==true){
        console.log(processingList.length)
        console.log(processingList[0])
        processingList.forEach(function(individualPath){
          soundBetter(processingList[0])
        })
        processingList=[]
      //}
    }
    
    
    
    
  }
  // if(linearProcessingStarted==false){
  //   linearProcessing()
  //   linearProcessingStarted=true
  // }
  linearProcessing()
})
//console.log(path.join(__dirname,'../../build'))
console.log('server started in port number : '+String(portnumber))
app.listen(process.env['PORT'] || portnumber);
}