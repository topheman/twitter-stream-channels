/**
 * @module twitter-stream-channels
 */

var twit = require('twit');
var StreamChannels = require('./lib/StreamChannels');

/**
 * Manage filters on multiple channels on the same Twitter Stream
 * ```js
var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('my.twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var channels = {
    "languages" : ['javascript','php','java','python','perl'],
    "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    "web" : ['javascript','nodejs','html5','css','angularjs']
};

var stream = client.streamChannels(channels);

stream.on('channels/languages',function(tweet){
    console.log(tweet);//any tweet with 'javascript','php','java','python','perl'
});

stream.on('channels/js-frameworks',function(tweet){
    console.log(tweet);//any tweet with 'angularjs','jquery','backbone','emberjs'
});

stream.on('channels/web',function(tweet){
    console.log(tweet);//any tweet with 'javascript','nodejs','html5','css','angularjs'
});

stream.on('channels',function(tweet){
    console.log(tweet);//any tweet with any of the keywords above
});

//whatever needs to close stream some time
setTimeout(function(){
    stream.close();//closes the stream connected to Twitter 
},100000);
```
 * @class TwitterStreamChannels
 * @constructor
 * @param {type} credentials
 * @returns {TwitterStreamChannels}
 */
var TwitterStreamChannels = function(credentials) {
  this.apiClient = new twit(credentials);
};

/**
 * Returns a Twitter API client on which you can do pretty much what you want.
 * More here https://github.com/ttezel/twit
 * @method getApiClient
 * @returns {twit}
 */
TwitterStreamChannels.prototype.getApiClient = function() {
  return this.apiClient;
};

/**
 * Opens a Twitter Stream and returns you an other one on which you'll be able to attach events for each channels
 * @method streamChannels
 * @param {Object} channels
 * @param {Object} [options]
 * @param {Object} [options.disableChannelsSubEmitters=false] If true, will not fire the events like 'channels/channelName'
 * @param {Object} [options.disableChannelsEmitter=false] If true, will not fire the event 'channels'
 * @returns {StreamChannels}
 */
TwitterStreamChannels.prototype.streamChannels = function(channels) {
  return new StreamChannels(this.apiClient, channels);
};

module.exports = TwitterStreamChannels;