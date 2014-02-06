var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/* getData: url, cb

  Given the URL and call back, calls cb function with the parsed JSON 

  TODO: Implement getData for different data_types and cb access.
*/
function getData(url, cb){
	console.log("Extracting data from: " + url);
	var xhr = new XMLHttpRequest();
	var startTime = Date.now();
	xhr.open("GET", url, true);
	xhr.onload = function(err) {
		var extractTime = (Date.now() - startTime) / 1000;
		console.log("Data extracted in " + extractTime + "secs.");
		var buffer = xhr.responseText;
		var json = JSON.parse(buffer);
		cb(json.service_requests);
	}
	xhr.onerror = function(err) {
		console.log("ERROR: FAILED TO EXTRACT DATA FROM " + url);
		return err;
	}
	xhr.send();
}

module.exports = getData;
