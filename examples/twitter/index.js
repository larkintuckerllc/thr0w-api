'use strict';
var SERVER = 'localhost';
var CHANNELS = [0];
var ACCOUNT = 'twitter_account'; // REPLACE WITH TWITTER ACCOUNT TO SHOW
var COUNT = '5'; // REPLaCE WITH THE NUMBER OF TWEETS TO SHOW
// REPLACE WITH TWITTER APPLICATION VALUES
var CONFIG = {
  'consumerKey': 'key',
  'consumerSecret': 'secret',
  'accessToken': 'token',
  'accessTokenSecret': 'secret',
  'callBackUrl': '' // UNUSED
};
var thr0w = require('thr0w-api');
var Twitter = require('twitter-node-client').Twitter;
thr0w.setBase(SERVER);
thr0w.login('admin', 'changeme', handleLogin); // REPLACE WITH USERNAME PASSWORD
function handleLogin(error) {
  if (error) {
    process.exit(1);
  }
  var twitter = new Twitter(CONFIG);
  twitter.getUserTimeline({'screen_name': ACCOUNT,
    count: COUNT}, errorGetUserTimeline, successGetUserTimeline);
  function errorGetUserTimeline() {
    process.exit(1);
  }
  function successGetUserTimeline(data) {
    var tweets = JSON.parse(data);
    thr0w.thr0w(CHANNELS, tweets);
  }
}
