import React, {Component,useCallback,useState,useEffect} from 'react'
import {Text,View,Dimensions,TouchableOpacity} from 'react-native'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'
var fs = require('fs');
var path = require('path')
var wav = require('node-wav');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
var p5 =require('p5')
//var tf = require('@tensorflow/tfjs')
var ml5 = require('ml5')
var P5Wrapper = require('react-p5-wrapper');
const fft = require('../binary_build/fft/build/Release/addon.node').AcceptArrayBuffer;
// var fullPathDirectory=path.join(desktopPath,'mastered_files')
var inputDir='/Users/bernardahn/Desktop/tf_data_prep'
console.log('ml5 version:', ml5.version);
var rootDir='/Users/bernardahn/Desktop/tf_data_prep'
        console.log('ml5 version:', ml5.version);
        var knnClassifier = ml5.knnClassifier();
        var featureExtractor = ml5.featureExtractor('MobileNet',modelLoaded)
        
        function loadImage(){
            var todo=[]
            var classNames=[]
            var className=""
            fs.readdir(rootDir,function(err,directories){
                for (var index =0; index<directories.length; index++){
                    var currentDir=path.join(rootDir,directories[index])
                        imageReady()
                        mainImage.hide()
                        function imageReady(){
                            var className=path.basename(currentDir)
                            classifier.addImage(mainImage,className)
                        }
                            
                        classifier.train(whileTraining)
                        function whileTraining(loss)
                        {
                            console.log('training loss : '+loss)
                            if(loss==null){
                                console.log('training done')
                                classifier.save()
                            }
                        }
                    
                }  
            })
        }
        function modelLoaded(){
            console.log('model ready')
            loadImage()
        }  
//mp3towav(inputDir)
function sketch(p){
    function setup(){
        p.createCanvas(150, 150);
        p.background(200);
        
    }
    function draw() {
        // put drawing code here
    }
}
export default function prepData(props){
    return (
        <div>
            <P5Wrapper sketch={sketch}/>
        </div>
    )
}