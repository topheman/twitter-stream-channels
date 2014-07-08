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
  helpers.checkStreamChannelsOptions(options);
  helpers.checkStreamChannelsOptions(options, this);
  helpers.preprocessKeywords(options, this);
  this.currentStream = apiClient.stream('statuses/filter',options);
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
StreamChannels.prototype.start = function() {
  this.currentStream.start();
  return this;
};

/**
 * Closes the opened stream with Twitter
 * @method stop
 * @param {Object} [options]
 * @param {Object} [options.removeAllListeners=false] If true removes all the listeners set on the stream
 * @returns {StreamChannels}
 */
StreamChannels.prototype.stop = function(options) {
  options = typeof options === 'undefined' ? {} : options;
  options.removeAllListeners = typeof options.removeAllListeners === 'undefined' ? false : options.removeAllListeners;
  this.currentStream.stop();
  return this;
};

/**
 * Returns your channel description
 * @method getChannels
 * @returns {StreamChannels.channels}
 */
StreamChannels.prototype.getChannels = function() {
  return this.channels;
};

/**
 * Returns an array of the keywords you're tracking (duplicates were removed)
 * @method getTrackedKeywords
 * @returns {Array}
 */
StreamChannels.prototype.getTrackedKeywords = function() {
  return this.trackedKeywords;
};

/**
 * Returns your channel description with keywords lowercased (to ease matching with non case sensitive)
 * @method getChannelsLowerCased
 * @returns {StreamChannels.channels}
 */
StreamChannels.prototype.getChannelsLowerCased = function() {
  return this.channelsLowerCased;
};

/**
 * Removes all the listeners added
 * 
 * See more methods http://nodejs.org/api/events.html#events_events
 * @method removeAllListeners
 * @param {String} event
 * @returns {StreamChannels}
 */

module.exports = StreamChannels;

/*
 * This class is private to the StreamChannels class, it's not exposed
 * @private
 * @class StreamChannels.helpers
 */
var helpers = {
  /*
   * Checks the options parameter for consistency and mandatory parameters
   * @method checkStreamChannelsOptions
   * @private
   * @throws {Error}
   * @param {Object} options
   * @returns {undefined}
   */
  checkStreamChannelsOptions: function(options) {
    if (typeof options === 'undefined') {
      throw new Error('new StreamChannels(options) - options parameter missing');
    }
    else if (typeof options.track === 'undefined') {
      throw new Error('new StreamChannels(options) - options.track parameter missing');
    }
    else if (!(typeof options.track === 'object' || typeof options.track === 'string')) {
      throw new Error('new StreamChannels(options) - options.track must be an Object (representing your channels with there keywords), an Array (of keywords) or a String (with comma separeted keywords)');
    }
  },
  /*
   * Prepares the channels and keywords to be processed later
   * @method preprocessKeywords
   * @private
   * @param {type} options
   * @param {type} streamChannels
   * @returns {StreamChannels}
   */
  preprocessKeywords: function(options, streamChannels) {
    streamChannels.trackedKeywords = [];
    streamChannels.channels = {};
    streamChannels.channelsLowerCased = {};

    if (options.track instanceof Array || typeof options.track === 'string') {
      options.track = {
        "default": options.track
      };
    }

    for (var channel in options.track) {
      streamChannels.channels[channel] = keywordsToArray(options.track[channel], []);
      streamChannels.channelsLowerCased[channel] = streamChannels.channels[channel].map(function(item){
        return item.toLowerCase();
      });
      streamChannels.channels[channel].forEach(function(item){
        if(streamChannels.trackedKeywords.indexOf(item) === -1){
          streamChannels.trackedKeywords.push(item);
        }
      });
    }

    /*
     * Prepares keywords to an array of keywords like 'foo,bar' -> ['foo','bar'] also ['foo,bar','toto'] -> ['foo','bar','toto'] also 'foo,bar,toto' -> ['foo','bar','toto']
     * @param {Array|String} keywords
     * @returns {Array}
     */
    function keywordsToArray(keywords, result) {
      if (typeof keywords === 'string') {
        result = result.concat(keywords.split(','));
      }
      else if (keywords instanceof Array) {
        if (keywords.length > 0) {
          for (var i = 0; i < keywords.length; i++) {
            result = keywordsToArray(keywords[i], result);
          }
        }
      }
      return result;
    }

    return streamChannels;
  }
};