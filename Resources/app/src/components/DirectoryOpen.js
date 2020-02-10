import React, {Component,useCallback,useState,useEffect} from 'react'
import {Text,View,Dimensions,TouchableOpacity} from 'react-native'
import Dropzone, {useDropzone} from 'react-dropzone'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'

// const fs =require('fs')
const isWav = require('is-wav')
const clearModule = require('clear-module');
const AcceptArrayBuffer= require ('../binary_build/spline/build/Release/addon.node').AcceptArrayBuffer
const path = require('path')
const withQuery = require('with-query').default;


// const DirectoryOpen = (props)=> {
  

export default function DirectorOpen(props){
    const [portnumber,setPortnumber]=useState(8000)
    const [handshakeStatus,setHandshakeStatus]=useState(false)
    // var handshakeStatus=false
    const resetPortSettings=async()=>{
        function getPortnumberFromJSON(){
            setPortnumber(portnumber)
            fetch(withQuery('http://127.0.0.1:'+portnumber+'/reset-port-number', {
                mode:'cors',
            }))
            .then(result=>{
            return result.json()
            })
            .then((json)=>{
                console.log(stringifyObject(json))
            })
            .catch((err)=>{
                console.error(err)
            })
        }
        getPortnumberFromJSON()
        
    }
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
    const restApi=async(endPoint,queries,cb)=>{
        var json = require('../assets/sharedInfo.json')
        //console.log(json)
        
        if(portnumber!=null){
            // console.log('http://127.0.0.1:'+portnumber+'/'+endPoint)
            // console.log({
            //     ...queries,
            //     mode:'cors',
            // })
            fetch(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, {
                ...queries,
                mode:'cors',
            }))
            .then(result=>{
                return result.json()
                //return stringifyObject(result.json())
            })
            .then((json)=>{
                //console.log(stringifyObject(json))
                //console.log('do something here')
                var stringedJson = stringifyObject(json)
                //return(stringedJson)
            })
            .catch((err)=>{
                console.error(err)
                //todo: put file to error list.
                //return(null)
            })
            // try{
            //     var result = await(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, 
            //                 {
            //                     ...queries,
            //                     mode:'cors',
            //                 }))
            //     var json = await result.json()
            //     var stringedJSON = stringifyObject(json)
            //     return(stringedJSON)
            // }
            // catch{
            //     return(null)
            // }
        }
        else{
            if(cb!=undefined){
                setTimeout(cb())
            }
        }
    }  
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
    const handshake=()=>{
        var portnum = require('../sharedInfo.json').portnumber
        var queries={number:Math.random()}
        console.log('http://127.0.0.1:'+portnum+'/handshake')
        if(portnum!=null){
            fetch(withQuery('http://127.0.0.1:'+portnum+'/handshake', {
                ...queries,
                mode:'cors',
            }))
            .then(result=>{
                return result.json()
            })
            .then((json)=>{
                if(json.number=queries.number){
                    setHandshakeStatus(true)
                    setPortnumber(portnum)
                }
            })
            .catch((err)=>{
                
                clearModule('../sharedInfo.json')
                console.error(err)
                setTimeout(function(){
                    console.log('err')
                    handshake()
                },15000)
            })
        }
        else{
           
            clearModule('../sharedInfo.json')
            setTimeout(function(){
                console.log('else')
                handshake()
            },15000)
        }
    }  
    
    useEffect(()=>{
        console.log('started')
        handshake()
        //getPort()
        
        document.getElementById('business').onchange = function(e){ 
            var files = e.target.files; 
            var filePaths =[];
            var obj={}
            for (var i = 0; i < files.length; i++) {
                filePaths.push(files[i].path)
            }
            var fileIndex=0
            obj.files=filePaths
            //  restApi('file-path-list',obj)
            var i = 0
            function callback(){
                
            }
            //postApi("all-files",{data:filePaths})
            async function start(){
                for(var i =0; i<filePaths.length; i++){
                    var obj={file:filePaths[i]}
                    //console.log(obj)
                    var json= await restApi("one-file",obj)
                    //console.log(json)
                }
            }
            start()
            
           
        }
    },[])
    useEffect(()=>{
        if(handshakeStatus==true){
            console.log("handshake successful")
            resetPortSettings()
        }
    },[handshakeStatus])
    
    useEffect(()=>{
        console.log('portnumber status changed!')
        console.log(portnumber)
    },[portnumber])
    
    const download = (downloadList) =>{
        var element = document.createElement('a');
        element.setAttribute('href', 'https://squwbs-252702.appspot.com/download');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }  
    const pushed=()=>{
        document.getElementById('business').click()
    }
      return (
        <Fade>
            <View style={{ 
                width:150,
                backgroundColor:'rgb(186,214,227)',
                flex:1,
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:2,
                borderColor:'lightgrey',
                borderStyle:'solid',
                overflow:'hidden',
                boxSizing:"border-box",
                shadowColor:'#000',
                shadowOpacity:0.85,
                shadowRadius:2,
                shadowOffset:{
                width:0,
                height:0
                },
                elevation:2
            }}>
                <View style={{
                    height:33,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <TouchableOpacity onPress={(e)=>{
     
                        pushed()
                    }}>
                        <Text 
                            id="text"
                            selectable={false} style ={{
                            fontSize: 11,
                            fontWeight:'700',
                            textDecorationLine:'none',
                            color:'white',
                            textShadowColor: 'rgba(0, 0, 0, 0.85)',
                            textShadowOffset: {width: 0, height: 0},
                            textShadowRadius: 2,
                            textAlign:'center',
                            alignItems:'center',
                            justifyContent:'center',
                            flexDirection:'row',
                            margin:5,
                        }}>
                            Ready
                        </Text>
                        <input id="business" type="file" multiple webkitdirectory='true' directory='true' style={{display: "none"}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Fade>
      )
}
// export default DirectoryOpen
