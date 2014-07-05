var twit = require('twit');

var TChannels = function(credentials){
    this.apiClient = new twit(credentials);
};

TChannels.prototype.getApiClient = function(){
    return this.apiClient;
};

module.exports = TChannels;