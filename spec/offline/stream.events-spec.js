/* 
/*
 * This test is offline - no calls is made to Twitter either by oAuth nor by stream
 * (so you can run it as many times as you want)
 */

var TwitterStreamChannels = require('../../main').getMockedClass();
var client = new TwitterStreamChannels({});
var channelsInput = {
  "colors": ['blue', 'white', 'yellow', 'green', 'orange'],
  "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
  "starWarsCharacters": ['Luke', 'Leia', 'Han', 'Yoda']
};

describe('client.streamChannels(options) - events (offline)',function(){
  
  //specific matchers
  beforeEach(function() {
    var matchers = {
      toBeGreaterThanOrEqualTo: function(a) {
        return this.actual >= a;
      }
    };
    this.addMatchers(matchers);
  });

  describe("> .on('channels')",function(){
    
    var trappedTweets;
    var stream;
  
    beforeEach(function(){
      
      runs(function(){
        trappedTweets = [];
        stream = client.streamChannels({track: channelsInput});

        stream.on('channels',function(tweet){
          trappedTweets.push(tweet);
        });
      });

      waitsFor(function(){
        if(trappedTweets.length >= 10){
          stream.stop();
          return true;
        }
      },"should have trapped 10 tweets",10000);
      
    });
    
    it('should have trapped at least 10 tweets via the callback on the event',function(){
      expect(trappedTweets.length).toBeGreaterThanOrEqualTo(10);
    });
    
    it('should have trapped tweets with $channels',function(){
      expect(trappedTweets[0].$channels).toBeDefined();
      expect(trappedTweets[9].$channels).toBeDefined();
    });
    
    it('$channels should have correct keywords in it',function(){
      expect(trappedTweets[0].$channels['colors']).toEqual(['green']);
      expect(trappedTweets[9].$channels['fruits']).toEqual(['apple']);
    });
    
    it('should have trapped tweets with $keywords',function(){
      expect(trappedTweets[0].$keywords).toBeDefined();
      expect(trappedTweets[9].$keywords).toBeDefined();
    });
    
    it('$keywords should have correct keywords in it',function(){
      expect(trappedTweets[0].$keywords).toEqual(['green']);
      expect(trappedTweets[9].$keywords).toEqual(['apple']);
    });
    
  });

  describe("> .on('channels/fruits')",function(){
    
    var trappedTweets;
    var stream;
  
    beforeEach(function(){
      
      runs(function(){
        //no need to reinstantiate the stream for each "it", only the first (they all use the same tests results)
        trappedTweets = [];
        stream = client.streamChannels({track: channelsInput});

        stream.on('channels/fruits',function(tweet){
          trappedTweets.push(tweet);
        });
      });

      waitsFor(function(){
        if(trappedTweets.length >= 10){
          stream.stop();
          return true;
        }
      },"should have trapped 10 tweets",10000);
      
    });
    
    it('should have trapped at least 10 tweets via the callback on the event',function(){
      expect(trappedTweets.length).toBeGreaterThanOrEqualTo(10);
    });
    
    it('should have trapped tweets with $channels',function(){
      expect(trappedTweets[0].$channels).toBeDefined();
      expect(trappedTweets[9].$channels).toBeDefined();
    });
    
    it('$channels should have correct keywords in it',function(){
      expect(trappedTweets[0].$channels['fruits']).toEqual(['apple']);
      expect(trappedTweets[9].$channels['fruits']).toEqual(['apple']);
    });
    
  });

  describe("> .on('keywords/orange')",function(){
    
    var trappedTweets;
    var stream;
  
    beforeEach(function(){
      
      runs(function(){
        trappedTweets = [];
        stream = client.streamChannels({
          track: channelsInput,
          enableChannelsEvents:false,
          enableRootChannelsEvent:false,
          enableKeywordsEvents:true
        });

        stream.on('keywords/orange',function(tweet){
          trappedTweets.push(tweet);
        });
      });

      waitsFor(function(){
        if(trappedTweets.length >= 10){
          stream.stop();
          return true;
        }
      },"should have trapped 10 tweets",10000);
      
    });
    
    it('should have trapped at least 10 tweets via the callback on the event',function(){
      expect(trappedTweets.length).toBeGreaterThanOrEqualTo(10);
    });
    
    it('should have trapped tweets with $channels',function(){
      expect(trappedTweets[0].$channels).toBeDefined();
      expect(trappedTweets[9].$channels).toBeDefined();
    });
    
    it('$channels should have correct keywords in it',function(){
      expect(trappedTweets[0].$channels['colors']).toEqual(['orange']);
      expect(trappedTweets[9].$channels['colors']).toEqual(['orange']);
      expect(trappedTweets[0].$channels['fruits']).toEqual(['orange']);
      expect(trappedTweets[9].$channels['fruits']).toEqual(['orange']);
    });
    
  });
  
});