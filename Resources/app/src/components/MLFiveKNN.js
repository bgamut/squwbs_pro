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
const knnClassifier = ml5.knnClassifier()
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);


function MLFiveKNN(props){
    console.log(json)
    useEffect(function(){

    },[])
    return (
        <div></div>
    )
}
export default MLFiveKNN
