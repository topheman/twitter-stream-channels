//example of using streams, using directly the twit library (via getApiClient) - with the mock

var TwitterStreamChannels = require('../../main').getMockedClass();
var credentials = require('../../twitter.credentials.json');//not necessary - since using mock
var tweetsMock = require('../../mocks/data/tweets.json');

var client = new TwitterStreamChannels(credentials);

var channelsInput = {
  "colors": "blue,white,yellow,green,orange",
  "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
  "starWarsCharacters": ['Luke', 'Leia,Han', 'Yoda']
};

var stream = client.streamChannels({track: channelsInput});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  console.log('> twitter emit : connected');
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
});

//stream.on('tweet', function(tweet) {
//  console.log('>',tweet.text);
//  count++;
//});

stream.on('channels',function(tweet){
  console.log(tweet.$channels,tweet.text);
  count++;
});

//stream.on('channels/fruits',function(tweet){
//  console.log(tweet.$channels,tweet.text);
//  count++;
//});

stream.on('reconnect', function (request, response, connectInterval) {
  console.log('> waiting to reconnect in '+connectInterval+'ms');
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured on '+tweetsMock.length);
  process.exit();
}, 3000);