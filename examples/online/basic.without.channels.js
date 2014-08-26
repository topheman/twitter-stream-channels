//example of using streams, using directly the twit library (via getApiClient)
//this time stopping and restarting the stream

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);
var connected = false;

var stream = client.getApiClient().stream('statuses/filter', {
  track: [
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
  ]});

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
});

stream.on('reconnect', function (request, response, connectInterval) {
  console.log('> waiting to reconnect in '+connectInterval+'ms');
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream');
}, 3000);

setTimeout(function() {
  console.log('>> restarting stream for 5 seconds');
  stream.start();
}, 8000);

setTimeout(function() {
  console.log('>> stopped stream after 5 seconds');
  stream.stop();
}, 13000);

setTimeout(function() {
  stream = client.getApiClient().stream('statuses/filter', {track: ['javascript']});

  stream.on('connect', function() {
    console.log('>>> attempting to connect to twitter');
  });

  stream.on('connected', function() {
    console.log('>>> twitter emit : connected');
  });

  stream.on('disconnect', function() {
    console.log('>>> twitter emit : disconnect');
    process.exit();
  });

  stream.on('tweet', function(tweet) {
    console.log(tweet);
  });

  stream.on('reconnect', function (request, response, connectInterval) {
    console.log('>>> waiting to reconnect in '+connectInterval+'ms');
  });
  
}, 18000);

setTimeout(function() {
  stream.stop();
  console.log('>>> stopped stream');
  process.exit();
}, 33000);