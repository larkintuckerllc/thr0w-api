'use strict';
var SERVER = '52.87.61.17';
var INTERVAL = 300;
var CHANNELS = [0];
var LEFT = 12;
var RIGHT = 40;
/*
USES THE RPIO LIBRARY
<https://www.npmjs.com/package/rpio>
TO READ GPIO PIN VALUES
*/
var rpio = require('rpio');
var thr0w = require('thr0w-api');
var lastRight = null;
var lastLeft = null;
/*
SETS THE THR0W SERVER HOSTNAME (AS OPPOSED TO URL);
CHANGE AS REQUIRED
*/
thr0w.setBase(SERVER);
thr0w.login('admin', 'demo', handleLogin);
function handleLogin(error) {
  if (error) {
    process.exit(1);
  }
  rpio.open(LEFT, rpio.INPUT);
  rpio.open(RIGHT, rpio.INPUT);
  setInterval(readInterval, INTERVAL);
  function readInterval() {
    var newLeft = rpio.read(LEFT);
    var newRight = rpio.read(RIGHT);
    if (newLeft !== lastLeft) {
      // SEND MESSAGE ON CHANGES TO LEFT
      thr0w.thr0w(CHANNELS, {pin: LEFT, action: 'value', value: newLeft});
    }
    if (newRight !== lastRight) {
      // SEND MESSAGE ON CHANGES TO RIGHT
      thr0w.thr0w(CHANNELS, {pin: RIGHT, action: 'value', value: newRight});
    }
    lastLeft = newLeft;
    lastRight = newRight;
  }
}
