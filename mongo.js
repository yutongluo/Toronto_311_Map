var fs = require('fs');

// Mongo DB
var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var ReplSetServers = require('mongodb').ReplSetServers;
var ObjectID = require('mongodb').ObjectID;
var Binary = require('mongodb').Binary;
var GridStore = require('mongodb').GridStore;
var Grid = require('mongodb').Grid;
var Code = require('mongodb').Code;
var BSON = require('mongodb').pure().BSON;
var assert = require('assert');
var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});

var getData = require('./data.js');

// Used to do a fresh full import of 311 data. If a collection exists the collection is removed.
// Scope is 2 years ago
// TODO: Make year changeable
function create311(data){
  console.log("Creating new 311 data.");

  //Get date of 2 years ago
  var now = new Date();
  now.setFullYear(now.getFullYear() - 2);
  var start_date = now.toJSON();
  var url = "https://secure.toronto.ca/webwizard/ws/requests.json?start_date=" 
  + start_date+ "&jurisdiction_id=toronto.ca"; 

  mongoclient.open(function(err, mongoclient) {

    // Open db instance
    var db = mongoclient.db("toronto_311_calls");

    // Remove existing 311 calls. The createCollection here is
    // just a trick to see if calls already exist. We will
    // indiscriminately create calls after this.

    //TODO: fix this part. 
    db.createCollection('calls', {strict:true}, function(err, collection) {

      if(err){
        console.log("311 calls collection exists. Removing.")
        db.collection('calls', function(err, collection){
          collection.remove({}, function(err, removed){
            assert.equal(null, err);
            console.log("311 calls collection removed.")
          });
        });
      }
    });

    db.createCollection('calls', function(err, collection) {
      getData(url, function(data){
        collection.insert(data, function(err, result) {
          assert.equal(null, err);
          console.log("Updated toronto_311_calls/call");
        });
      });
    });
  })
}

create311(null);
/*
mongoclient.open(function(err, mongoclient) {

    // Get the first db and do an update document on it
    var db = mongoclient.db("integration_tests");
    db.collection('mongoclient_test').update({a:1}, {b:1}, {upsert:true}, function(err, result) {
      assert.equal(null, err);
      assert.equal(1, result);
      console.log("Updated mongoclient_test");

      // Get another db and do an update document on it
      var db2 = mongoclient.db("integration_tests2");
      db2.collection('mongoclient_test').update({a:1}, {b:1}, {upsert:true}, function(err, result) {
        assert.equal(null, err);
        assert.equal(1, result);
        console.log("Updated mongoclient_test2");ubun

        // Close the connection
        mongoclient.close();
      });
    });
  })

*/