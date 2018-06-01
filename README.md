# WebEyeX

This simple Node.js app visualizes data from the Tobii EyeX Eye Tracker onto a webpage. Only runs on Windows machines.


![Screen Shot](WebEyeX_screen.png?raw=true "Screen Shot")

### Dependencies Used
* [GazeJS](https://github.com/jiahansu/GazeJS)
* [socket.io](https://github.com/socketio/socket.io)
* [socket.io-stream](https://github.com/nkzawa/socket.io-stream)

### Process
Two files in the directory (Tobii.EyeX.Client.dll & TobiiGazeCore64.dll) come from the x64 directory of the 
[Tobii EyeX SDK](https://tobiigaming.com/getstarted/?utm_source=developer.tobii.com) 
and are used by GazeJS to supply the gaze data to the Node.js file (app.js). The app.js file collects the gaze data and 
sets up a stream using socket.io which sends the data to the client (browser), which parses the data and modifies the visual display 
appropriately to pinpoint current gaze.

### Set Up
Download the files or clone them and then download the dependencies as described on their respective sites. To run the server
open PowerShell and navigate to the root directory of the project and type the command ``` node app.js ``` In your browser navigate 
to localhost:3000 or whatever port responds (this will be logged in PowerShell).

#### Created By
[Kevin Lee](https://github.com/kevinsangholee) & [Ethan Hardacre](https://github.com/ehardacre)
