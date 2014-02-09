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


/* import_open_311: db (mongoclient.db), force (true/false)-> 0

  if force is true, existing will be replaced.
  Give a db instance (of open_311_calls), imports all 311 data. meant to be ran only once on bootstrap
  Scope is set to 90 days, only open calls are queried

  */

function import_open_311(db, force){

  console.log("Import new 311 data.");

  var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 

  db.createCollection('calls_tmp', function(err, collection) {

    if(err){
      console.log(err);
      return 1;
    }
    // Obtain data
    getData(url, function(data){

      assert.notEqual(data, null);

      // Bulk insert (for 311 calls, service_requests contains all the data)
      collection.insert(data.service_requests, {w:1}, function(err, result) {
        assert.equal(null, err);
        console.log("Updated toronto_311_calls/calls_tmp");

        // Rename collection to calls. If old one exists then drop
        collection.rename('open_calls', {dropTarget:force}, function(err){
          console.log("Renamed calls_tmp to open_calls, old open_calls dropped if existed.");

          //drop tmp collection
          collection.drop();
          var now = new Date();

          // Update metadata
          db.collection("metadata").insert([{date_updated: now}], function(err, result){
            assert.equal(null, err);
            console.log("METADATA: toronto_311_calls.metadata.date_updated = " + now);
            return 0;
          });
        });
      });
    });
  });
}

/* force_import_open_311:  

  
  Give a db instance (of open_311_calls), imports all 311 data. meant to be ran only once on bootstrap
  If all_calls collection already exists, replace old calls.
  Scope is set to 90 days, only open calls are queried

  */

function force_import_open_311(db){
  mongoclient.open(function(err, mongoclient) {
    var db = mongoclient.db("toronto_311_calls" , true);
    import_open_311(db);
  });
}

function update_open_311(db){

  console.log("Updating new 311 data.");
  var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 
  
  // Open db instance
  mongoclient.open(function(err, mongoclient) {
    var db = mongoclient.db("toronto_311_calls");

    db.collectionNames("open_calls", function(err, items){
      if(items.length == 0){
        console.log("No open_calls collection found.")
        import_open_311(db);
      }
      /*
      else{
        console.log("Updating existing open_calls.")
        var collection = db.collection('open_calls');
        getData(url, function(data){

        });
      }*/

    });
  });

}

function main(){

  update_open_311();
}

main();
