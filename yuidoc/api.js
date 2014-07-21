YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "MockDataRetriever",
        "StreamChannels",
        "TwitterStreamChannels",
        "TwitterStreamChannelsMock"
    ],
    "modules": [
        "twitter-stream-channels"
    ],
    "allModules": [
        {
            "displayName": "twitter-stream-channels",
            "name": "twitter-stream-channels",
            "description": "With the Twitter stream API, you can only open one stream at a time. So, if you have multiple filters, the tweets in result will be mixed up, you'll need to do some post-processing.\n\nThis module lets you open multiple channels with there own filters, on the same stream. And then, you can add events to each of them individually, to listen to there results, like if you had open multiple streams.\n\ntwitter-stream-channels handles all the post-processing, the connexion layer (OAuth, etc ...) is handled by [twit](https://github.com/ttezel/twit). See the [FAQ](https://github.com/topheman/twitter-stream-channels#faq) about both topics."
        }
    ]
} };
});