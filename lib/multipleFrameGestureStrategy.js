/**
 * Gestures scanner for multiple frames gestures.
 */


/**
 * Module dependencies
 */

_ = require('underscore');

var lastID = null,
  lastStateIDX = null;

// Note: check for 'weakMap' use here.
var STATES = [ 'start', 'update', 'stop' ];

/**
 * [multipleFrameGestureStrategy scan for 'type' on multiple gestures data]
 * @param  {Array} gestures
 * @param  {String} type
 * @param  {Function} the callback function
 */
module.exports = function( gestures, type, callback ){
  try{
    var gestureFound = _.find( gestures, function( gest ){
      return ( gest.type === type && gest.state === 'stop' )
    });
  }catch(TypeError){
    return undefined;
  }

  if ( gestureFound ){
    callback.call( null, gestureFound );
  }

  // FIXME: maintain state through time is not working this way
  // if ( nextState( gestureFound ) ){
  //   console.log("GESTURE FOUND: ", gestureFound);
  //   console.log("callback is: ", callback);
  //   callback.call( null, gestureFound );
  // }
};


/**
 * [nextState simple state handler]
 * @param  {Array} gestureData
 * API Private
 */
function nextState( gestureData ){
  if ( typeof gestureData === 'undefined' ) return undefined;

  if ( !(lastID === null) && !(lastID === gestureData.id) ) return undefined;

  if ( ( lastStateIDX === null ) && ( gestureData.state === STATES[0] ) ){
    // on initial state...
    lastID = gestureData.id;
    lastStateIDX = 0;
  }

  if ( ( gestureData.state === STATES[1] ) && ( lastStateIDX === 0 ) ){
    // intermediate state
    lastStateIDX++;
  }

  if ( ( gestureData.state === STATES[2] ) && ( lastStateIDX === 1 ) ){
    // final state
    lastStateIDX = null;
    lastID = null;
    return gestureData;
  }

  return undefined;
};
