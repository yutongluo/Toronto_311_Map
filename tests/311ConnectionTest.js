//TODO: use mocha

var assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 
var xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.onload = function(err) {
	var buffer = xhr.responseText;
	var json = JSON.parse(buffer);
    assert.notEqual(json, null);
}
xhr.onerror = function(err) {
	return err;
}
xhr.send();
