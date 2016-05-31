'use strict';
// jscs:disable
/**
* This module provides the core functionality.
* @module thr0w-api
*/
// jscs:enable
var token;
var channel;
var socket;
var http = require('http');
var querystring = require('querystring');
var io = require('socket.io-client');
var hostname;
// jscs:disable
/**
* This object provides the base functionality.
* @class thr0w
* @static
*/
// jscs:enable
exports = module.exports = {
  authenticated: authenticated,
  connect: connect,
  disconnect: disconnect,
  getChannel: getChannel,
  login: login,
  logout: logout,
  setBase: setBase,
  thr0w: thr0w,
  thr0wChannel: thr0wChannel
};
// jscs:disable
/**
* This function returns if authenticated.
* @method authenticated
* @static
* @return {Boolean} If authenticated.
*/
// jscs:enable
function authenticated() {
  return token !== null;
}
// jscs:disable
/**
* This function is used to connect to a channel.
* @method connect
* @static
* @param chn {Integer} The channel id.
* @param connectCallback {Function} The callback function called when connected.
* ```
* function()
* ```
* @param messageCallback {Function} The callback function called for messages.
* ```
* function(data)
*
* Parameters:
*
* data Object
* The message data.
* ```
*/
// jscs:enable
function connect(chn, connectCallback, messageCallback) {
  var authTimeout;
  if (socket) {
    throw 400;
  }
  if (!authenticated()) {
    throw 400;
  }
  if (chn === undefined || typeof chn !== 'number') {
    throw 400;
  }
  if (connectCallback === undefined ||
    typeof connectCallback !== 'function') {
    throw 400;
  }
  if (messageCallback === undefined ||
    typeof messageCallback !== 'function') {
    throw 400;
  }
  channel = chn;
  authTimeout = setTimeout(fail, 5000);
  socket = io('http://' + hostname + ':3001');
  socket.on('authenticated', success);
  socket.emit('authenticate',
    JSON.stringify({token: token, channel: channel})
  );
  function fail() {
    socket.disconnect();
    connectCallback(500);
  }
  function success() {
    clearTimeout(authTimeout);
    socket.on('message', messageCallback);
    socket.on('duplicate', duplicateCallback);
    connectCallback(null);
    function duplicateCallback() {
      disconnect();
    }
  }
}
// jscs:disable
/**
* This function disconnects the channel.
* @method disconnect
* @static
*/
// jscs:enable
function disconnect() {
  if (!socket) {
    throw 400;
  }
  socket.disconnect();
  socket = null;
  channel = null;
}
// jscs:disable
/**
* This function returns the channel number.
* @method getChannel
* @static
* @return {Integer} The channel number.
*/
// jscs:enable
function getChannel() {
  return channel;
}
// jscs:disable
/**
* This function logs in a user.
* @method login
* @static
* @param username {String} The user's name.
* @param password {String} The user's password.
* @param callback {Function} The function callback.
* ```
* function(error)
*
* Parameters:
*
* error Integer
* The error code; null is success.
* ```
*/
// jscs:enable
function login(username, password, callback) {
  if (username === undefined || typeof username !== 'string') {
    throw 400;
  }
  if (password === undefined || typeof password !== 'string') {
    throw 400;
  }
  if (callback === undefined || typeof callback !== 'function') {
    throw 400;
  }
  var postData = querystring.stringify({
    username: username,
    password: password
  });
  var options = {
    hostname: hostname,
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  var req = http.request(options, handleRequest);
  function handleRequest(res) {
    var body = '';
    var statusCode = res.statusCode;
    if (statusCode === 401) {
      return callback(401);
    }
    if (statusCode !== 200) {
      return callback(500);
    }
    res.setEncoding('utf8');
    res.on('data', handleData);
    res.on('end', handleEnd);
    function handleData(chunk) {
      body += chunk;
    }
    function handleEnd() {
      try {
        token = JSON.parse(body).token;
      } catch (error) {
        return callback(500);
      }
      if (!token) {
        return callback(500);
      }
      callback(null);
    }
  }
  req.on('error', handleError);
  function handleError() {
    return callback(500);
  }
  req.write(postData);
  req.end();
}
// jscs:disable
/**
* This function logs out a user.
* @method logout
* @static
*/
// jscs:enable
function logout() {
  token = null;
}
// jscs:disable
/**
* This function is used to set the hostname for the thr0w service.
* @method setBase
* @static
* @param name {String} The hostname.
*/
// jscs:enable
function setBase(name) {
  hostname = name;
}
// jscs:disable
/**
* This function is used send messages to channels.
* @method thr0w
* @static
* @param channels {Array} Array of Integers; channel ids.
* @param data {Object} The message data.
*/
// jscs:enable
function thr0w(channels, data) {
  var postData = JSON.stringify({channels: channels, message: data});
  var options = {
    hostname: hostname,
    port: 3000,
    path: '/api/thr0w',
    method: 'POST',
    headers: {
      'Authorization': 'bearer ' + token,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  var req = http.request(options, handleRequest);
  function handleRequest() {
  }
  req.write(postData);
  req.end();
}
// jscs:disable
/**
* This function is used to send messages via the channel.
* @method thr0wChannel
* @static
* @param channels {Array} Array of Integers; channel ids.
* @param data {Object} The message data.
*/
// jscs:enable
function thr0wChannel(channels, data) {
  if (!socket) {
    throw 400;
  }
  if (channels === undefined || !Array.isArray(channels)) {
    throw 400;
  }
  if (channels.length === 0) {
    return;
  }
  socket.emit('thr0w', JSON.stringify({channels: channels, message: data}));
}
