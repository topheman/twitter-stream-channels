twitter-stream-channels
=======================

With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.

This module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.

##1) Installation

Just run `npm install twitter-stream-channels`

##2) Example :

```js
var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('my.twitter.credentials.json');

var client = new TwitterStreamChannels(credentials);

var channels = {
	"languages" : ['javascript','php','java','python','perl'],
	"js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
	"web" : ['javascript','nodejs','html5','css','angularjs']
};

var stream = client.streamChannels({track:channels});

stream.on('channels/languages',function(tweet){
    console.log(tweet);//any tweet with 'javascript','php','java','python','perl'
});

stream.on('channels/js-frameworks',function(tweet){
    console.log(tweet);//any tweet with 'angularjs','jquery','backbone','emberjs'
});

stream.on('channels/web',function(tweet){
    console.log(tweet);//any tweet with 'javascript','nodejs','html5','css','angularjs'
});

stream.on('channels',function(tweet){
    console.log(tweet);//any tweet with any of the keywords above
});

//whatever needs to close stream some time
setTimeout(function(){
    stream.close();//closes the stream connected to Twitter 
},100000);
```

##3) API

##4) For contributors

* Installation :
	* Once you've git cloned this repo, just `npm install` to install the dependencies.
	* If you don't have jasmine-node globally, run `sudo npm install jasmine-node@1.14.2 -g` (specified version - for the moment last version is buggy) to install the jasmine framework + test runner for node that will let you run the unit tests
	* If you plan to generate doc, and don't have yuidoc gobally, run `npm install yuidoc -g`
	* If you wan't yo execute the examples or online tests, copy `twitter.credentials.default.json` to `twitter.credentials.json`, set your own credentials (you can get some at [https://apps.twitter.com/app/new](https://apps.twitter.com/app/new) if you don't have some already)
* How to run the tests : 
	* offline tests (don't need AND won't create any connection to Twitter) - run them as many time as you want :
		* single run : `npm run tests-offline`
		* continuous : `npm run tests-offline-watch`
	* online tests (need the connexion to Twitter to use the streming API) : make sure you set your credentials in the `twitter.credentials.json` file. Don't run them too many times (if you attempt too much connexion, your IP could be black listed from Twitter) :
		* single run : `npm run tests-online`
* How to generate the doc : `npm run yuidoc`