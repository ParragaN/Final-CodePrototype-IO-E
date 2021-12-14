// M_1_5_02
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * noise values (noise 2d) are used to animate a bunch of agents.
 *
 * KEYS
 * 1-2                 : switch noise mode
 * space               : new noise seed
 * backspace           : clear screen
 * s                   : save png
 */

'use strict';



var sketch = function(p) {
  var agents = [];
  var agentCount = 4000; //contols the amount of lines on screen 
  var noiseScale = 300; //controls the pattern (lower means more particles/ high means more length in lines)
  var noiseStrength = 10; //controls the patterns made by the lines
  var overlayAlpha = 10; //controls transparency of the lines 
  var agentAlpha = 90; //can be the posenet x position of a nose 
  var strokeWidth = 1.8; //width of lines
  var drawMode = 1; // two modes 

  var serial;
  var latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
  
  var pose;
  


  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    for (var i = 0; i < agentCount; i++) {
      agents[i] = new Agent();
    }

    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();
    console.log("serial.list()   ", serial.list());
  
    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("COM3");
      
  // When we connect to the underlying server
  serial.on('connected', serverConnected);
  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);
  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);
  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);
  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);
  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  /////POSENET copied from sketch3 in week 7 posenet code examples
  // p.video = createCapture(VIDEO);
  // p.video.hide();
  // poseNet = ml5.poseNet(p.video, modelLoaded);
  // poseNet = ml5.poseNet(modelLoaded);
  // poseNet.on('pose', gotPoses)  
    
};

function modelLoaded(){
  console.log("modelLoaded function has been called so this work!!!!");
};


//if someone is in frame change the pattern of visuals
// function gotPoses(poses){
//   // console.log(poses);
//   if( poses.length >0 ){
//       pose = poses[0].pose;

//       // var newNoiseSeed = p.floor(p.random(10000));
//     //   p.noiseSeed(newNoiseSeed);
//   } 
  
// } 

        function serverConnected() {
          console.log("Connected to Server");
        }
        
        // Got the list of ports
        function gotList(thelist) {
          console.log("List of Serial Ports:");
          // theList is an array of their names
          for (var i = 0; i < thelist.length; i++) {
            // Display in the console
            console.log(i + " " + thelist[i]);
          }
        }
        
        // Connected to our serial device
        function gotOpen() {
          console.log("Serial Port is Open");
        }
        
        // Ut oh, here is an error, let's log it
        function gotError(theerror) {
          console.log(theerror);
        }
        
        
        
        function gotData() {
          var currentString = serial.readLine();  // read the incoming string
          // trim(currentString);                    // remove any trailing whitespace
          if (!currentString) return;             // if the string is empty, do no more
          // console.log("currentString  ", currentString);             // println the string
          latestData = currentString;            // save it for the draw method
          // console.log(latestData);   //light sensor value
                  
        }
        
        // We got raw data from the serial port
        function gotRawData(thedata) {
          println("gotRawData" + thedata);
        }
    
  p.draw = function() {

    var lightcalc= (2/latestData*1000);
    var sun= Math.round(lightcalc);
    console.log(sun);

    p.fill(255, overlayAlpha);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Draw agents color and transparency 
    p.stroke(0, 0, sun+100, agentAlpha);
    for (var i = 0; i < agentCount; i++) {
      if (drawMode == 1) agents[i].update1(noiseScale, noiseStrength, strokeWidth);
      else agents[i].update2(noiseScale, noiseStrength, strokeWidth);
    }
     



   incrementSeconds();
   switchMode();


   if(pose){
    var newNoiseSeed = p.floor(p.random(10000));
    p.noiseSeed(newNoiseSeed);
   }   
//end draw
  };
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //TIMING OF SWITCH MODE
  var timer = 0;
  function incrementSeconds(){
  timer += 1;
  // console.log(timer);
  };
  
  // figure out the timing of this to be the breathing pattern 4-7-8, 
function switchMode(){
if (timer == '600')  {
//  console.log('200 reached');
 drawMode = 2;
 timer=0;
}
else if(timer == '300'){
  drawMode = 1;
  timer=301;
}
 
   
};

// this is supposed to be mapped to the posenet but the libraries of that isnt working in this code file
  p.keyReleased = function() {
  //   // if (p.key == 's' || p.key == 'S') p.saveCanvas(gd.timestamp(), 'png');
  //   if (p.key == '1') drawMode = 1;
  //   if (p.key == '2') drawMode = 2;

  // have this be mapped to if someone is on screen
    if (p.key == ' ') {
      var newNoiseSeed = p.floor(p.random(10000));
      p.noiseSeed(newNoiseSeed);
    }

  //   if (p.keyCode == p.DELETE || p.keyCode == p.BACKSPACE) p.background(0);
  };


};


var myp5 = new p5(sketch);