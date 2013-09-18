/**
  leapduino.js

  This is a simple example which connects Leap Simple Gestures module
  with an arduino board (with an LCD shield attached to) using 'johnny-five' .

  Be sure to have installed johnny-five before running this,
    npm install johnny-five
 */

var Leap = require('leapjs'),
  LeapGestures = require('..'),
  five = require('johnny-five');

var controller = new Leap.Controller( {enableGestures: true} ),
  scanner = new LeapGestures( ['swipe', 'circle', 'screenTap', 'keyTap'] ),
  board = new five.Board(),
  gestureType = "",
  gestureDirection = "",
  lcd;

board.on("ready", function(){

  /*
  * Arduino c0de
  */

  // LCD Shield DF ROBOTs fix for backlight issue (bad design)
  // According to: http://bit.ly/18aXpWn
  this.pinMode( 10, five.Pin.OUTPUT );
  this.pinMode( 10, five.Pin.INPUT );

  lcd = new five.LCD({
    pins: [ 8, 9, 4, 5, 6, 7 ],
    rows: 2,
    cols: 16,
  });

  lcd.on("ready", function(){
    lcd.display();
    lcd.blink();
    lcd.clear().print( "waiting..." );
  });

  function updateScreen(){
    lcd.clear();
    lcd.print( "GESTURE RECOGNZR" );
    lcd.setCursor( 0, 1 );
    lcd.print( gestureType + " | " + gestureDirection);
  };

  /*
  * Leap c0de
  */

  controller.on("ready", function() {
      console.log("ready");
  });
  controller.on("connect", function() {
      console.log("connect");
  });
  controller.on("disconnect", function() {
      console.log("disconnect");
  });
  controller.on("deviceConnected", function(){
    console.log("Leap device succesfully connected");
  });

  controller.on("frame", function(frame) {
    var frameGestures = frame.gestures;

    scanner.recognize(frame, function(gestureData){

      if (typeof gestureData === 'undefined') return;

      gestureDirection = "";

      if ( gestureData.direction && gestureData.direction.length ){
        var swd = gestureData.direction;
        gestureDirection = (swd[0] >= swd[1]) ? 'left' : 'right';
      }

      gestureType = gestureData.type;

      updateScreen();
    });

  });

  controller.connect();
  console.log("\nWaiting for device to connect...");

});