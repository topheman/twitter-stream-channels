//example of using streams, using directly the twit library (via getApiClient) - with the mock

var TwitterStreamChannels = require('../../main').getMockedClass();
var credentials = require('../../twitter.credentials.json');//not necessary - since using mock
var tweetsMock = require('../../mocks/data/tweets.json');
var timeout = 3000;

var client = new TwitterStreamChannels(credentials);
var connected = false;

var stream = client.getApiClient().stream('statuses/filter', {track: ['any,word,in,the,mock,data']});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  if(connected === false){
    console.log('> twitter emit : connected');
    connected = true;
  }
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
  connected = false;
});

stream.on('tweet', function(tweet) {
  console.log(tweet.text);
  count++;
});

stream.on('reconnect', function (request, response, connectInterval) {
  console.log('> waiting to reconnect in '+connectInterval+'ms');
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured on '+tweetsMock.length+' in '+timeout+'ms');
  process.exit();
}, timeout);