/**
 * @module twitter-stream-channels
 */

var twit = require('twit');
var StreamChannels = require('./StreamChannels');

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

var stream = client.streamChannels({track:channels});

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
 * @param {Object} credentials
 * @param {String} credentials.consumer_key
 * @param {String} credentials.consumer_secret
 * @param {String} credentials.access_token
 * @param {String} credentials.access_token_secret
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
 * @param {Object} options You can use the same filter options as described in the Twitter stream API for `statuses/filter` https://dev.twitter.com/docs/api/1.1/post/statuses/filter
 * @param {Object|Array} options.track Pass an object describing your channels. If you don't want to use channels, you can pass directly an array of keywords.
 * @param {String} [options.follow] A comma separated list of user IDs, indicating the users to return statuses for in the stream
 * @param {String} [options.locations] Specifies a set of bounding boxes to track. More about how to format this parameter here : https://dev.twitter.com/docs/streaming-apis/parameters#locations
 * @param {Object} [options.enableChannelsEvents=true] If true, will fire the events like 'channels/channelName'
 * @param {Object} [options.enableRootChannelsEvent=true] If true, will fire the event 'channels'
 * @param {Object} [options.enableKeywordsEvents=false] If true, will fire the events 'keywords/keywordName' (disabled by default)
 * @returns {StreamChannels}
 */
TwitterStreamChannels.prototype.streamChannels = function(options) {
  return new StreamChannels(this.apiClient, options);
};

module.exports = TwitterStreamChannels;