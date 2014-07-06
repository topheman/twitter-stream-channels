/**
 * @module twitter-stream-channels
 */
var EventEmitter = require('events').EventEmitter,
    util = require('util');

/**
 * @class StreamChannels
 * @constructor
 * @private
 * @extends events.EventEmitter
 * @param {twit} apiClient
 * @param {Object} options You can use the same filter options as described in the Twitter stream API for `statuses/filter` https://dev.twitter.com/docs/api/1.1/post/statuses/filter
 * @param {Object|Array} options.track Pass an object describing your channels. If you don't want to use channels, you can pass directly an array of keywords.
 * @param {String} [options.follow] A comma separated list of user IDs, indicating the users to return statuses for in the stream
 * @param {String} [options.locations] Specifies a set of bounding boxes to track. More about how to format this parameter here : https://dev.twitter.com/docs/streaming-apis/parameters#locations
 * @param {Object} [options.disableChannelsSubEmitters=false] If true, will not fire the events like 'channels/channelName'
 * @param {Object} [options.disableChannelsEmitter=false] If true, will not fire the event 'channels'
 * @returns {StreamChannels}
 */
var StreamChannels = function(apiClient, options) {
  this.apiClient = apiClient;
  EventEmitter.call(this);
};

util.inherits(StreamChannels, EventEmitter);

/**
 * Call this function to restart the stream after you called `.stop()` on it.
 * 
 * Note: there is no need to call `.start()` to begin streaming. ` TwitterStreamChannels.stream` calls .start() for you.
 * @method start
 * @returns {StreamChannels}
 */
StreamChannels.prototype.start = function(){
  
  return this;
};

/**
 * Closes the opened stream with Twitter
 * @method stop
 * @param {Object} [options]
 * @param {Object} [options.removeAllListeners=false] If true removes all the listeners set on the stream
 * @returns {StreamChannels}
 */
StreamChannels.prototype.stop = function(options){
  
  return this;
};

module.exports = StreamChannels;

/**
 * Removes all the listeners added
 * 
 * See more methods http://nodejs.org/api/events.html#events_events
 * @method removeAllListeners
 * @param {String} event
 * @returns {StreamChannels}
 */