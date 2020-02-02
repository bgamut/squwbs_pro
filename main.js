const { app, BrowserWindow,Tray } = require('electron')
const path = require('path')
const fs=require('fs')
// const isDev= require('electron-is-dev')
const isDev=false
// const child_process=require("child_process")
// // require('electron-reload').apply(__dirname,{
// //   hardResetMethod:'exit'
// // })
// child_process.exec("BROWSER=none yarn react-start",function(){
//   console.log('cross-env started')
// })
function createWindow () {
  var portfinder = require('portfinder')
  
  function findPort(){
      portfinder.getPort(function(err,port){
          console.log("express server started in localhost:"+port)
          var originalJson=JSON.parse(fs.readFileSync("./src/assets/sharedInfo.json"))
          originalJson.portnumber=port
          console.log(originalJson)
          fs.writeFile("./src/sharedInfo.json",JSON.stringify(originalJson),function(){
            require("./src/expressServer/server").expressServer(port)
            win.loadURL("http://localhost:"+port)
          })
      })  
  }
  findPort()
  // Create the browser window.
  let win = new BrowserWindow({
    //width: 1024,
    width: 289,
    // height: 77,
    height:150,
    webPreferences: {
      nodeIntegration: true
    },
    maximizable:false,
    resizable:true,
    //resizable:false,
    // frame:false,
    //transparent:true,
    title:'squwbs',
    appIcon:__dirname + '/squwbs.icns',
    
  })
  // win.loadURL(
  //   isDev 
  //   ? "http://localhost:3000" 
  //   : `file://${path.join(__dirname,"/build/index.html")}`
  // )
  // isDev
  // ? win.loadURL("http://localhost:3000")
  // : win.loadFile("dist/index.html")
  
  
  // win.loadURL("http://localhost:3000")
  // win.loadURL("http://localhost:"+port)
  // and load the index.html of the app.
  //win.loadFile('app/dist/index.html')
  const tray = new Tray(__dirname+'/src/assets/tray_icon.png')
  tray.on('click',()=>{
    if(win.isVisible() == false){
      win.show()
    } 
  })
  win.on('show',()=>{
   // tray.setHighlightMode('never')
  })
  win.on('hide',()=>{
    //tray.setHighlightMode('never')
  })
  win.on('quit',()=>{
    tray.webContents.clearHistory()
  })
}

app.on('ready', createWindow)