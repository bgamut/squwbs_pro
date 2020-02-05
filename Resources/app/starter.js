var child_process = require('child_process')
var path = require('path')
// child_process.exec("npm start",function(){
//     console.log('npm? hello?')
// })
// /Users/bernardahn/Downloads/squwbs_pro-master/Resources/app/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
// child_process.exec("electron .",function(){
//     console.log('npm? hello?')
// })
// var command=path.join(process.cwd(),'/../Resources/app/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'+' '+path.join(process.cwd()+'/../Resources/app'))
var command=path.join(process.cwd(),'/../Resources/app/node_modules/electron/dist/squwbs.app/Contents/MacOS/Electron'+' '+path.join(process.cwd()+'/../Resources/app'))
child_process.exec(command,function(){
    console.log(command)
})