/*
 * The purpose of this file is to check if the Mockups behave correctly
 */

var TwitterStreamChannels = require('./TwitterStreamChannels.mock');
var client = new TwitterStreamChannels({});
var inputTweetsMocks = require('./tweets.mock.json');

var stream = client.streamChannels({track: "whatever"});
var count = 0;

stream.on('connect',function(){
  console.log('> attempt connecting');
});

stream.on('connected',function(){
  console.log('> connected');
});

stream.on('tweet',function(tweet){
  console.log(tweet.text);
  count++;
});

setTimeout(function(){
  stream.stop();
  console.log('> stopped stream');
  console.log('> retrieved '+count+' tweets / '+inputTweetsMocks.length+' tweets were send by the mock');
  process.exit();
},15000);