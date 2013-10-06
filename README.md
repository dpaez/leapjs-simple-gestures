leapjs-simple-gestures
======================

### A simple API to catch Leap Motion built-in gestures.

## Features
- Detects Leap Motion built-in gestures (swipe, circle, keyTap & screenTap).

## Usage
- Create a new LeapGestures instance. Then call recognize method. When a gesture is found your callback will be executed.
  Example:
  
  ```javascript
  // be sure to have leapjs installed
  var leap = require('leapjs'); 
  // clone this repo or include it into your project's dependencies
  var LeapGestures = require('vendor/leap-simple-gestures');

  // then you can do...
  var controller = new Leap.Controller( {enableGestures: true} );
  // indicate the gesture you want to listen to.
  var scanner = new LeapGestures( ['swipe'] );
  
  // then into your app logic, use __recognize__ to listen for selected gestures and apply callbackFn
  scanner.recognize( leapFrame, callbackFn );
  ```
  
## Note
This is an early release of a simple proof-of-concept. The main goal behind this module was to connect the Leap Motion device whit an arduino board and making them work together.
Check the example directory to see "what i'm talking about".
