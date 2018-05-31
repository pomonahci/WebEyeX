var path     = require('path');               //documentation: https://nodejs.org/api/path.html
var express  = require('express');            //connect with express
var app      = express();
var http     = require('http').Server(app);
var ss       = require('socket.io-stream');
var gazejs   = require("gazejs");             //utilizes BridJS api to bind javascript to Tobii Gaze SDK
var Readable = require('stream').Readable;
const io     = require('socket.io')(http);    //import socket.io and socket.io-streams
const port   = 3000;                          //local host port
app.use(express.static('scripts'));           //allow Node.js access scripts directory

console.log("loading connection...");//console feedback for user
io.of('/data').on('connection', socket => {//broadcast for soccet connection
  console.log("connection complete.");//console feedback for user
  var eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);
  var listener = {
      onConnect:function(){ //on connection with eye tracker...
          eyeTracker.start(); //begin eye tracking
          console.log("connected to eye tracker: " + eyeTracker.getModelName);
      }, onError:function(error){
        console.log(error);
      }, onGazeData:function(gazeData){ //recieving gaze data
        //check that gaze data recieved has the valid fields and is defined
        if('prefered' in gazeData){
          if(gazeData.prefered !== undefined) {
            //initialize readable stream
            var s = new Readable();
            s._read = function() {};
            var stream = ss.createStream();
            //format the gaze data to be sent
            toSend = gazeData.prefered.x + "," + gazeData.prefered.y; //
            //push the gaze data to the readable stream
            s.push(toSend);
            s.pipe(stream);
            ss(socket).emit('gaze', stream); //broadcast the stream
          }
        }
      }
  };
  eyeTracker.setListener(listener); //connect the eye tracker to the event listeners
  eyeTracker.connect(); //connect to eye tracker

  //log a disconnect from the socket
  socket.on('disconnected', () => {
    console.log("disconnected");
  })
});

//send a request with response result with express
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
})

//run server
http.listen(port, function () {
  console.log("server running on port: "+port);
});
