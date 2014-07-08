var TwitterStreamChannels = require('../TwitterStreamChannels.mock');
var client = new TwitterStreamChannels({});

client.streamChannels({track: "whatever"});