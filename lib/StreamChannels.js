/**
 * @module twitter-stream-channels
 */
var EventEmitter = require('events').EventEmitter,
        util = require('util');

/**
 * The constructor itself of this class is private, you should open a StreamChannels via {{#crossLink "TwitterStreamChannels/streamChannels"}}TwitterStreamChannels.streamChannels(options){{/crossLink}} 
 * 
 * Check out the available events in the [README on the github repo](https://github.com/topheman/twitter-stream-channels#faq).
 * @class StreamChannels
 * @constructor
 * @private
 * @extends events.EventEmitter
 * @param {twit} apiClient
 * @param {Object} options You can use the same filter options as described in the Twitter stream API for `statuses/filter` https://dev.twitter.com/docs/api/1.1/post/statuses/filter
 * @param {Object|Array} options.track Pass an object describing your channels. If you don't want to use channels, you can pass directly an array of keywords.
 * @param {String} [options.follow] A comma separated list of user IDs, indicating the users to return statuses for in the stream
 * @param {String} [options.locations] Specifies a set of bounding boxes to track. More about how to format this parameter here : https://dev.twitter.com/docs/streaming-apis/parameters#locations
 * @param {Boolean} [options.enableChannelsEvents=true] If true, will fire the events like 'channels/channelName'
 * @param {Boolean} [options.enableRootChannelsEvent=true] If true, will fire the event 'channels'
 * @param {Boolean} [options.enableKeywordsEvents=false] If true, will fire the events 'keywords/keywordName' (disabled by default)
 * @returns {StreamChannels}
 */
var StreamChannels = function(apiClient, options) {
  helpers.checkStreamChannelsOptions(options, this);
  options.enableChannelsEvents = typeof options.enableChannelsEvents === 'undefined' ? true : options.enableChannelsEvents;
  options.enableRootChannelsEvent = typeof options.enableRootChannelsEvent === 'undefined' ? true : options.enableRootChannelsEvent;
  options.enableKeywordsEvents = typeof options.enableKeywordsEvents === 'undefined' ? false : options.enableKeywordsEvents;
  helpers.preprocessKeywords(options, this);
  this.currentStream = apiClient.stream('statuses/filter',this._getOptionsToPassToApiClient(options));
  EventEmitter.call(this);
  addEvents(this.currentStream, this);
  this.options = options;
};

util.inherits(StreamChannels, EventEmitter);


var defaultEventsToTransmit = [
  'connect',
  'connected',
  'disconnect',
  'reconnect',
  'warning'
];

/**
 * Adds the events (specifics and propagated from twitter API client), according to options
 * @function addGenericEvents
 * @private
 * @param {twit} twitterStream
 * @param {StreamChannels} streamChannels
 * @param {Object} [options]
 * @param {Boolean} [options.enableChannelsEvents=true] If true, will fire the events like 'channels/channelName'
 * @param {Boolean} [options.enableRootChannelsEvent=true] If true, will fire the event 'channels'
 * @param {Boolean} [options.enableKeywordsEvents=false] If true, will fire the events 'keywords/keywordName' (disabled by default)
 * @returns {streamChannels}
 */
var addEvents = function(twitterStream, streamChannels){
  //transmit events
  for(var i=0; i<defaultEventsToTransmit.length; i++){
    (function(eventName){
      twitterStream.on(eventName,function(msg){
        streamChannels.emit(eventName, msg);
      });
    })(defaultEventsToTransmit[i]);
  }
  twitterStream.on('tweet',function(msg){
    helpers.onTweetEvent(msg, streamChannels);
  });
  return streamChannels;
};

/**
 * Removes the events (specifics and propagated from twitter API client), according to options
 * @function removeEvents
 * @private
 * @param {twit} twitterStream
 * @param {StreamChannels} streamChannels
 * @param {Object} [options]
 * @param {Object} [options.removeAllListeners=false] If true removes all the listeners set on the stream
 * @returns {streamChannels}
 */
var removeEvents = function(twitterStream, streamChannels, options){
  if(options.removeAllListeners === true){
    streamChannels.removeAllListeners();
  }
  return streamChannels;  
};

/**
 * Formats options passed with non-duplicate tracked keywords
 * @method _getOptionsToPassToApiClient
 * @private
 * @param {Object} options
 * @returns {Object}
 */
StreamChannels.prototype._getOptionsToPassToApiClient = function(options){
  var result = {};
  var dontHandle = ['track','enableChannelsEvents','enableRootChannelsEvent','enableKeywordsEvents'];
  if(typeof options !== 'undefined'){
    for(var key in options){
      if(dontHandle.indexOf(key) === -1){
        result[key] = options[key];
      }
    }
  }
  result.track = this.trackedKeywords;
  return result;
};

/**
 * Call this function to restart the stream after you called `.stop()` on it.
 * 
 * Note: there is no need to call `.start()` to begin streaming. ` TwitterStreamChannels.streamChannels` calls .start() for you.
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
  removeEvents(this.currentStream, this, options);
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
 * Returns an object key/value - key:your channels - value:the full text search RegExp for the keywords of this channel
 * @method getchannelsKeywordsLowerCasedRegExp
 * @returns {StreamChannels.channels}
 */
StreamChannels.prototype.getChannelsKeywordsLowerCasedRegExp = function() {
  return this.channelsKeywordsLowerCasedRegExp;
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
    streamChannels.channelsKeywordsLowerCased = {};
    streamChannels.channelsKeywordsLowerCasedRegExpSafe = {};
    streamChannels.channelsKeywordsLowerCasedRegExp = {};

    if (options.track instanceof Array || typeof options.track === 'string') {
      options.track = {
        "default": options.track
      };
    }

    for (var channel in options.track) {
      streamChannels.channels[channel] = keywordsToArray(options.track[channel], []);//process the options.track[channel] to make sure it will be an array of keywords
      streamChannels.channelsKeywordsLowerCased[channel] = streamChannels.channels[channel].map(function(item){
        return item.toLowerCase();
      });
      streamChannels.channelsKeywordsLowerCasedRegExpSafe[channel] = streamChannels.channelsKeywordsLowerCased[channel].map(function(item){
        return regExpEscape(item);//escape the lower cased keywords so they will be regexp proof
      });
      streamChannels.channelsKeywordsLowerCasedRegExp[channel] = streamChannels.channelsKeywordsLowerCased[channel].length > 0 ? new RegExp(streamChannels.channelsKeywordsLowerCasedRegExpSafe[channel].join('|'),'g') : null;//create the full text search regexp on lower cased keywords
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
  },
  /*
   * Tags $channels with an array of lower cased keywords found in it
   * @param {Object} tweet The tweet to postprocess
   * @param {StreamChannels} streamChannels The StreamChannels object we're on, to know which keywords and channels to process
   * @returns {StreamChannels} tweetInfos Containing two arrays : channels and keywords found in the tweet
   */ 
  postprocessTweet: function(tweet,streamChannels){
    tweet.$channels = {};
    tweet.$keywords = [];
    var i,j,k;
    var lowerCasedSearch = [];
    var keywordsFound = [], tmpKeywords;
    
    //prepare the lowerCased strings to full text search in the tweet object
    var tweetText = tweet.truncated ? tweet.extended_tweet.full_text : tweet.text;
    lowerCasedSearch.push(tweetText.toLowerCase());
    if(tweet.user && tweet.user.screen_name){
      lowerCasedSearch.push(tweet.user.screen_name.toLowerCase());
    }
    if(tweet.entities && tweet.entities.urls && tweet.entities.urls.length > 0){
      for(i=0; i<tweet.entities.urls.length; i++){
        if(tweet.entities.urls[i].display_url){
          lowerCasedSearch.push(tweet.entities.urls[i].display_url.toLowerCase());
        }
        if(tweet.entities.urls[i].expanded_url){
          lowerCasedSearch.push(tweet.entities.urls[i].expanded_url.toLowerCase());
        }
      }
    }
    
    //find the keywords
    for(var channel in streamChannels.channelsKeywordsLowerCasedRegExp){
      keywordsFound = [];
      for(j=0; j<lowerCasedSearch.length; j++){
        tmpKeywords = lowerCasedSearch[j].match(streamChannels.channelsKeywordsLowerCasedRegExp[channel]);
        if(tmpKeywords !== null){
          keywordsFound = keywordsFound.concat(tmpKeywords);
        }
      }
      if(keywordsFound.length > 0){
        tweet.$channels[channel] = [];
        for(k=0; k<keywordsFound.length; k++){
          if(tweet.$channels[channel].indexOf(keywordsFound[k]) === -1){
            tweet.$channels[channel].push(keywordsFound[k]);
          }
          if(tweet.$keywords.indexOf(keywordsFound[k]) === -1){
            tweet.$keywords.push(keywordsFound[k]);
          }
        }
      }
    }
    return streamChannels;
  },
  /*
   * Emits the tweet on the right events (according to the options passed by the user)
   * @param {Object} tweet postprocessed tweet
   * @param {type} streamChannels The StreamChannels object we're on, to emit from
   * @returns {StreamChannels} returns the streamChannels object
   */
  emitPosprocessedTweet: function(tweet,streamChannels){
    var channel, keyword;
    if(streamChannels.options.enableRootChannelsEvent === true){
      streamChannels.emit('channels', tweet);
    }
    if(streamChannels.options.enableChannelsEvents === true){
      for(channel in tweet.$channels){
        streamChannels.emit('channels/'+channel, tweet);
      }
    }
    if(streamChannels.options.enableKeywordsEvents === true){
      for(channel in tweet.$channels){
        if(tweet.$channels[channel].length > 0){
          for(var i=0; i<tweet.$channels[channel].length; i++){
            streamChannels.emit('keywords/'+tweet.$channels[channel][i], tweet);
          }
        }
      }
    }
    return streamChannels;
  },
  /*
   * To execute when a tweet is received :
   * - to posprocess the tweet
   * - then emit the postprocessed tweet on the proper events
   * @param {Object} tweet
   * @param {StreamChannels} streamChannels
   * @returns {StreamChannels}
   */
  onTweetEvent: function(tweet, streamChannels){
    helpers.postprocessTweet(tweet, streamChannels);
    return helpers.emitPosprocessedTweet(tweet, streamChannels);
  }
};

/**
 * From http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1015
 * Escapes characters in the string that are not safe to use in a RegExp.
 * @param {*} s The string to escape. If not a string, it will be casted
 *     to one.
 * @return {string} A RegExp safe, escaped copy of {@code s}.
 */
var regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
};