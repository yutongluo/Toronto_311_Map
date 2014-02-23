var logger = require('../bin/logger.js');
var fs = require('fs');
var assert = require('assert');

var date = new Date();
//Used to test log date 
var epoch = date.getTime().toString();
logger.info(epoch);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var log_dir = __dirname + '/../logs';

describe('Logs', function(){
	describe('Log directory/file', function(){
		it('log directory should exist', function(){
			assert(fs.existsSync(log_dir));
		});
		it('log debug file should exist', function(){
			assert(fs.existsSync(log_dir + '/debug.log'));
		});
	});

	describe('Log write', function(){
		it('log should be able to write to debug.log', function(){
			//The write part is already in line 5 (logger.info("TEST"))
			//we just need to read this file now and check

			fs.stat(log_dir + '/debug.log', function(err, stats){
				fs.open(log_dir + '/debug.log', 'r', function(err, fd){
					var buffer = new Buffer(stats.size);
					fs.read(fd, buffer, 0 , buffer.length, null, function(error, bytesRead, buffer){
						var data = buffer.toString('utf-8', 0, buffer.length);
						assert.equal(data.substr(data.length - epoch.length - 1 ), epoch +'\n');
						fs.close(fd);
					})
				});
			});
		});
	});
});

//