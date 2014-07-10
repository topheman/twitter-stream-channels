/*
 * This is a very simple mock of TwitterStreamChannels for offline test purposes
 * To test only the init of the StreamChannels object (before any call to twitter)
 */

//in unitTest, we pass a flag --config highSpeed true and then the events will be emitted only each 1ms
var timerMultiplier = process.env.highSpeed ? 1 : 100;

var StreamChannels = require('../../lib/StreamChannels');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter,
        util = require('util');

//those are the tweets that will be emitted
var inputTweetsMocks = require('./tweets.mock.json');

/*
 * Mock for the twitter api client twit
 * No oAuth request will be made
 */
var TwitMock = function(credentials){
  
};

/*
 * Mocking .stream with an empty function so that no call will be made
 */
TwitMock.prototype.stream = function(path, params){
  return new TwitStreamMock();
};

/*
 * Mock for the OAuth / stream part (no need to mock all the underlying methods, only the events part)
 * Emits :
 * - connect
 * - connected
 * - tweet : will read the inputTweetsMocks file and emit the tweet found inside
 */
var TwitStreamMock = function(){
  EventEmitter.call(this);
  var that = this;
  setTimeout(function(){
    that.emit('connect');
  },0);
  setTimeout(function(){
    that.emit('connected');
  },1*timerMultiplier);
  setTimeout(function(){
    if(inputTweetsMocks.length > 0){
      for(var i=0; i<inputTweetsMocks.length; i++){
        (function(tweet,i){
          setTimeout(function(){
            that.emit('tweet',tweet);
          },i*timerMultiplier);
        })(inputTweetsMocks[i],i);
      }
    }
  },2*timerMultiplier);
  
  //following method are directly attached (on the prototype, they would be erased by EventEmitter's prototype)
  this.start = function(){
    return this;
  };
  
  this.stop = function(){
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