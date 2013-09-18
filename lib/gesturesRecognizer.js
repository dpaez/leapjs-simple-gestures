/**
 * Simple Gesture Recognizer for Leap default gestures.
 */

/**
  * Module dependencies
 */
var Emitter = require("events").EventEmitter,
  util = require("util"),
  _ = require("underscore"),
  multipleFrameScanner = require("./multipleFrameGestureStrategy"),
  simpleFrameScanner = require("./simpleFrameGestureStrategy");


/**
 * module exports
 */
exports = module.exports = SimpleRecognizer;

/**
 * [SimpleRecognizer constructor]
 * @param {Array} gesturesArray
 */
function SimpleRecognizer( gesturesArray ){

  var defaultArray = [ 'swipe', 'circle', 'screenTap', 'keyTap' ];
  // var defaultObject = {
  //   'swipe': true,
  //   'circle': true,
  //   'screenTap': true,
  //   'keyTap': true
  // };

  if ( gesturesArray && !util.isArray(gesturesArray) ) return undefined;

  if ( !gesturesArray ){
    gesturesArray = defaultArray;
  }
  //TODO: class function?
  // else{
  //   if ( !isValid(gesturesArray) ) return undefined;
  // }

  this.callback = null;
  this.strategies = [];
  this.singleFrameGestures = [ 'screenTap', 'keyTap' ];
  this.multipleFrameGestures = [ 'circle', 'swipe' ];
  for ( var i = 0; i < gesturesArray.length ; i++ ){
    var scannerContext = {};
    switch( gesturesArray[i] ){
      case 'swipe':
        scannerContext = new GestureStrategyContext( 'swipe', multipleFrameScanner );
        break;
      case 'circle':
        scannerContext = new GestureStrategyContext( 'circle', multipleFrameScanner );
        break;
      case 'keyTap':
        scannerContext = new GestureStrategyContext( 'keyTap', simpleFrameScanner );
        break;
      case 'screenTap':
        scannerContext = new GestureStrategyContext( 'screenTap', simpleFrameScanner );
        break;
      default:
        // attach basic strategy instead nothing
        scannerContext = undefined;
        break;
    }
    if (scannerContext){
      this.strategies.push( scannerContext );
    }
  }

  // optional, not used yet
  this.on( 'SimpleRecognizer::found', this.alert );

  console.log("Scanner enabled. Looking for this gestures: ");
  for (var i = 0; i < this.strategies.length; i++){
    console.log( "\t " + this.strategies[i].gestureType + "\n");
  }

}

/**
 * Inherits from EventEmitter
 */

util.inherits( SimpleRecognizer, Emitter );

SimpleRecognizer.prototype.recognize = function( frame, callback ){
  if ( !frame ) return undefined;

  if ( !callback ) return undefined;

  this.callback = callback;

  var gestures = frame.gestures;

  if ( !gestures.length ) return undefined;

  // NOTE: Circle and swipe gestures are updated every frame.
  // Tap gestures only appear in the list for a single frame.

  // Emit custom events according to what gestures detects.
  this.scan( gestures );
}

/**
 * [scan Executes particular scanner strategy on gestures data]
 * @param  {Array} gestures
 * @return {[type]}          [description]
 */
SimpleRecognizer.prototype.scan = function( gestures ){
  for (var i = 0; i < this.strategies.length; i++ ){
    var scannerContext = this.strategies[i];
    scannerContext.scanner.call( null, gestures, scannerContext.gestureType, this.callback );
  }
}

/**
 * [alert emits gesture information]
 * @param  {Object} data Additional gesture data.
  */
SimpleRecognizer.prototype.alert = function( data ){
  this.emit( "found", data );
}

/**
 * [GestureStrategyContext gesture strategy helper]
 * @param {String} gestureType    A valid gesture type
 * @param {Function} gestureScanner   The gesture scanner function
 */
function GestureStrategyContext( gestureType, gestureScanner ){
  this.gestureType = gestureType;
  this.scanner = gestureScanner;
}