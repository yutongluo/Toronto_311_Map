//TODO: use mocha

var assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

describe('XMLHttpRequest', function(){
	describe('#open', function(){
		it('should obtain 311 data without error (takes long time)', function(done){

			//Disable timeout for mocha
			var url = "https://secure.toronto.ca/webwizard/ws/requests.json?service_request_id=101001362391&jurisdiction_id=toronto.ca"; 
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onload = function(err) {

				var buffer = xhr.responseText;
				var json = JSON.parse(buffer);
			    assert.notEqual(json, null);
			    done();
			}
			xhr.onerror = function(err) {
				return err;
			}
			xhr.send();
		})
	})
})

