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
var logger = require('../bin/logger.js');
var getData = require('./data.js');

//Socket.io
var socket = require('../app.js');

/* import_open_311: db (mongoclient.db), force (true/false)-> 0

  if force is true, existing will be replaced.
  Give a db instance (of open_311_calls), imports all 311 data. meant to be ran only once on bootstrap
  Scope is set to 90 days, only open calls are queried

  */

function import_open_311(db, force, callback){

  logger.info("Import new 311 data.");
  var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 

  db.createCollection('calls_tmp', function(err, collection) {

    if(err){
      logger.error(err);
      return 1;
    }
    // Obtain data
    getData(url, function(data){

      assert.notEqual(data, null);
      logger.info("inside callback")

      // Bulk insert (for 311 calls, service_requests contains all the data)
      collection.insert(data.service_requests, {w:1}, function(err, result) {
        assert.equal(null, err);
        logger.info("Updated toronto_311_calls/calls_tmp");

        // Rename collection to calls. If old one exists then drop
        collection.rename('open_calls', {dropTarget:force}, function(err){
          logger.info("Renamed calls_tmp to open_calls, old open_calls dropped if existed.");

          var now = new Date();

          // Update metadata
          db.collection("metadata").insert([{date_updated: now}], function(err, result){
            assert.equal(null, err);
            logger.info("METADATA: toronto_311_calls.metadata.date_updated = " + now);
            socket.sockets.emit('311 update', data.service_requests);
            callback();
            return 0;
          });
        });
      });
    });
  });
}

/* force_import_open_311:  database, callback

  Give a db instance (of open_311_calls), updates current with upsert.

  */

function update_open_311(db, callback){

  logger.info("Updating 311 data.");
  
  var url = "https://secure.toronto.ca/webwizard/ws/requests.json?status=open&jurisdiction_id=toronto.ca"; 


  db.collectionNames("open_calls", function(err, items){
    if(items.length === 0){
      logger.info("No open_calls collection found.")
      import_open_311(db, false, callback);
    }
    
    // For now updating is the same as importing. If necessary we need to think of efficient method of updating
    else{
      import_open_311(db, true, callback);
    }
  });

}
/* main311: cmd

    Driver function to use in database calls
*/
function main311(cmd){

  mongoclient.open(function(err, mongoclient){
    var db = mongoclient.db("toronto_311_calls")
    switch(cmd){
      case "update":
        update_open_311(db, function(){
          mongoclient.close();
        });
        break;
      case "forceimport":
        import_open_311(db, true, function(){
          mongoclient.close();
        });
        break;
      default:
        logger.info("Command not found.");
    }
  }); 
}

// Calls update every 5 minutes
main311("update");
var timerId = setInterval(function(){
  main311("update");
} , 300000);

