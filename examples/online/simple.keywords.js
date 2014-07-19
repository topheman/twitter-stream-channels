//example listening only to one keyword in all the channels
//(could be in two different channels at a time)

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');
var timeout = 10000;

var client = new TwitterStreamChannels(credentials);

var channelsInput = {
  "colors": "blue,white,yellow,green,orange",
  "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
  "starWarsCharacters": ['Luke', 'Leia,Han', 'Yoda']
};

var stream = client.streamChannels({
  track: channelsInput,
  enableChannelsEvents:false,
  enableRootChannelsEvent:false,
  enableKeywordsEvents:true
});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  console.log('> twitter emit : connected - listening to keyword "orange"');
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
});

//we only track the tweets about apple
stream.on('keywords/orange',function(tweet){
  console.log(tweet.$channels,tweet.text);
  count++;
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured');
  process.exit();
}, timeout);