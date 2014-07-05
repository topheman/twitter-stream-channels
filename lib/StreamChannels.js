/**
 * @module twitter-stream-channels
 */

/**
 * @class StreamChannels
 * @constructor
 * @private
 * @param {twit} apiClient
 * @param {Object} channels
 * @param {Object} [options]
 * @param {Object} [options.disableSubEmitters=false] If true, will disable the events like 'channels/channelName' (if you only want to rely on the global feed and $keywords and $channel this would be better for you)
 * @returns {StreamChannels}
 */
var StreamChannels = function(apiClient, channels, options) {
  this.apiClient = apiClient;
};

/**
 * Closes the opened stream with Twitter
 * @method stop
 * @param {Object} [options]
 * @param {Object} [options.disableChannelsSubEmitters=false] If true, will not fire the events like 'channels/channelName'
 * @param {Object} [options.disableChannelsEmitter=false] If true, will not fire the event 'channels'
 * @returns {undefined}
 */
StreamChannels.prototype.stop = function(options){
  
};

module.exports = StreamChannels;