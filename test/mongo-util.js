var mongoose = require('mongoose');
var winston = require('winston');
var log = winston.loggers.get('dev');
var config = require('../config');
var User = require('../model/entity.js').User;
var Trip = require('../model/entity.js').Trip;

function clearMongo() {
	for (var i in mongoose.connection.collections) {
		mongoose.connection.collections[i].remove(function() {});
	}
}

function connectMongo(done) {
	if(mongoose.connection.readyState == 0) {
		mongoose.connect(config.mongo.uri, function(err) {
			if(!err) {
				clearMongo();
			}
			else {
				winston.error('Error connecting to database: ', err.message);
			}

			done();
		});
	}
	else {
		done();
	}
}

function disconnectMongo() {
	mongoose.disconnect();
}

var pendingTrips = 0;

function addTrip(user, destination, startDate, endDate, comment, done) {
	new Trip({
		userId: user._id,
		destination: destination,
		startDate: startDate,
		endDate: endDate,
		comment: comment
	}).save(function(err, trip) {
		pendingTrips--;

		if(pendingTrips == 0) {
			done();
		}
	});	
}

function addTestData(done) {
	clearMongo();

	// First test user has no trips
	new User({ username: 'michael', password: 'test' }).save(function(err, user) {
		// Second test user has two trips
		new User({ username: 'layla', password: 'test' }).save(function(err, user) {
			var start = new Date();
			var end = new Date();

			start.setDate(start.getDate() + 10);
			end.setDate(end.getDate() + 15);

			pendingTrips += 3;
			addTrip(user, 'Buenos Aires', new Date(2010, 08, 23), new Date(2010, 08, 29), 'First trip!', done);
			addTrip(user, 'Bogota', new Date(2012, 03, 23), new Date(2012, 05, 02), 'Second trip!', done);
			addTrip(user, 'Tokyo', start, end, 'Third trip!', done);
		});
	});

	// new User({ username: 'daniel', password: 'test' }).save(function(err, user) {
	// 	addTrip(user, 'Madrid', new Date(2003, 11, 13), new Date(2009, 08, 29), 'First trip!');
	// 	addTrip(user, 'London', new Date(2010, 04, 16), new Date(2010, 05, 03), 'Second trip!');
	// 	addTrip(user, 'Kiev', new Date(2010, 07, 23), new Date(2010, 08, 07), 'Third trip!');
	// 	addTrip(user, 'Cairo', new Date(2014, 08, 23), new Date(2014, 09, 07), 'Fourth trip!');
	// 	addTrip(user, 'Tokyo', new Date(2015, 01, 02), new Date(2015, 01, 18), 'Fifth trip!');
	// });
}

module.exports.connect = connectMongo;
module.exports.disconnect = disconnectMongo;

module.exports.addTestData = addTestData;
