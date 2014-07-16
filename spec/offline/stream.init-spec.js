/*
 * This test is offline - no calls is made to Twitter either by oAuth nor by stream
 * (so you can run it as many times as you want)
 */

var TwitterStreamChannels = require('../../main').getMockedClass();
var client = new TwitterStreamChannels({});

describe('client.streamChannels(options) - init (offline)', function() {

  describe('> options checking (exceptions handling)', function() {

    it('should throw exceptions when passing no parameters in options', function() {
      var error = null;
      try {
        var stream = client.streamChannels();
        stream.stop();
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
        var stream = client.streamChannels({});
        stream.stop();
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
        var stream = client.streamChannels({track: 12});
        stream.stop();
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
        var stream = client.streamChannels({track: "whatever"});
        stream.stop();
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
    var channelsKeywordsLowerCasedOuput = {
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
      stream.stop();
      expect(stream.getChannels().default).toBeDefined();
      expect(stream.getChannels().default).toEqual(arrayFiltersOutput);
    });

    it('should take a direct array in track parameter', function() {
      var stream = client.streamChannels({track: arrayFiltersInput});
      stream.stop();
      expect(stream.getChannels().default).toBeDefined();
      expect(stream.getChannels().default).toEqual(arrayFiltersOutput);
    });

    it('should take a channels object in track parameter', function() {
      var stream = client.streamChannels({track: channelsInput});
      stream.stop();
      expect(stream.getChannels()).toBeDefined();
      expect(stream.getChannels()).toEqual(channelsOuput);
    });

    it('should not have duplicates in tracked keywords', function() {
      var stream = client.streamChannels({track: channelsInput});
      stream.stop();
      expect(stream.getTrackedKeywords()).toBeDefined();
      expect(stream.getTrackedKeywords()).toEqual(trackedKeywordsOutput);
    });

    it('should have a regexp version of the channels - working in lower case', function() {
      var stream = client.streamChannels({track: channelsInput});
      stream.stop();
      expect(stream.getChannelsKeywordsLowerCasedRegExp()).toBeDefined();
      expect(stream.getChannelsKeywordsLowerCasedRegExp()['colors'] instanceof RegExp).toBe(true);
      expect('this is blue and also white but not red'.match(stream.getChannelsKeywordsLowerCasedRegExp()['colors'])).toEqual(['blue','white']);
      expect('you may like lemon and orange, in juice ?'.match(stream.getChannelsKeywordsLowerCasedRegExp()['fruits'])).toEqual(['lemon','orange']);
      expect('Some would say that yoda is wiser than Luke'.match(stream.getChannelsKeywordsLowerCasedRegExp()['starWarsCharacters'])).toEqual(['yoda','han']);
    });

  });

});