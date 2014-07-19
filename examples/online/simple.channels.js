//example listening to "channels/channelName" events

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var channelsInput = {
  "colors": "blue,white,yellow,green,orange",
  "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
  "starWarsCharacters": ['Luke', 'Leia,Han', 'Yoda']
};

var stream = client.streamChannels({
  track: channelsInput,
  enableChannelsEvents:true,
  enableRootChannelsEvent:true,
  enableKeywordsEvents:false
});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function(msg) {
  console.log('> twitter emit : connected - listening to channel "colors"');
});

stream.on('disconnect', function(msg) {
  console.log('> twitter emit : disconnect');
});

stream.on('reconnect', function(msg) {
  console.log('> twitter emit : reconnect');
});

stream.on('warning', function(msg) {
  console.log('> twitter emit : warning');
});

stream.on('channels/colors', function(tweet) {
  console.log(tweet.$channels,tweet.text);
  count++;
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured');
  process.exit();
}, 10000);