/*
 * Execute this script to pupulate tweets.json
 * Which are used as data mock for unit testing
 */

var credentials = require('../../twitter.credentials.json');
require('../../main').launchMockDataRetriever(credentials,{
  output: __dirname+'/tweets.json',
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
  ]
});
