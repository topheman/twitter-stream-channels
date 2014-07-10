/*
 * This test is offline - no calls is made to Twitter either by oAuth nor by stream
 * (so you can run it as many times as you want)
 */

var TwitterStreamChannels = require('./TwitterStreamChannels.mock');
var client = new TwitterStreamChannels({});

describe('client.streamChannels(options) - init (offline)', function() {

  describe('> options checking (exceptions handling)', function() {

    it('should throw exceptions when passing no parameters in options', function() {
      var error = null;
      try {
        client.streamChannels();
      }
      catch (e) {
        error = e.message;
      }
      finally {
        expect(error).not.toBeNull();
      }
    });

    it('should throw exceptions when track parameter is missing', function() {
      var error = null;
      try {
        client.streamChannels({});
      }
      catch (e) {
        error = e.message;
      }
      finally {
        expect(error).not.toBeNull();
      }
    });

    it('should throw exceptions when track parameter is not an object(or an array) or a string', function() {
      var error = null;
      try {
        client.streamChannels({track: 12});
      }
      catch (e) {
        error = e.message;
      }
      finally {
        expect(error).not.toBeNull();
      }
    });

    it('should NOT throw exceptions when track parameter is a string', function() {
      var error = null;
      try {
        client.streamChannels({track: "whatever"});
      }
      catch (e) {
        error = e.message;
      }
      finally {
        expect(error).toBeNull();
      }
    });

  });

  describe('> options reformating', function() {

    var stringFiltersInput = "blue,white,yellow,green,orange";
    var arrayFiltersInput = ['blue,white', 'yellow', 'green', 'orange'];
    var arrayFiltersOutput = ['blue', 'white', 'yellow', 'green', 'orange'];
    var channelsInput = {
      "colors": stringFiltersInput,
      "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
      "starWarsCharacters": ['Luke', 'Leia,Han', 'Yoda']
    };
    var channelsOuput = {
      "colors": arrayFiltersOutput,
      "fruits": ['kiwi', 'orange', 'apple', 'lemon', 'coconut'],
      "starWarsCharacters": ['Luke', 'Leia', 'Han', 'Yoda']
    };
    var channelsLowerCasedOuput = {
      "colors": arrayFiltersOutput,
      "fruits": ['kiwi', 'orange', 'apple', 'lemon', 'coconut'],
      "starWarsCharacters": ['luke', 'leia', 'han', 'yoda']
    };
    var trackedKeywordsOutput = [
      'blue',
      'white',
      'yellow',
      'green',
      'orange',
      'kiwi',
      'apple',
      'lemon',
      'coconut',
      'Luke',
      'Leia',
      'Han',
      'Yoda'
    ];

    it('should take a direct string in track parameter', function() {
      var stream = client.streamChannels({track: stringFiltersInput});
      expect(stream.getChannels().default).toBeDefined();
      expect(stream.getChannels().default).toEqual(arrayFiltersOutput);
    });

    it('should take a direct array in track parameter', function() {
      var stream = client.streamChannels({track: arrayFiltersInput});
      expect(stream.getChannels().default).toBeDefined();
      expect(stream.getChannels().default).toEqual(arrayFiltersOutput);
    });

    it('should take a channels object in track parameter', function() {
      var stream = client.streamChannels({track: channelsInput});
      expect(stream.getChannels()).toBeDefined();
      expect(stream.getChannels()).toEqual(channelsOuput);
    });

    it('should have a lowercased version of the channels', function() {
      var stream = client.streamChannels({track: channelsInput});
      expect(stream.getChannelsLowerCased()).toBeDefined();
      expect(stream.getChannelsLowerCased()).toEqual(channelsLowerCasedOuput);
    });

    it('should not have duplicates in tracked keywords', function() {
      var stream = client.streamChannels({track: channelsInput});
      expect(stream.getTrackedKeywords()).toBeDefined();
      expect(stream.getTrackedKeywords()).toEqual(trackedKeywordsOutput);
    });

  });

});