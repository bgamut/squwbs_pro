const { app, BrowserWindow,Tray } = require('electron')
require('electron-reload').apply(__dirname,{
  
  hardResetMethod:'exit'
})
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    //width: 1024,
    width: 289,
    height: 77,
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

  // and load the index.html of the app.
  win.loadFile('index.html')
  const tray = new Tray(__dirname+'/tray_icon.png')
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