//example listening to "channels/channelName" events

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');
var timeout = 10000;

var client = new TwitterStreamChannels(credentials);
var connected = false;

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
  if(connected === false){
    console.log('> twitter emit : connected - listening to channel "colors"');
    connected = true;
  }
});

stream.on('disconnect', function(msg) {
  console.log('> twitter emit : disconnect');
  connected = false;
});

stream.on('reconnect', function(msg) {
  console.log('> twitter emit : reconnect');
});

stream.on('warning', function(msg) {
  console.log('> twitter emit : warning');
});

stream.on('channels/colors', function(tweet) {
  console.log(tweet.$channels,tweet.$keywords,tweet.text);
  count++;
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured in '+timeout+'ms');
  process.exit();
}, timeout);