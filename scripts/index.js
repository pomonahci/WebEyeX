var ss = require('socket.io-stream');


$(function(){
        var socket = io.connect('http://localhost:3000/data');
        socket.on('connect', function() {
          console.log("Connected to server.");

          ss(socket).on('gaze', function(stream, data) {
            console.log(data);
            console.log(stream);
            stream.on('data', function(data2) {
              dataString = '';
              dataString += data2;
              console.log(dataString);
              var strings = dataString.split(',');
              var x = parseFloat(strings[0]);
              var y = parseFloat(strings[1]);
              var prefX = x * screen.width;
              var prefY = y * screen.height - (window.outerHeight - window.innerHeight);
              draw(prefX,prefY);
            })
          })
        });

        var canvas=document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        var eye=canvas.getContext("2d");
        var num = 0;

        var canvasOffset=$("#canvas").offset();
        var offsetX=canvasOffset.left;
        var offsetY=canvasOffset.top;

        function draw(x,y){
            eye.clearRect(0,0,canvas.width,canvas.height);
            eye.beginPath();
            eye.fillStyle="red";
            eye.rect(x,y,10,10);
            eye.fill();
            eye.stroke();
        }

        function handleMouseDown(e){

        }

        $("#canvas").mousedown(function(e){handleMouseDown(e);});

        // socket.on('gazeData', function(data){
        //   if(data !== null) {
        //   prefX = data.x * screen.width;
        //   prefY = data.y * screen.height - (window.outerHeight - window.innerHeight);
        //   console.log("recieved: "+ num);
        //   num++;
        //   draw(prefX, prefY);
        // }
        // });

}); // end $(function(){});
