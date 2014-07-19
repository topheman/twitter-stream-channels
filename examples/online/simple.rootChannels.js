//example listening only to the "channels" event

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
  enableChannelsEvents:false,
  enableRootChannelsEvent:true,
  enableKeywordsEvents:false
});

var count = 0;

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  console.log('> twitter emit : connected - listening to all channels');
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
});

stream.on('channels',function(tweet){
  console.log(tweet.$channels,tweet.text);
  count++;
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured');
  process.exit();
}, 3000);