/*
 * This is a very simple mock of TwitterStreamChannels for offline test purposes
 * To test only the init of the StreamChannels object (before any call to twitter)
 */

//in unitTest, we pass a flag --config highSpeed true and then the events will be emitted only each 1ms
var timerMultiplier = process.env.highSpeed ? 1 : 100;

var StreamChannels = require('../lib/StreamChannels');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter,
        util = require('util');

/*
 * Mock for the twitter api client twit
 * No oAuth request will be made
 * @param {Object} [credentials] @optional (since it's a mock, no credentials needed
 * @param {Array} [credentials.tweets] @optional (by default will load /mocks/data/tweets.json)
 * @param {Boolean} [credentials.continuous] @optional if true will loop on the tweets mock array until you call stop (good to when developping such things as websockets without calling twitter)
 */
var TwitMock = function(credentials){
  //this is internal to the mock to give option to the dev to change the tweet mocks
  credentials = typeof credentials === 'undefined' ? {} : credentials;
  credentials.tweets = typeof credentials.tweets === 'undefined' ? require('./data/tweets.json') : credentials.tweets;
  credentials.continuous = typeof credentials.continuous === 'undefined' ? false : credentials.continuous;
  this._tweetsMock = credentials.tweets;
  this._continuous = credentials.continuous;
};

/*
 * Mocking .stream with an empty function so that no call will be made
 */
TwitMock.prototype.stream = function(path, params){
  return (new TwitStreamMock({tweets:this._tweetsMock, continuous: this._continuous})).start();
};

/*
 * Mock for the OAuth / stream part (no need to mock all the underlying methods, only the events part)
 * Emits :
 * - connect
 * - connected
 * - tweet : will read the inputTweetsMocks file and emit the tweet found inside
 */
var TwitStreamMock = function(options){
  
  options = typeof options === 'undefined' ? {} : options;
  options.tweets = typeof options.tweets === 'undefined' ? require('./data/tweets.json') : options.tweets;
  options.continuous = typeof options.continuous === 'undefined' ? false : options.continuous;
  
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
      setTimeout(function(){
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
            //in continuous restart from 0
            if(options.continuous === true){
              that.currentTweetIndex = 0;
            }
            else{
              that._twitterDisconnect();
              return false;//dont recall the callback for the next tick
            }
          }
          emitTweetCb.call(that);
        }
      },1*timerMultiplier);
    };
    
    setTimeout(function(){
      that.emit('connect');
    },0);
    setTimeout(function(){
      that.emit('connected');
    },1*timerMultiplier);
    setTimeout(function(){
      emitTweetCb.call(that);
    },2*timerMultiplier);
    
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

var TwitterStreamChannelsMock = function(credentials){
  this.apiClient = new TwitMock(credentials);
};

//this client returned is limited
TwitterStreamChannelsMock.prototype.getApiClient = function(){
  return this.apiClient;
};

/*
 * Mocks the streamChannels method of TwitterStreamChannels to return a StreamChannels object with the correct options
 */
TwitterStreamChannelsMock.prototype.streamChannels = function(options){
  return new StreamChannels(this.apiClient, options);
};

module.exports = TwitterStreamChannelsMock;