import React, {Component,useCallback,useState,useEffect} from 'react'
import {Text,View,Dimensions,TouchableOpacity} from 'react-native'
import Dropzone, {useDropzone} from 'react-dropzone'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'
const isWav = require('is-wav')
const clearModule = require('clear-module');
const AcceptArrayBuffer= require ('../binary_build/spline/build/Release/addon.node').AcceptArrayBuffer
const path = require('path')
const withQuery = require('with-query').default;
var ml5 = require('ml5')
var json = require('../assets/sampleDataLabels.json')
//const knnClassifier = ml5.knnClassifier()
//const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);


function MLFiveKNN(props){
    console.log(json)
    var newJson={}
    var ws=[]
    var xs=[]
    var ys=[]
    var zs=[]
    json.data.forEach(function(data){
        // var initW=null
        var initX={}
        var initY={'label':''}
        var initZ=''
        
        for(var i=0; i<data.hashes.length;i++){
            //console.log(data.hashes)
            
            initX[json.header[i]]=data.hashes[i]
            if(i==Number(data.category)){
                initY['label']=json.header[i]
                initZ=json.header[i]
            }
        }
        // ws.push(initW)
        ws.push(data.hashes)
        xs.push(initX)
        ys.push(initY)
        zs.push(initZ)
    })
    newJson.ws=ws
    newJson.xs=xs
    newJson.ys=ys
    newJson.zs=zs
    console.log(newJson)
    
    

    useEffect(function(){

    },[])
    return (
        <div></div>
    )
}
export default MLFiveKNN
