var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var winston = require('winston');
var logger = winston.loggers.get('dev');
var config = require('../config');
var mongodb = mongoose.connect(config.mongo.uri);
var connection = mongodb.connection;
var SALT_WORK_FACTOR = 10;

connection.on('error', function (err) {
	winston.error('Connection error: ', err.message);
});

connection.once('open', function callback () {
	winston.info("Connected to DB!");
});

// User schema
var UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true}
});

// Trip schema
var TripSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	destination: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	comment: { type: String, required: false }
});

// Hash password before storing it
UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

// Password verification
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		
		cb(isMatch);
	});
};

// Validate start date is previous to end date
TripSchema.pre('save', function(next) {
	var trip = this;

	if(trip.startDate <= trip.endDate) {
		next();
	}
	else {
		var err = new Error('Start date should be previous or equal to End date');

		err.name = 'ValidationError';
		next(err);
	}
});

// Exporting models
var Trip = mongoose.model('Trip', TripSchema);
var User = mongoose.model('User', UserSchema);

module.exports.Trip = Trip;
module.exports.User = User;
