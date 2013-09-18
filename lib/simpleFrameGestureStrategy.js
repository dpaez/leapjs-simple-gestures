/**
 * Gestures scanner for single frames gestures.
 */

/**
 * Module dependencies
 */

_ = require('underscore');


/**
 * [checkKeyTapStrategy looks for a keyTap gesture on frame.gestures]
 * @param  {[array]} gestures [a leap frame gestures array]
 * @return {[boolean]}        [true if gestures is present, false otherwise]
 */
var checkKeyTapStrategy = function(gestures){
  var type = 'keyTap';

  var gestureFound = _.find(gestures, function(gest){
    return gest.type === type;
  });

  return (typeof gestureFound === 'undefined') ? false : true;
};

var checkScreenTapStrategy = function(gestures){
  var type = 'screenTap';

  var gestureFound = _.find(gestures, function(gest){
    return gest.type === type;
  });

  return (typeof gestureFound === 'undefined') ? false : true;
};

/**
 * [singleFrameGestureStrategy looks for single frames gestures]
 * @param  {[array]} gestures [a leap frame gestures array]
 * @param  {[string]} type     [a gesture type]
 * @param  {[Function]} callback the callback function
 */
module.exports = function( gestures, type, callback ){
  try{
    var gestureFound = _.find(gestures, function( gest ){
      return gest.type === type;
    });
  }catch(TypeError){
    return undefined;
  }


  if ( gestureFound ){
    callback.call( null, gestureFound );
  }else{
    return undefined;
  }
};