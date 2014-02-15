var logger = require('../bin/logger.js');
var getData = require('../data/data.js');
var assert = require('assert');

var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 
getData(url, function(data){
    assert.notEqual(data, null);
});