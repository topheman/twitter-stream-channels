//example of using streams, using directly the twit library (via getApiClient)

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var stream = client.getApiClient().stream('statuses/filter', {track: ['worldcup']});

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  console.log('> twitter emit : connected');
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
});

stream.on('tweet', function(tweet) {
  console.log(tweet.text);
});

stream.on('reconnect', function (request, response, connectInterval) {
  console.log('> waiting to reconnect in '+connectInterval+'ms');
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream');
  process.exit();
}, 3000);