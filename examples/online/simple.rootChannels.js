//example listening only to the "channels" event

var TwitterStreamChannels = require('../../main');
var credentials = require('../../twitter.credentials.json');
var timeout = 3000;

var client = new TwitterStreamChannels(credentials);
var connected = false;

var channelsInput = {
  "colors": "blue,white,yellow,green,orange",
  "fruits": ['kiwi', 'orange,apple', 'lemon', 'coconut'],
  "starWarsCharacters": ['Luke', 'Leia,Han', 'Yoda']
};

var stream = client.streamChannels({
  track: channelsInput,
  enableChannelsEvents:false,
  enableRootChannelsEvent:true,
  enableKeywordsEvents:false
});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  if(connected === false){
    console.log('> twitter emit : connected - listening to all channels');
    connected = true;
  }
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
  connected = false;
});

stream.on('channels',function(tweet){
  console.log(tweet.$channels,tweet.$keywords,tweet.text);
  count++;
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured in '+timeout+'ms');
  process.exit();
}, timeout);