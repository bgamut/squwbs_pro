import React, {Component,useCallback,useState,useEffect,useRef} from 'react'
import {Text,View,Dimensions,TouchableOpacity,Picker} from 'react-native'
import Dropzone, {useDropzone} from 'react-dropzone'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'

// const fs =require('fs')
const isWav = require('is-wav')
const clearModule = require('clear-module');
const AcceptArrayBuffer= require ('../binary_build/spline/build/Release/addon.node').AcceptArrayBuffer
var jsonData = require('../assets/soundFilePath.json')
var jsonDataCopy = jsonData.data
console.log(jsonDataCopy)
var jsonCopy = {}
const path = require('path')
const withQuery = require('with-query').default;


// const DirectoryOpen = (props)=> {


export default function Trainer(props){
    const pathTextRef= useRef(null)
    const pickerRef= useRef(null)
    //const [currentIndex,setCurrentIndex]=useState(0)
    //var jsonData 
    var currentIndex=0
    //const [currentPick,setCurrentPick]=useState('none')
    var currentPick=''
    const [currentPickView,setCurrentPickView]=useState('')
    //const [blocker, setBlocker]=useState(true)
    var blocker = true
    //console.log(jsonData)

    var pickList = [<Picker.Item label='' value={100} />]
    var selectList=[]
    jsonData.header.forEach((item,index)=>{
        pickList.push(
            <Picker.Item label={item} value={index} />
        )
        selectList.push(
            <option value={index}>{item}</option>
        )
    })
    useEffect(()=>{
       //console.log()
    //    setBlocker(false)
        pickerRef.current.addEventListener('change',function(event) {
            
            jsonDataCopy[currentIndex].category=pickerRef.current.value
            console.log(currentIndex+" = "+jsonData.header[jsonDataCopy[currentIndex].category])
        });
        document.addEventListener("keypress",function(e){
            if(e.keyCode==122){
                
                
                if(currentIndex==0){
                    console.log('save function needed here')
                }
                else{
                    jsonDataCopy[currentIndex].category=pickerRef.current.value
                    currentIndex=currentIndex-1
                    if(jsonDataCopy[currentIndex].category==''){
                        console.log('category needs to be assigned')
                    }
                    else{
                        pickerRef.current.selectedIndex=jsonDataCopy[currentIndex].category
                    }
                    pathTextRef.current.innerHTML=jsonData.data[currentIndex].path
                }
            }
            if(e.keyCode==47){
                if(currentIndex+1<jsonData.data.length){
                    
                    jsonDataCopy[currentIndex].category=pickerRef.current.value
                    currentIndex=currentIndex+1
                    if(jsonDataCopy[currentIndex].category==''){
                        console.log('category needs to be assigned')
                    }
                    else{
                        pickerRef.current.selectedIndex=jsonDataCopy[currentIndex].category
                    }
                    pathTextRef.current.innerHTML=jsonData.data[currentIndex].path   
                }
                else{
                    console.log('save function needed here')
                }
                
            }
            var checker = []
            for (var i=0; i<=currentIndex; i++){
                checker.push(jsonData.header[jsonDataCopy[currentIndex].category])
            }
            console.log(checker)
            console.log(jsonDataCopy)
        },false)
        jsonCopy.header=jsonData.header
        jsonCopy.data=[]
        
    },[])

    useEffect(()=>{

        
     },[currentPickView])
     useEffect(()=>{
        
        console.log('currentIndex is '+ currentIndex)
        console.log('currentPick is '+currentPick)
        pathTextRef.current.innerHTML=jsonData.data[currentIndex].path
        
        // setCurrentPick(100)
        // setBlocker(false)
        
     },[currentIndex])

    return(
    
        <View
            style={{
                flex:1,
                flexDirection:'row',
                backgroundColor:'transparent',
                justifyContent:'center',
                alignItems:'center'
            }}
        >
            <View
                style={{
                    width:250,
                    backgroundColor:'transparent'
                }}
            >
                <Text
                    
                    style={{
                        marginBottom:12,
                        flex:1,
                        fontSize: 12,
                        color: 'black',
                        textAlign: 'left',
                        transform:`translate(0px, 5px)`
                    }}
                >
                    <a
                        ref={pathTextRef}
                    >
                    </a>
                </Text>
            </View>
            {/* <Picker
                ref={pickerRef}
                selectedValue={currentPickView}
                style={{height: 33, width: 100, alignItems:'center'}}

                onValueChange={(itemValue, itemIndex) =>{
                    setCurrentPickView(itemValue)
                }  
                }>
                
                {pickList}
            </Picker> */}
            <select 
                ref={pickerRef}
            >
                {selectList}
            </select>
        </View>
    )
}