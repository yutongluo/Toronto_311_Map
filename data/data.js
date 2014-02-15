var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var logger = require('../bin/logger.js');

/* getData: url (string) , cb (function)

  Given the URL and call back, calls cb function with the parsed JSON 

  TODO: Implement getData for different data_types and cb access.
*/
function getData(url, cb){

	logger.info("Extracting data from: " + url);
	logger.profile("311 Extract JSON Data");

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function(err) {
		var extractTime = (Date.now() - startTime) / 1000;
		logger.profile("311 Extract JSON Data");
		var buffer = xhr.responseText;
		var json = JSON.parse(buffer);
		cb(json);
	}
	xhr.onerror = function(err) {
		logger.error("ERROR: FAILED TO EXTRACT DATA FROM " + url);
		logger.profile("311 Data Extract");
		return err;
	}
	xhr.onreadystatechange = function(){
		switch(xhr.readyState){
			case 1:
				logger.info("server connection established");
				break;
			case 2:
				logger.info("request received ");
				break;
			case 3:
				logger.info("processing request ");
				break;
			case 4:
				logger.info("request finished and response is ready");
				break;
		}
	}
	xhr.send();
}


module.exports = getData;
