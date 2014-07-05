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
 * @param {Object} channels
 * @param {Object} [options]
 * @param {Object} [options.disableSubEmitters=false] If true, will disable the events like 'channels/channelName' (if you only want to rely on the global feed and $keywords and $channel this would be better for you)
 * @returns {StreamChannels}
 */
var StreamChannels = function(apiClient, channels, options) {
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