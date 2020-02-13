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
    jsonData.header.forEach((item,index)=>{
        pickList.push(
            <Picker.Item label={item} value={index} />
        )
    })
    useEffect(()=>{
       //console.log()
    //    setBlocker(false)
        
        document.addEventListener("keyup",function(e){
            //console.log(e.keyCode)
            console.log(jsonData.data)
            if(e.keyCode==90){
                if(currentIndex!=0){
                    // setCurrentIndex(currentIndex-1)
                    currentIndex=currentIndex-1
                    pathTextRef.current.innerHTML=jsonData.data[currentIndex].path
                    //console.log(currentPick)
                    //console.log(jsonData.data[currentIndex].category)
                    //jsonData.data[currentIndex].category=currentPickView
                    //console.log(currentPickView)
                    console.log(currentIndex)
                    //console.log(jsonData.data.length)
                    //console.log(jsonData.data[currentIndex].category)
                    //console.log(jsonData.header[jsonData.data[currentIndex].category])
                    console.log(jsonCopy.data)
                    //setCurrentPickView(currentPick)
                    
                }
                else{
                    console.log('save function needed here')
                }
            }
            if(e.keyCode==191){
                if(currentIndex+1<jsonData.data.length){
                    // setCurrentIndex(currentIndex+1)
                    currentIndex=currentIndex+1
                    pathTextRef.current.innerHTML=jsonData.data[currentIndex].path
                    //jsonData.data[currentIndex].category=currentPickView
                    //console.log(currentPickView)
                    console.log(currentIndex)
                    //console.log(jsonData.data.length)
                    //console.log(jsonData.header[jsonData.data[currentIndex].category])
                    //setCurrentPickView(currentPick)
                    console.log(jsonCopy.data)
                }
                else{
                    console.log('save function needed here')
                }
                
            }
        },false)
        jsonCopy.header=jsonData.header
        jsonCopy.data=[]
        
    },[])
    // useEffect(()=>{
    //     console.log(blocker)
    // },[blocker])
    useEffect(()=>{
        //console.log()
        //pathTextRef.current.innerHTML=jsonData.data[currentIndex].path
        // if(blocker==false){
        //     console.log('current Pick changed to '+ currentPick)
        //     setCurrentIndex(currentIndex+1)
        //     setBlocker(true)
        // }
        //console.log('currentPickViewChanged to '+currentPickView)
        jsonData.data[currentIndex].category=currentPickView
        //console.log(jsonData.data[currentIndex].path +' is '+jsonData.data[currentIndex].category)
        console.log(currentIndex +' is '+jsonData.data[currentIndex].category)
        console.log(currentPickView)
        console.log(jsonData.data[currentIndex])
        jsonCopy.data.push(JSON.stringify(jsonData.data[currentIndex]))
        console.log(jsonCopy)
        //var json = JSON.stringify(jsonData)
        // fs.writeFile('soundFilePath.json', json, 'utf8', function(){
            // clearModule('../assets/soundFilePath.json')
            // jsonData=jsonData
    //     })
     },[currentPickView])
     useEffect(()=>{
        
        console.log('currentIndex is '+ currentIndex)
        
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
                        fontSize: 15,
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
            <Picker
                ref={pickerRef}
                selectedValue={currentPickView}
                style={{height: 33, width: 100, alignItems:'center'}}

                onValueChange={(itemValue, itemIndex) =>{
                    //this.setState({language: itemValue})
                    //console.log(itemValue)
                    //currentPick=itemValue
                    //setCurrentPick(itemValue)
                    setCurrentPickView(itemValue)
                    //console.log(itemValue)
                }  
                }>
                
                {pickList}
            </Picker>
        </View>
    )
}