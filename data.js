var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var url = "https://secure.toronto.ca/webwizard/ws/requests.json?start_date=2013-12-01T00:00:00Z&end_date=2013-12-31T00:00:00Z&jurisdiction_id=toronto.ca&status=open";
var xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.onload = function(e) {
	var buffer = xhr.responseText;
	var json = JSON.parse(buffer);
	console.log(json);
}

xhr.send();
