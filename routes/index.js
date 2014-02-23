var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.data = function(req, res) {
	MongoClient.connect("mongodb://localhost:27017/toronto_311_calls", {native_parser:true}, function(err, db) {
		assert.equal(null, err);

		db.collection('open_calls').find({"service_code": "CSROWR-12"}, {}, function(err, cursor) {
			assert.equal(null, err);
			assert.notEqual(null, cursor);
			cursor.toArray(function(err, docs){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(docs));
				db.close();
			});
		});
	});
};
