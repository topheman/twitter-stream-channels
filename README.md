twitter-stream-channels
=======================

[![npm version](https://badge.fury.io/js/twitter-stream-channels.svg)](https://www.npmjs.com/package/twitter-stream-channels)
[![Build Status](https://travis-ci.org/topheman/twitter-stream-channels.svg?branch=master)](https://travis-ci.org/topheman/twitter-stream-channels)

With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.

This module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.

twitter-stream-channels handles all the post-processing, the connexion layer (OAuth, etc ...) is handled by [twit](https://github.com/ttezel/twit). See the [FAQ](https://github.com/topheman/twitter-stream-channels#faq) about both topics.

You can see [Topheman Datavisual](http://topheman-datavisual.herokuapp.com/) which is a project I made, using this module for the Twitter Stream part.

## Installation

Just run `npm install twitter-stream-channels`

## Example :

file: `my.twitter.credentials.json`

```js
{
	"consumer_key": "XXXXX",
	"consumer_secret": "XXXXX",
	"access_token": "XXXXXX",
	"access_token_secret": "XXXXX"
}
```

example:

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
    stream.stop();//closes the stream connected to Twitter
	console.log('>stream closed after 100 seconds');
},100000);
```

## API

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

## FAQ

#### To what events can I subscribe ?

* `.on('channels')` : will listen to all the incoming tweets
* `.on('channels/languages')` : will only listen to the tweets where the keywords from the channel "languages" were matched (like javascript, java, php, python or perl)
* `.on('keywords/angularjs')` : will only listen to the tweets where the keyword "angularjs" was matched

#### Where do I find out the matched keywords and channels ?

Two attributes are added to the tweet you retrieve :

* $channels : a key/value object : key : name of the channel, value : array of keywords retrieved in this channel on this tweet
* $keywords : an array of all the keywords you're following that were matched on this tweet.


#### The matched keywords are lower cased, why ?

Since the Twitter streaming filter API is case-insensitive, I lower case before matching, so the keywords matched you will find in `tweet.$channels['yourChannel']` are lower cased.

#### How much of post-processing does this cover ?

As specified in the [Twitter streaming API](https://dev.twitter.com/docs/streaming-apis/parameters#track) :

> The text of the Tweet and some entity fields are considered for matches. Specifically, the text attribute of the Tweet, expanded_url and display_url for links and media, text for hashtags, and screen_name for user mentions are checked for matches.

So I match your keywords not only against tweet.text but also against `expanded_url`, `display_url` and `screen_name` when they are available (this is a work you won't have to bother to do ...)

#### How to unsubscribe ?

The object returned by `(new require('twitter-stream-channels')(credentials)).streamChannels(options)` extends the standard [events.EventEmitter of nodejs](http://nodejs.org/api/events.html), so you can use `on()`, `off()`, `addEventListener()` ...

#### I can't connect to Twitter, or I have disconnections, how about that ?

* First : check your credentials.
* Second : have tried too many times to connect ? Wait a couple of minutes.

If this persists, you can file an issue. But know that the twitter-stream-channels modules doesn't handle itself the network layer. It relies on [twit](https://github.com/ttezel/twit) for this part, so check if that doesn't come from it. If twit is upgraded with fixes, I will upgrade my module.

#### Can I also use this module for other parts of the Twitter API than only streams ?

You can do anything the Twitter API offers, via the twit client which is exposed by getApiClient(). Once you retrieved the root client, you can call the API exposed by [twit](https://github.com/ttezel/twit) to interract with Twitter.

#### Can I upgrade to v1 from v0.x ?

Yes, the v1 version does not introduce any breaking changes to the twitter-stream-channels API. The reasons of the version bump:

* Upgrade to latest version of [twit](https://github.com/ttezel/twit) (library handling twitter API)
* Made sure of the compatibility with both v0.12.x & v4 of node

## For contributors

* Installation :
	* Once you've git cloned this repo, just `npm install` to install the dependencies.
	* If you want to execute the examples or online tests, copy `twitter.credentials.default.json` to `twitter.credentials.json`, set your own credentials (you can get some at [https://apps.twitter.com/app/new](https://apps.twitter.com/app/new) if you don't have any already)
* How to run the tests : 
	* offline tests (don't need AND won't create any connexion to Twitter) - run them as many time as you want :
		* single run : `npm run test`
		* continuous : `npm run test-watch` (I set it up but don't use it for the moment)
	* online tests (needs the connexion to Twitter to use the streaming API) : make sure you set your credentials in the `twitter.credentials.json` file. Don't run them too many times (if you attempt too much connexion, your IP could be black listed from Twitter) :
		* single run : `npm run test-online` (none for the moment and not so sure there should be any)
* How to generate the doc : `npm run yuidoc` will generate doc into `./yuidoc` directory
