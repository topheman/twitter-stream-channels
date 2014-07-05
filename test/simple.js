//first test in order to assert that the connexion to the twitter stream was correct
//made directly via twit (the node_modules dependency exposed via getApiClient() )

var TChannels = require('../twitter-stream-channels');
var credentials = require('../twitter.credentials.json');
console.log(credentials);
var client = new TChannels(credentials);

var stream = client.getApiClient().stream('statuses/filter',{track:'javascript'});

stream.on('connected',function(){
    console.log('> twitter emit : connected');
});

stream.on('disconnected',function(){
    console.log('> twitter emit : disconnected');
});

stream.on('tweet', function (tweet) {
  console.log(tweet);
});

setTimeout(function(){
    stream.stop();
    console.log('> stopped stream');
},15000);

setTimeout(function(){
    stream = client.getApiClient().stream('statuses/filter',{track:'worldcup'});

    stream.on('connected',function(){
        console.log('>>> twitter emit : connected');
    });

    stream.on('disconnected',function(){
        console.log('>>> twitter emit : disconnected');
    });

    stream.on('tweet', function (tweet) {
      console.log(tweet.text);
    });
},20000);

setTimeout(function(){
    stream.stop();
    console.log('>>> stopped stream');
},22000);