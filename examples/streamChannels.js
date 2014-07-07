var StreamChannels = require('../lib/StreamChannels');

var channels = {
  "languages" : ['javascript','php','java','python','perl'],
  "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
  "web" : ['javascript','nodejs','html5','css','angularjs,toto,tata'],
  "test": "titi,toto,tata"
};

//should throw an error
//var stream = new StreamChannels({},{track:15});

var stream = new StreamChannels({},{track:channels});

console.log(stream.getChannels());