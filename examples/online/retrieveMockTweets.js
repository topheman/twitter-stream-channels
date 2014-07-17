/*
 * I use this example to populate /mocks/data/tweets.json with tweets which will be used
 * by the TwitterStremChannels.getMockedClass() so that you could test without even connecting to twitter
 * 
 * Just run the script with node examples/online/retrieveMockTweets.js
 */

var credentials = require('../../twitter.credentials.json');
require('../../main').launchMockDataRetriever(credentials,{
  output: __dirname+'/../../mocks/data/tweets.json',
  track:[
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
  ],
  maxNumber:200,
  timeout:50000
});
