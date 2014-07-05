twitter-stream-channels
=======================

With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.

This module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.

Example :

```js
var TChannels = require('twitter-stream-channels');
var credentials = require('my.twitter.credentials.json');

var client = new TChannels(credentials);

var channels = {
    "languages" : ['javascript','php','java','python','perl'],
    "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    "web" : ['javascript','nodejs','html5','css','angularjs']
};

var stream = client.streamChannels(channels);

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