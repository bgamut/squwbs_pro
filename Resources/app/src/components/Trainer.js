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
            <option value={index}>{item}</option>
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
       //console.log()
    //    setBlocker(false)
        pickerRef.current.addEventListener('change',function(event) {
            jsonDataCopy[currentIndex].category=pickerRef.current.value
            console.log(currentIndex+" = "+jsonData.header[jsonDataCopy[currentIndex].category])

            // if(smallerJsonData.length!=0){
            //     for(var i=0; i<smallerJsonData.length; i++){
            //         console.log(smallerJsonData[i].path)
            //         console.log(jsonDataCopy[currentIndex].path)
            //         console.log(smallerJsonData[i].path==jsonDataCopy[currentIndex].path)
            //         if(smallerJsonData[i].path==jsonDataCopy[currentIndex].path){
            //             smallerJsonData[i]=jsonDataCopy[currentIndex]
            //         }
            //         else{
            //             smallerJsonData.push(jsonDataCopy[currentIndex])
            //         }
            //     }
            // }
            // else{
            //     smallerJsonData.push(jsonDataCopy[currentIndex])
            // }
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
            //console.log(e.keyCode)
            if(e.keyCode==115){
                console.log('comparison started')
                var uniqueEntriesOnly=[]
                // var pastEntry=''
                // for(var i =0; smallerJsonData.length; i++){
                //     //console.log(JSON.stringify(pastEntry))
                //     //console.log(JSON.stringify(smallerJsonData[i]))
                //     var currentEntry=JSON.stringify(smallerJsonData[i])
                //     console.log(pastEntry==currentEntry)
                //     if(pastEntry!==currentEntry)
                //     {
                //         uniqueEntriesOnly.push(smallerJsonData[i])
                //     }
                //     pastEntry=currentEntry
                // }
                console.log(includedIndexes)
                includedIndexes.forEach(function(integer){ 
                    // console.log(JSON.stringify(jsonDataCopy[includedIndexes[i]]))
                    // uniqueEntriesOnly.push(JSON.stringify(jsonDataCopy[includedIndexes[i]]))
                    console.log(JSON.stringify(jsonDataCopy[integer]))
                    uniqueEntriesOnly.push(JSON.stringify(jsonDataCopy[integer]))
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
                    console.log('save function fired')  
                    console.log({header:jsonData.header,data:smallerJsonData})
                    // postApi(
                    //     'create-json',
                    //     {header:jsonData.header,data:smallerJsonData},
                    //     function(){console.log('check json file')}
                    // )
                    // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({header:jsonData.header,data:jsonDataCopy}));
                    // var downloadAnchorNode = document.createElement('a');
                    // downloadAnchorNode.setAttribute("href", dataStr);
                    // downloadAnchorNode.setAttribute("download",  "sampleTrainData.json");
                    // document.body.appendChild(downloadAnchorNode); // required for firefox
                    // downloadAnchorNode.click();
                    // // downloadAnchorNode.remove();
                    // document.body.removeChild(downloadAnchorNode);
                      
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
                    console.log('save function fired')
                    console.log({header:jsonData.header,data:smallerJsonData})
                    // postApi(
                    //     'create-json',
                    //     {header:jsonData.header,data:smallerJsonData},
                    //     function(){console.log('check json file')}
                    // )
                    // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({header:jsonData.header,data:jsonDataCopy}));
                    // var downloadAnchorNode = document.createElement('a');
                    // downloadAnchorNode.setAttribute("href", dataStr);
                    // downloadAnchorNode.setAttribute("download",  "sampleTrainData.json");
                    // document.body.appendChild(downloadAnchorNode); // required for firefox
                    // downloadAnchorNode.click();
                    // // downloadAnchorNode.remove();
                    // document.body.removeChild(downloadAnchorNode);
                }
            }
            var checker = []
            for (var i=0; i<=currentIndex; i++){
                checker.push(jsonData.header[jsonDataCopy[currentIndex].category])
            }
            //console.log(checker)
           // console.log(jsonDataCopy)
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
                style={{height: 33, width:'33%', alignItems:'center'}}
            >
                {selectList}
            </select>
        </View>
    )
}