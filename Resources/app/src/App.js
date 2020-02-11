import React,{Component,useContext,useState,useEffect,useRef} from 'react';
import {Text,View,Dimensions,TouchableOpacity} from 'react-native';
import logo from './logo.svg';
import './App.css';
import DirectoryOpen from './components/DirectoryOpen'
import stringifyObject from 'stringify-object'
// import prepData from './components/prepData'
const clearModule = require('clear-module');
const withQuery = require('with-query').default;

function App(props) {

  const bar = useRef(null)
  const percentageText = useRef(null)
  //var currentIndex=0
  var height=100
  const [portnumber,setPortnumber]=useState(8000)
  const [handshakeStatus,setHandshakeStatus]=useState(false)
  const [updates,setUpdates]=useState(null)
  const [currentIndex,setCurrentIndex]=useState(0)
  // const [stop,setStop]=useState(false)
  var progressBarStyleOne={
    //flex:1,
    height:33,
    width:150,
    backgroundColor:'transparent',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    boxSizing:"border-box",
    // borderRadius:2,
    // borderColor:'transparent',
    // borderStyle:'solid',
    
  };
  var progressBarStyleTwo={
    //flex:1,
    height:33,
    width:150,
    backgroundColor:'rgb(186,214,227)',
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:2,
    borderColor:'rgb(186,214,227)',
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
  };
  var textStyle={
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
      transform: `translate(0px, -3px)` 
  }
  var innerTextStyle={
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
  var percentage=0
  var barWidth=150
  function setPercent(endIndex){
    // if(go==true){
      // if(currentIndex==0){
      //   setStop(true)
      // }
      if(currentIndex+1<endIndex){
        //currentIndex=currentIndex+1
        setCurrentIndex(currentIndex+1)
      }
      else{
        //currentIndex=endIndex
        setCurrentIndex(endIndex)
      }
      //console.log(currentIndex)
      //console.log(endIndex)
      percentage = Math.floor(currentIndex/endIndex*10000)/100
      barWidth=Math.floor(150*currentIndex/endIndex)
      if (percentage!=0){
        percentageText.current.innerHTML=percentage+' %'
        if(currentIndex==endIndex-1){
          percentageText.current.innerHTML="Ready"
          //setStop(false)
        }
      }
      else{
        percentageText.current.innerHTML="Ready"
        // setStop(false)
      }
      bar.current.style.width=barWidth+'px'
      //console.log(bar.current.style.width)
    // }
    
  }
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
  const restApi=async(endPoint,queries,cb)=>{
    // var json = require('../assets/sharedInfo.json')
    if(portnumber!=null){
        fetch(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, {
            ...queries,
            mode:'cors',
        }))
        .then(result=>{
            return result.json()
        })
        .then((json)=>{
            setUpdates(json)
        })
        .catch((err)=>{
            console.error(err)
        })
  
    }
    else{
        if(cb!=undefined){
            setTimeout(cb())
        }
    }
  }  
  const handshake=()=>{
      var portnum = require('./sharedInfo.json').portnumber
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
              clearModule('./sharedInfo.json')
              console.error(err)
              setTimeout(function(){
                  console.log('err')
                  handshake()
              },15000)
          })
      }
      else{
        
          clearModule('./sharedInfo.json')
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
      //document.getElementById('business').oninput = function(e){
          setCurrentIndex(0)
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
              var endGame=filePaths.length
              for(var i =0; i<endGame; i++){
                  var obj={file:filePaths[i],fraction:i/filePaths.length,currentGame:i,endGame:endGame}
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
  useEffect(()=>{
      if(updates!=null && typeof(updates)!=='undefined'){
      //console.log(updates.data)
          //props.percent(updates.data.fraction,updates.data.currentIndex,updates.data.endIndex)
          //setEndIndex(updates.data.endIndex)
          //endIndex=parseInt(updates.data.endGame)
          //props.percent(endIndex)
          setPercent(parseInt(updates.data.endGame))
      }
  },[updates])
  useEffect(()=>{
    // setStop(false)

  },[currentIndex])
  // useEffect(()=>{
  //   // setStop(false)
  //   console.log(stop)
  // },[stop]) 
  const pushed=()=>{
    // if(stop==false){
      
      document.getElementById('business').click()
    // }
  }
  return (
    <div className="App">
      <header className="App-header">
        
          <img src={logo} className="App-logo" alt="logo" />
        <div className="progressBar" style={{...progressBarStyleOne}}>
          <div ref={bar} style={{...progressBarStyleTwo}}>
            <View
              style={{
                height:33,
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              <TouchableOpacity onPress={(e)=>{ 
                // if(stop==false){
                  pushed()
                // }
              }}>
                <Text selectable={false} style={textStyle}><a ref={percentageText} style={innerTextStyle}>Ready</a></Text>
              </TouchableOpacity>
            </View>
          </div>
        </div>
        <input id="business" type="file" multiple webkitdirectory='true' directory='true' style={{display: "none"}}/>
        {/* <DirectoryOpen percent={setPercent}/> */}
      </header>
    </div>
  );
}

export default App;
