import React, {Component,useCallback,useState,useEffect} from 'react'
import {Text,View,Dimensions,TouchableOpacity} from 'react-native'
import Dropzone, {useDropzone} from 'react-dropzone'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'
const isWav = require('is-wav')
const AcceptArrayBuffer= require ('../binary_build/spline/build/Release/addon.node').AcceptArrayBuffer

const withQuery = require('with-query').default;

// const DirectoryOpen = (props)=> {
export default function DirectorOpen(props){
    useEffect(()=>{
        console.log('started')

        // var fs = require('fs');
        //var fs =__non_webpack_require__("fs")
        //console.log(fs)
        document.getElementById('business').onchange = function(e){ 
            
            var files = e.target.files; 
            //console.log(files)

            // for (var index in files){
                
            //     console.log(stat)
            // }
            for (var i = 0; i < files.length; i++) {
        
                (function(file) {
        
                  console.log(file.path)
                  var reader = new FileReader();
                  reader.onload = function(e) { 
                    
                    
                    var buffer = reader.result
                    console.log(typeof(buffer))
                    // let int32Factor=Math.pow(2,31)
                    // let result = wav.decode(buffer)
                    
                    // let left = result.channelData[0].slice()
                    // let right = result.channelData[1].slice()
                    // //console.log('sound:',left)
                    // var max = 0
                    // for (var i = 0; i<left.length; i++){
                    //   if(max<Math.abs(left[i])){
                    //     max=Math.abs(left[i])
                    //   }
                    //   if(max<Math.abs(right[i])){
                    //     max=Math.abs(right[i])
                    //   }
                    // }
                    // for (var i = 0; i<left.length; i++){
                    //   left[i]=((left[i]/max))
                    //   right[i]=((right[i]/max))
                    //   //console.log(left[i])
                    // }
                    // const binSize=1024
                    // var meanLeft=0
                    // var meanRight=0
                    // var maxLeft=0
                    // var maxRight=0
                    // var lastLeftSample=0
                    // var lastRightSample=0
                    // for(var i =0; i<left.length; i++){
                    //   console.log(temp)
                    //   left[i]=(temp.left)
                    //   right[i]=(temp.right)
                      
                    // }
                    // var encoded=wav.encode([left,right],{sampleRate:result.sampleRate, float:true, bitDepth:16}).slice()

                    // var blob = new Blob([encoded],{
                    //   type:'audio/wav'
                    // })
                    // var url=window.URL.createObjectURL(blob)
                    // console.log(url)
                    // var a = document.createElement('a')
                    // a.setAttribute('href',url)     
                    // a.setAttribute('download','master.wav')
                    // a.click()
                    // a.remove()
                    // setTimeout(function(){
                    //   window.URL.revokeObjectURL(url)
                    // },1000)
        
                  };
                  reader.readAsArrayBuffer(file)
                  //reader.readAsDataURL(file)
                  //reader.readAsBinaryString(file)
                })(files[i]);
              }
            console.log('pushed')
        }
      },[])
    const getUserData=async(itemList)=>{
        const responded= await fetch('https://squwbs-252702.appspot.com/readCookies',{mode:'cors'})
        const userCookie = await responded.json()
        console.log('userCookie : '+stringifyObject(userCookie))
        if(Object.keys(userCookie).length>1){
        console.log('user info sent to server')
    
        fetch(withQuery('https://squwbs-252702.appspot.com/info', {
            ...userCookie,
            itemList:itemList,
            mode:'cors',
        }))
            .then(result=>{
            console.log('got result from info/')
            return result.json()
            })
            .then((json)=>{
                console.log(stringifyObject(json))
            })
            .catch((err)=>{
                console.error(err)
            })
        }
    }
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
