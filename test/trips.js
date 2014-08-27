var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');
var mongoUtil = require('./mongo-util');
var config = require('../config');

describe('Routing', function() {
	var url = 'http://localhost:8080';
	
	before(function(done) {
		mongoUtil.connect(done);
	});

	beforeEach(function(done) {
		mongoUtil.addTestData(done);
	});

	describe('Trip', function() {
		it('should forbid access to the list of trips', function(done) {
			request(url)
				.get('/api/trips')
				.expect('Content-Type', /json/)
				.expect(401, done);
		});

		it('should return an empty list of trips', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'test' })
				.end(function(err, res) {
					request(url)
						.get('/api/trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							should.not.exist(err);
							res.body.should.have.length(0);

							done();
						});
					});
		});

		it('should return a list of three trips', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'layla', password: 'test' })
				.end(function(err, res) {
					request(url)
						.get('/api/trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							should.not.exist(err);
							res.body.should.have.length(3);

							done();
						});
					});
		});

		it('should create a new trip', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'test' })
				.end(function(err, res) {
					request(url)
						.post('/api/trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.send({
							destination: 'Montevideo',
							startDate: new Date(2015, 06, 28),
							endDate: new Date(2015, 07, 08),
							comment: 'Finally!' })
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							should.not.exist(err);
							res.body.should.have.property('userId');

							done();
						});
					});
		});

		it('should fail to create a new trip', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'test' })
				.end(function(err, res) {
					request(url)
						.post('/api/trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.send({
							endDate: new Date(2015, 07, 08),
							comment: 'Finally!' })
						.expect('Content-Type', /json/)
						.expect(400, done);
					});
		});

		it('should modify an existing trip', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'layla', password: 'test' })
				.end(function(err, res) {
					var token = res.body.token;

					request(url)
						.get('/api/trips')
						.set('Authorization', 'Bearer ' + token)
						.expect('Content-Type', /json/)
						.end(function(err, res) {
							request(url)
								.put('/api/trips/' + res.body[0]._id)
								.set('Authorization', 'Bearer ' + token)
								.send({
									destination: 'Montevideo',
									startDate: new Date(2015, 06, 28),
									endDate: new Date(2015, 07, 08),
									comment: 'Finally!' })
								.expect(200, done);
						});
					});
		});

		it('should delete an existing trip', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'layla', password: 'test' })
				.end(function(err, res) {
					var token = res.body.token;

					request(url)
						.get('/api/trips')
						.set('Authorization', 'Bearer ' + token)
						.expect('Content-Type', /json/)
						.end(function(err, res) {
							request(url)
								.delete('/api/trips/' + res.body[1]._id)
								.set('Authorization', 'Bearer ' + token)
								.expect(200, done);
						});
					});
		});

		it('should return an empty list of trips for next month', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'test' })
				.end(function(err, res) {
					request(url)
						.get('/api/next-month-trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							should.not.exist(err);
							res.body.should.have.length(0);

							done();
						});
					});
		});

		it('should return a list of one trip for next month', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'layla', password: 'test' })
				.end(function(err, res) {
					request(url)
						.get('/api/next-month-trips')
						.set('Authorization', 'Bearer ' + res.body.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							should.not.exist(err);
							res.body.should.have.length(1);

							done();
						});
					});
		});
	});
});
