twitter-stream-channels
=======================

With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.

This module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.

##Installation

Just run `npm install twitter-stream-channels`

##Example :

file `my.twitter.credentials.json`
```js
{
	"consumer_key": "XXXXX",
	"consumer_secret": "XXXXX",
	"access_token": "XXXXXX",
	"access_token_secret": "XXXXX"
}
```
example
```js
var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./my.twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var channels = {
	"languages" : ['javascript','php','java','python','perl'],
	"js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
	"web" : ['javascript','nodejs','html5','css','angularjs']
};

var stream = client.streamChannels({track:channels});

stream.on('channels/languages',function(tweet){
    console.log('>languages',tweet.text);//any tweet with 'javascript','php','java','python','perl'
});

stream.on('channels/js-frameworks',function(tweet){
    console.log('>frameworks',tweet.text);//any tweet with 'angularjs','jquery','backbone','emberjs'
});

stream.on('channels/web',function(tweet){
    console.log('>web',tweet.text);//any tweet with 'javascript','nodejs','html5','css','angularjs'
});

//If you want, you can listen on all the channels and pickup the $channels added by the module
//It contains the channel and the keywords picked up in the tweet
//stream.on('channels',function(tweet){
//    console.log(tweet.$channels,tweet.text);//any tweet with any of the keywords above
//});

//If you're really picky, you can listen to only some keywords
//stream.on('keywords/javascript',function(tweet){
//    console.log(tweet.text);//any tweet with the keyword "javascript"
//});

setTimeout(function(){
    stream.close();//closes the stream connected to Twitter
	console.log('>stream closed after 100 seconds');
},100000);
```

##API

You can find an API doc generated from the source code on [http://labs.topheman.com/twitter-stream-channels/](http://labs.topheman.com/twitter-stream-channels/ "http://labs.topheman.com/twitter-stream-channels/").

There are also examples in the repo, and the API is not that complicated ... But something that you could enjoy is the mocked version of the module that **allows you to code without needing to connect to Twitter**, since it has some connection limits over every 15 minutes (those limits are not greatly specified for the streaming API).

With this simple code, you retrieve your fake data (see also [example](./examples/online/retrieveMockTweets.js "example")) :

```js
var credentials = require('./twitter.credentials.json');
require('twitter-stream-channels').launchMockDataRetriever(credentials,{
	output: "./save/your/tweets.json",
	track:['blue','white','yellow','green','orange','kiwi','apple','lemon','coconut','Luke','Leia','Han','Yoda'],
	maxNumber:200,
	timeout:50000
});
```

And then, you can use it like :

```js
var TwitterStreamChannelsMocked = require('twitter-stream-channels').getMockedClass();
var client = new TwitterStreamChannelsMocked({
	tweets: require('./save/your/tweets.json'),
	singleRun: false //so that you loop on your mocked tweets unless you call .stop() (if put at true, emulates a disconnection from twitter)
});
// ... and then you can code like the example above (without connecting to twitter)
```

I use it for the unit tests of the module as well as when I code some application based on it.

##FAQ

##For contributors

* Installation :
	* Once you've git cloned this repo, just `npm install` to install the dependencies.
	* If you don't have jasmine-node globally, run `sudo npm install jasmine-node@1.14.2 -g` (specified version - for the moment last version is buggy) to install the jasmine framework + test runner for node that will let you run the unit tests
	* If you plan to generate doc, and don't have yuidoc gobally, run `npm install yuidocjs -g`
	* If you wan't yo execute the examples or online tests, copy `twitter.credentials.default.json` to `twitter.credentials.json`, set your own credentials (you can get some at [https://apps.twitter.com/app/new](https://apps.twitter.com/app/new) if you don't have some already)
* How to run the tests : 
	* offline tests (don't need AND won't create any connection to Twitter) - run them as many time as you want :
		* single run : `npm run test`
		* continuous : `npm run test-watch`
	* online tests (need the connexion to Twitter to use the streming API) : make sure you set your credentials in the `twitter.credentials.json` file. Don't run them too many times (if you attempt too much connexion, your IP could be black listed from Twitter) :
		* single run : `npm run test-online` (none for the moment and not so sure there should be any)
* How to generate the doc :
	* Once :
		* Make sure you have yuidoc, if not `npm install yuidocjs -g`
		* Install the theme dependencies : `cd extras/yuidoc-theme-blue` then `npm install`
	* After that, at the root, just run `npm run yuidoc`