/**
 * @module twitter-stream-channels
 */

/*
 * This is a very simple mock of TwitterStreamChannels for offline test purposes
 * To test only the init of the StreamChannels object (before any call to twitter)
 */

//in unitTest, we pass a flag --config highSpeed true and then the events will be emitted really faster (not using setTimeout but process.nextTick)
var highSpeed = process.env.highSpeed ? true : false;

var StreamChannels = require('../lib/StreamChannels');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter,
        util = require('util');

//optimization for the unit-tests
var nextLoop = (function(){
  if(highSpeed === true){
    return process.nextTick;
  }
  else{
    return setTimeout;
  }
})();

/*
 * Mock for the twitter api client twit
 * No oAuth request will be made
 * @param {Object} [credentials] @optional (since it's a mock, no credentials needed
 * @param {Array} [credentials.tweets] @optional (by default will load `/mocks/data/tweets.json`)
 * @param {Boolean} [credentials.singleRun=true] @optional if false will loop on the tweets mock array until you call stop (default true)
 * @param {Number} [credentials.tweetDelay=100] @optional delay between each tweets emitted in ms (default 100ms)
 */
var TwitMock = function(credentials){
  //this is internal to the mock to give option to the dev to change the tweet mocks
  credentials = typeof credentials === 'undefined' ? {} : credentials;
  credentials.tweets = typeof credentials.tweets === 'undefined' ? require('./data/tweets.json') : credentials.tweets;
  credentials.singleRun = typeof credentials.singleRun === 'undefined' ? true : credentials.singleRun;
  credentials.tweetDelay = typeof credentials.tweetDelay === 'undefined' ? 100 : credentials.tweetDelay;
  this._tweetsMock = credentials.tweets;
  this._singleRun = credentials.singleRun;
  this._tweetDelay = credentials.tweetDelay;
};

/*
 * Mocking .stream with an empty function so that no call will be made
 */
TwitMock.prototype.stream = function(path, params){
  return (new TwitStreamMock({
    tweets:this._tweetsMock,
    singleRun: this._singleRun,
    tweetDelay: this._tweetDelay
  })).start();
};

/*
 * Mock for the OAuth / stream part (no need to mock all the underlying methods, only the events part)
 * Emits :
 * - connect
 * - connected
 * - tweet : will read the inputTweetsMocks file and emit the tweet found inside
 * @param {Object} [options] @optional (since it's a mock, no credentials needed
 * @param {File} [options.tweets] @optional (by default will load `/mocks/data/tweets.json`)
 * @param {Boolean} [options.singleRun=true] @optional if false will loop on the tweets mock array until you call stop (default true)
 * @param {Number} [options.tweetDelay=100] @optional delay between each tweets emitted in ms (default 100ms)
 */
var TwitStreamMock = function(options){
  
  options = typeof options === 'undefined' ? {} : options;
  options.tweets = typeof options.tweets === 'undefined' ? require('./data/tweets.json') : options.tweets;
  options.singleRun = typeof options.singleRun === 'undefined' ? true : options.singleRun;
  options.tweetDelay = typeof options.tweetDelay === 'undefined' ? 100 : options.tweetDelay;
  
  this.currentTweetIndex = 0;

  EventEmitter.call(this);
  
  //following method are directly attached (on the prototype, they would be erased by EventEmitter's prototype)
  this.start = function(){
    
    //don't do anything if already connected
    if(this.abortedBy === null){
      return this;
    }
    
    var that = this;
    this.abortedBy = null;
  
    var emitTweetCb = function(){
      var that = this;
      nextLoop(function(){
        //only send tweet if the stream hasn't been stopped
        if(that.abortedBy === null){
          //emit the tweet
          if(options.tweets[that.currentTweetIndex]){
            options.tweets[that.currentTweetIndex].$index = that.currentTweetIndex;
            that.emit('tweet',options.tweets[that.currentTweetIndex]);
            that.currentTweetIndex++;
          }
          //case we are at the end of the tweets
          if(that.currentTweetIndex >= options.tweets.length){
            //in singleRun restart from 0
            if(options.singleRun === false){
              that.currentTweetIndex = 0;
            }
            else{
              that._twitterDisconnect();
              return false;//dont recall the callback for the next tick
            }
          }
          emitTweetCb.call(that);
        }
      },1*options.tweetDelay);
    };
    
    nextLoop(function(){
      that.emit('connect');
    },0);
    nextLoop(function(){
      that.emit('connected');
    },1*options.tweetDelay);
    nextLoop(function(){
      emitTweetCb.call(that);
    },2*options.tweetDelay);
    
    return this;
  };
  
  this.stop = function(){
    this.abortedBy = 'twit-client';
    return this;
  };
  
  this._twitterDisconnect = function(){
    this.abortedBy = 'twitter';
    this.emit('disconnect');
    return this;
  };
  
};

util.inherits(TwitStreamMock, EventEmitter);

/**
 * This class mocks {{#crossLink "TwitterStreamChannels"}}TwitterStreamChannels{{/crossLink}} so that you could work offline, on your own data, without connecting to Twitter.
 * 
 * See the examples on [the github repo](https://github.com/topheman/twitter-stream-channels/tree/master/examples)
 * @class TwitterStreamChannelsMock
 * @constructor
 * @param {Object} [options] @optional (since it's a mock, no credentials needed
 * @param {File} [options.tweets] @optional (by default will load `/mocks/data/tweets.json`)
 * @param {Boolean} [options.singleRun=true] @optional if false will loop on the tweets mock array until you call stop (default true)
 * @param {Number} [options.tweetDelay=100] @optional delay between each tweets emitted in ms (default 100ms)
 * @returns {TwitterStreamChannelsMock}
 */
var TwitterStreamChannelsMock = function(credentials){
  this.apiClient = new TwitMock(credentials);
};

/**
 * Returns a mocked version of apiClient, only the .stream() method is mocked (will stream exactly the same tweets as {{#crossLink "TwitterStreamChannelsMock/streamChannels"}}stream.streamChannels(){{/crossLink}})
 * @method getApiClient
 * @returns {TwitMock}
 */
TwitterStreamChannelsMock.prototype.getApiClient = function(){
  return this.apiClient;
};

/**
 * Mocks the {{#crossLink "TwitterStreamChannels/streamChannels"}}TwitterStreamChannels.streamChannels(options){{/crossLink}} method of TwitterStreamChannels to return a StreamChannels object
 * 
 * Will start to emit the tweets you specified in the tweets attributes in the constructor.
 * @method streamChannels
 * @param {Object} options
 * @param {Object|Array} options.track Pass an object describing your channels. If you don't want to use channels, you can pass directly an array of keywords.
 * @param {Boolean} [options.enableChannelsEvents=true] If true, will fire the events like 'channels/channelName'
 * @param {Boolean} [options.enableRootChannelsEvent=true] If true, will fire the event 'channels'
 * @param {Boolean} [options.enableKeywordsEvents=false] If true, will fire the events 'keywords/keywordName' (disabled by default)
 * @return {StreamChannels}
 */
TwitterStreamChannelsMock.prototype.streamChannels = function(options){
  return new StreamChannels(this.apiClient, options);
};

module.exports = TwitterStreamChannelsMock;