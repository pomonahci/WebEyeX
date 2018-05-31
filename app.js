var express = require('express');                   //connect with express
var path = require('path');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
var ss = require('socket.io-stream');
var gazejs = require("gazejs");
var Readable = require('stream').Readable;
console.log(__dirname);
app.use(express.static('scripts'))

const port = 3000;

io.of('/data').on('connection', socket => {
  console.log('connected'); 

  socket.on('disconnected', () => {
    console.log("disconnected");
  })

  var timer = setInterval(function() {
    var stream = ss.createStream();
    var s = new Readable();
    s._read = function() {};
    s.push("Hello");
    s.pipe(stream);
    ss(socket).emit('gaze', stream, "yeah");
    console.log("Pushed to stream.");
  }, 1000);

});

// var eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);//or gazejs.SR_EYELINK_SDK
// var listener = {
//     onConnect:function(){
//         console.log("Library version: "+eyeTracker.getLibraryVersion());
//         console.log("Model name: "+eyeTracker.getModelName());

//         eyeTracker.start();
//         console.log("OnConnect");
//     },
//     onStart:function(){
//         console.log("OnStart");
//     },
//     onStop:function(){
//         console.log("OnStop");
//     },
//     onError:function(error){
//         console.log(error);
//     },
//     onGazeData:function(gazeData){
//         if('prefered' in gazeData) {
//           console.log('data');
//           sendData()
//         }
//     }
// };

// io.on('stop', function() {
//   eyeTracker.release();
// })

// eyeTracker.setListener(listener);
// eyeTracker.connect();

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
})

http.listen(port, function () {
  console.log("Server is running on "+ port +" port");
});
