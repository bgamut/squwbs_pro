var express = require('express');
const cors = require('cors')
require('module-alias/register')
const path = require('path');
var cookieParser = require('cookie-parser')
var flash = require('connect-flash')
var net = require('net')
var fs=require('fs')

console.log(require('path').join(require('os').homedir(), 'Desktop'))
var server = net.createServer(function(socket){
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
// server.listen(1337)
module.exports.expressServer = function (portnumber){
if (process.env.DYNO) {
  trustProxy = true;
}
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine','ejs')
app.use((err, req, res, next) => {
  res.locals.session = req.session
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})
app.use(cookieParser('keyboard cat'))
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(flash())
app.use(express.static(path.join(__dirname, '/../../build')));
app.use(express.static(path.join(__dirname, '/html/*/*')));
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
app.get('/',cors(), function (req, res) {
    res.render(path.join(__dirname, 'build','index.html'));
})
console.log(path.join(__dirname,'../../build'))
console.log('server started in port number : '+String(portnumber))
app.listen(process.env['PORT'] || portnumber);
}