

function setup() {
  // put setup code here
  console.log('hello world')
  console.log('ml5 version:', ml5.version);
 // const classifier = ml5.featureExtractor('MobileNet',modelLoaded)
 // classifier.classification()
  const knnClassifier = ml5.KNNClassifier();
  const featureExtractor=ml5.featureExtractor('MobileNet',modelReady)
  createCanvas(150, 150);
  background(200);
  var mainImage
  var iteration=0;
  var indexMax=0;
  //var mainFileName
  function iterate(iteration){
    // try{
      mainImage=createImg(jsonData.data[iteration].path,imageReady)
      mainImage.hide()
    // }
    // catch{
    //   iteration+=1
    //   indexMax+=1
    //   iterate(iteration)
    // }
    
  }
  
  function imageReady(err){
    // console.log('imageReady')
    image(mainImage,0,0,150,150)
    //mainFileName='red'
    
    //classifier.addImage(mainImage,mainFileName)
    // console.log('added Image to Classifier')
    // classifier.train(function(){
    //   console.log('training')
    // })
    // if(err){
      // console.log('error!!!!!!!!', err)
      iteration+=1
      indexMax++;
      //console.log(indexMax);
      if(indexMax==50){
        // function whileTraining(loss)
        // {
            // console.log('training loss : '+loss)
            // if(loss==null){
            //     console.log('training done')
            //     classifier.save()
            // }
        // }
        // classifier.train(whileTraining)
        knnClassifier.save('classifier.json')
      }
      else{
        iterate(iteration)
      }
    // }
    // else{
    //   var mainClassName=jsonData.data[iteration].class
    //   classifier.addImage(mainImage,mainClassName)
    //   iteration+=1
    //   indexMax++;
    //   //console.log(indexMax);
    //   if(indexMax==50){
    //     function whileTraining(loss)
    //     {
    //         console.log('training loss : '+loss)
    //         if(loss==null){
    //             console.log('training done')
    //             classifier.save()
    //         }
    //     }
    //     classifier.train(whileTraining)
    //   }
    //   else{
    //     iterate(iteration)
    //   }
      
      
    // }
    
    
  }
  function loadImage(imagePath){
    //console.log(jsonData)
    //console.log(Object.keys(jsonData.data))
    // for (var i =0; i<Object.keys(jsonData.data).length; i++){
      
    //   mainImage=createImg(jsonData.data[i].path,imageReady)
    //   mainFileName=jsonData.data[i].class
    //   classifier.addImage(mainImage,mainFileName)
    //   mainImage.hide()
    // }
    
    iterate(0)
    // mainImage=createImg('/Users/bernardahn/Documents/GitHub/squwbs_pro/Resources/app/tests/eo0.png',imageReady)
   // mainImage.hide()
   
  }
  
  function modelReady(){
    console.log('model ready')
    loadImage()
  }
  
  
}

function draw() {
  // put drawing code here
}