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
var includedIndexes=[]
var jsonCopy = {}
var smallerJson={}
var smallerJsonData=[]
var assert = require('assert');
const path = require('path')
const withQuery = require('with-query').default;
export default function Trainer(props){
    const pathTextRef= useRef(null)
    const pickerRef= useRef(null)
    //const [currentIndex,setCurrentIndex]=useState(0)
    //var jsonData 
    var currentIndex=0
    //const [currentPick,setCurrentPick]=useState('none')
    var currentPick=''
    const [currentPickView,setCurrentPickView]=useState('')
    const [portnumber,setPortnumber]=useState(8000)
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
            <option key ={index} value={index}>{item}</option>
        )
    })
    const postApi=(endPoint,obj,cb)=>{
        if(portnumber!=null){

            fetch('http://127.0.0.1:'+portnumber+'/'+endPoint, {
                method:"POST",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(obj),
                mode:'cors',
            })
            .then(result=>{
                return result.json()
                //return stringifyObject(result.json())
            })
            .then((json)=>{
                console.log(stringifyObject(json))
                console.log('do something here')
                var stringedJson = stringifyObject(json)
                //return(stringedJson)
            })
            .catch((err)=>{
                //console.error(err)
                console.log()
                //return(null)
            })
 
        }
        else{
            if(cb!=undefined){
                setTimeout(cb())
            }
        } 
    }
    useEffect(()=>{

        pickerRef.current.addEventListener('change',function(event) {
            jsonDataCopy[currentIndex].category=Number(pickerRef.current.value)
            console.log(currentIndex+" = "+jsonData.header[jsonDataCopy[currentIndex].category])

            if(includedIndexes.length!=0){
                if(includedIndexes.includes(currentIndex)==false){
                    includedIndexes.push(currentIndex)
                }
            }
            else{
                includedIndexes.push(currentIndex)
            }
            //console.log(smallerJsonData)
        });
        document.addEventListener("keypress",function(e){
            if(e.keyCode==115){
                console.log('comparison started')
                var uniqueEntriesOnly=[]

                console.log(includedIndexes)
                includedIndexes.forEach(function(integer){ 
                    console.log(JSON.stringify(jsonDataCopy[integer]))
                    uniqueEntriesOnly.push(jsonDataCopy[integer])
                })
                console.log('comparison ended')
                postApi(
                    'create-json',
                    {header:jsonData.header,data:uniqueEntriesOnly},
                    function(){console.log('check json file')}
                )
            }
            if(e.keyCode==122){
                if(currentIndex==0){
                    // console.log('save function fired')  
                    console.log({header:jsonData.header,data:smallerJsonData})    
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
                    // console.log('save function fired')
                    console.log({header:jsonData.header,data:smallerJsonData})
                }
            }
            var checker = []
            for (var i=0; i<=currentIndex; i++){
                checker.push(jsonData.header[jsonDataCopy[currentIndex].category])
            }

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
     },[currentIndex])

    return(
    
        <View
            style={{
                width:'100%',
                flex:1,
                flexDirection:'row',
                backgroundColor:'transparent',
                justifyContent:'center',
                alignItems:'center'
            }}
        >
            <View
                style={{
                    width:'66%',
                    backgroundColor:'transparent',
                    textAlign:'justify'
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
            <select 
                ref={pickerRef}
                style={{height: 33, width:'33%', alignItems:'center'}}
            >
                {selectList}
            </select>
        </View>
    )
}