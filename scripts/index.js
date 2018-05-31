var ss = require('socket.io-stream'); //import socket stream

$(function(){
        var socket = io.connect('http://localhost:3000/data'); //connect to /data
        socket.on('connect', function() {
          ss(socket).on('gaze', function(stream) {
            stream.on('data', function(data) {
              //add list of ints to the data String
              dataString = '';
              dataString += data;
              //parse the string for the x and y percentages
              var strings = dataString.split(',');
              var x = parseFloat(strings[0]);
              var y = parseFloat(strings[1]);
              //adjust percentages to positions on the screen
              var prefX = x * screen.width;
              var prefY = y * screen.height - (window.outerHeight - window.innerHeight);
              //change the location of the visual notifier
              draw(prefX,prefY);
            })
          })
        });

        //initialize the canvas and dimensions
        var canvas=document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var canvasOffset=$("#canvas").offset();
        var offsetX=canvasOffset.left;
        var offsetY=canvasOffset.top;
        //remove scroll ability
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        //initialize the 2D object
        var eye=canvas.getContext("2d");
        /*draw the 2D object
          params: x and y positions of the object
        */
        function draw(x,y){
          //remove the previous instance from canvas
            eye.clearRect(0,0,canvas.width,canvas.height);
            eye.beginPath(); //redraw
            eye.fillStyle="red";
            eye.rect(x,y,10,10);
            eye.fill();
            eye.stroke();
        }
});
