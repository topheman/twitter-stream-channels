/**
 * With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.
 * 
 * This module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.
 * 
 * twitter-stream-channels handles all the post-processing, the connexion layer (OAuth, etc ...) is handled by [twit](https://github.com/ttezel/twit). See the [FAQ](https://github.com/topheman/twitter-stream-channels#faq) about both topics.
 * @module twitter-stream-channels
 * @main twitter-stream-channels
 */

var twit = require('twit');
var StreamChannels = require('./StreamChannels');

/**
 * **This is your main point of entry to the whole module**.
 * 
 * Manage filters on multiple channels on the same Twitter Stream
 * ```js
var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./my.twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var channels = {
	"languages" : ['javascript','php','java','python','perl'],
	"js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
	"web" : ['javascript','nodejs','html5','css','angularjs']
};

var stream = client.streamChannels({track:channels});

stream.on('channels/languages',function(tweet){
    console.log('>languages',tweet.text);//any tweet with 'javascript','php','java','python','perl'
});

stream.on('channels/js-frameworks',function(tweet){
    console.log('>frameworks',tweet.text);//any tweet with 'angularjs','jquery','backbone','emberjs'
});

stream.on('channels/web',function(tweet){
    console.log('>web',tweet.text);//any tweet with 'javascript','nodejs','html5','css','angularjs'
});

//If you want, you can listen on all the channels and pickup the $channels added by the module
//It contains the channel and the keywords picked up in the tweet
//stream.on('channels',function(tweet){
//    console.log(tweet.$channels,tweet.text);//any tweet with any of the keywords above
//});

//If you're really picky, you can listen to only some keywords
//stream.on('keywords/javascript',function(tweet){
//    console.log(tweet.text);//any tweet with the keyword "javascript"
//});

setTimeout(function(){
    stream.close();//closes the stream connected to Twitter
	console.log('>stream closed after 100 seconds');
},100000);
```
 * @class TwitterStreamChannels
 * @constructor
 * @param {Object} credentials
 * @param {String} credentials.consumer_key
 * @param {String} credentials.consumer_secret
 * @param {String} credentials.access_token
 * @param {String} credentials.access_token_secret
 * @return {TwitterStreamChannels}
 */
var TwitterStreamChannels = function(credentials) {
  this.apiClient = new twit(credentials);
};

/**
 * Returns a mocked object of TwitterStreamChannels on which you will be able to play your scenarios offline with your own mocked tweets
 * @method getMockedClass
 * @static
 * @return {TwitterStreamChannelsMock}
 */
TwitterStreamChannels.getMockedClass = function(){
  return require('../mocks/TwitterStreamChannels');
};

/**
 * This will allow you to create your own json data mocks
 * 
 * Keep in mind this class is not designed to retrieve lots of tweets on long duration.
 * 
 * It was only designed to ease the creation of your data mocks to use after with `TwitterStreamChannels.getMockedClass()`
 * 
 * More infos in the [README on the github repo](https://github.com/topheman/twitter-stream-channels#api)
 * @method launchMockDataRetriever
 * @static
 * @param {Object} credentials
 * @param {String} credentials.consumer_key
 * @param {String} credentials.consumer_secret
 * @param {String} credentials.access_token
 * @param {String} credentials.access_token_secret
 * @param {Object} options
 * @param {Array} options.track array of keywords to track
 * @param {String} options.output filepath of the json file where to put the retrieved tweets
 * @param {String} [options.maxNumber=200] maximum number of tweets that will be retrieved (default 200 / max 500)
 * @param {String} [options.timeout=100000] maximum delay after the stream will close whatever number of tweets are captured (default 100 000ms)
 * @return {MockDataRetriever}
 */
TwitterStreamChannels.launchMockDataRetriever = function(credentials,options){
  return new require('./MockDataRetriever')(credentials,options);
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
 * @param {Boolean} [options.enableChannelsEvents=true] If true, will fire the events like 'channels/channelName'
 * @param {Boolean} [options.enableRootChannelsEvent=true] If true, will fire the event 'channels'
 * @param {Boolean} [options.enableKeywordsEvents=false] If true, will fire the events 'keywords/keywordName' (disabled by default)
 * @return {StreamChannels}
 */
TwitterStreamChannels.prototype.streamChannels = function(options) {
  return new StreamChannels(this.apiClient, options);
};

module.exports = TwitterStreamChannels;