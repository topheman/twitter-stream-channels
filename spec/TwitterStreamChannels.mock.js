/*
 * This is a very simple mock of TwitterStreamChannels for offline test purposes
 * To test only the init of the StreamChannels object (before any call to twitter)
 */

var StreamChannels = require('../lib/StreamChannels');

StreamChannels.prototype.start = function(){
  return this;
};

StreamChannels.prototype.stop = function(){
  return this;
};

/*
 * Mock for the twitter api client twit
 * No oAuth request will be made
 */
var TwitMock = function(credentials){
  
};

/*
 * Mocking stream with an empty function so that no call will be made
 */
TwitMock.prototype.stream = function(path, params){
  
};

var TwitterStreamChannelsMock = function(credentials){
  this.apiClient = new TwitMock(credentials);
};

/*
 * Mocks the streamChannels method of TwitterStreamChannels to return a StreamChannels object with the correct options
 */
TwitterStreamChannelsMock.prototype.streamChannels = function(options){
  return new StreamChannels(this.apiClient, options);
};

module.exports = TwitterStreamChannelsMock;