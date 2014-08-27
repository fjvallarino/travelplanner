var config = require('../config');
var jwt = require('express-jwt');
var winston = require('winston');
var log = winston.loggers.get('dev');
var mongoose = require('mongoose');
var Trip = require('../model/entity').Trip;
var authHandler = jwt({ secret: config.secretToken });

module.exports = function(app) {
	app.route('/api/trips')
		.get(authHandler, function(req, res) {
			var conditions = { userId: req.user.id };

			if(req.param('destination')) {
				conditions.destination = new RegExp(req.param('destination'), "i");
			}

			if(req.param('fromDate') && req.param('toDate')) {
				conditions.startDate = { $gte: req.param('fromDate'), $lte: req.param('toDate') };
			}
			else if(req.param('fromDate')) {
				conditions.startDate = { $gt: req.param('fromDate') };
			}
			else if(req.param('toDate')) {
				conditions.startDate = { $lt: req.param('toDate') };
			}

			return Trip.find(conditions).sort('startDate').exec(function(err, trips) {
				if(!err) {
					return res.json(trips);
				}
				else {
					log.error('Internal error (500): %s', err.message);
					return res.status(500).json({ error: 'Server error' });
				}
			});
		})
		.post(authHandler, function(req, res) {
			var trip = new Trip({
				destination: req.body.destination,
				startDate: req.body.startDate,
				endDate: req.body.endDate,
				comment: req.body.comment,
				userId: req.user.id
			});

			trip.save(function(err) {
				if(!err) {
					log.info('Trip created');
					return res.json(trip);
				}
				else if(err.name == 'ValidationError') {
					res.status(400).send({ error: err.message || 'Validation error' });
				}
				else {
					log.error('Internal error (500): %s', err.message);
					res.status(500).send({ error: 'Server error' });
				}
			});
		});

	app.route('/api/trips/:id')
		.get(authHandler, function(req, res) {
			return Trip.findOne({ _id: req.params.id, userId: req.user.id }, function (err, trip) {
				if(!trip) {
					return res.status(404).json({ error: 'Not found' });
				}
				else if (!err) {
					return res.json(trip);
				}
				else {
					log.error('Internal error (500): %s', err.message);
					return res.status(500).json({ error: 'Server error' });
				}
			});
		})
		.put(authHandler, function(req, res) {
			return Trip.findOne({ _id: req.params.id, userId: req.user.id }, function (err, trip) {
				if(!trip) {
					return res.status(404).json({ error: 'Not found' });
				}
				else if(!err) {
					trip.destination = req.body.destination;
					trip.startDate = req.body.startDate;
					trip.endDate = req.body.endDate;
					trip.comment = req.body.comment;

					trip.save(function(err) {
						if(!err) {
							log.info('Trip updated');
							return res.json(trip);
						}
						else if(err.name == 'ValidationError') {
							res.status(400).send({ error: err.message || 'Validation error' });
						}
						else {
							log.error('Internal error (500): %s', err.message);
							res.status(500).send({ error: 'Server error' });
						}
					});
				}
				else {
					log.error('Internal error (500): %s', err.message);
					res.status(500).send({ error: 'Server error' });
				}
			});
		})
		.delete(authHandler, function(req, res) {
			return Trip.findOne({ _id: req.params.id, userId: req.user.id }, function (err, trip) {
				if(!trip) {
					return res.status(404).json({ error: 'Not found' });
				} 
				else if(!err) {
					trip.remove(function(err) {
						if(!err) {
							log.info('Trip deleted');
							return res.json(trip);
						}
						else {
							log.error('Internal error (500): %s', err.message);
							res.status(500).send({ error: 'Server error' });
						}
					});
				}
				else {
					log.error('Internal error (500): %s', err.message);
					res.status(500).send({ error: 'Server error' });
				}
			});
		});

	app.route('/api/next-month-trips')
		.get(authHandler, function(req, res) {
			var nextMonth = new Date();

			nextMonth.setMonth(nextMonth.getMonth() + 1);

			var conditions = {
				userId: req.user.id,
				startDate: { $gte: new Date(), $lt: nextMonth }
			};

			return Trip.find(conditions).sort('startDate').exec(function(err, trips) {
				if(!err) {
					return res.json(trips);
				}
				else {
					log.error('Internal error (500): %s', err.message);
					return res.status(500).json({ error: 'Server error' });
				}
			});
		});
}
