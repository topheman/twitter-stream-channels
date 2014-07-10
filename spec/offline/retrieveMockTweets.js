/*
 * Execute this script to pupulate tweets.mock.json and tweetsTextOnly.mock.json
 * Which are used as data mock for unit testing
 */

var twit = require('twit');
var credentials = require('../../twitter.credentials.json');
var fs = require('fs');

var outputTweets = __dirname+'/tweets.mock.json';
var outputTweetsTextOnly = __dirname+'/tweetsTextOnly.mock.json';

var timeout = 4000;//number of milliseconds before closing the stream

//those are the keywords used in the unit tests
var trackedKeywordsOutput = [
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
];

var client = new twit(credentials);

var tweets = [];
var tweetsTextOnly = [];

var stream = client.stream('statuses/filter', {track: trackedKeywordsOutput});

stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  console.log('> twitter emit : connected - will disconnect in '+timeout+'ms');
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
});

stream.on('tweet', function(tweet) {
  console.log(tweet.created_at,tweet.text);
  tweets.push(tweet);
  tweetsTextOnly.push({created_at: tweet.created_at, text: tweet.text});
});

setTimeout(function() {
  stream.stop();
  console.log('> stopped stream after '+timeout+'ms - '+tweets.length+' tweets retrieved');
  tweets = JSON.stringify(tweets);
  tweetsTextOnly = JSON.stringify(tweetsTextOnly);
  fs.writeFile(outputTweets,tweets,function(err,data){
    console.log('>writing retrieved tweets into file : '+outputTweets);
    if(err){
      console.log('> ! an error occured while writing tweets to file');
    }
    fs.writeFile(outputTweetsTextOnly,tweetsTextOnly,function(err,data){
      console.log('>writing retrieved tweets (text only - more readable) into file : '+outputTweetsTextOnly);
      if(err){
        console.log('> ! an error occured while writing tweets to file');
      }
      process.exit();
    });
  });
}, timeout);