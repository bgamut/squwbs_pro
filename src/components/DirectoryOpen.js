import React, {Component,useCallback,useState,useEffect} from 'react'
import {Text,View,Dimensions,TouchableOpacity} from 'react-native'
import Dropzone, {useDropzone} from 'react-dropzone'
import Fade from 'react-reveal/Fade'
import stringifyObject from 'stringify-object'
const AcceptArrayBuffer= require ('../binary_build/spline/build/Release/addon.node').AcceptArrayBuffer

const withQuery = require('with-query').default;

// const DirectoryOpen = (props)=> {
export default function DirectorOpen(props){
    useEffect(()=>{
        document.getElementById('business').onchange = function(e){ 
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
