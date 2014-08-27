var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');
var mongoUtil = require('./mongo-util');
var config = require('../config');

describe('User', function() {
	var url = 'http://localhost:8080';

	before(function(done) {
		mongoUtil.connect(done);
	});

	beforeEach(function(done) {
		mongoUtil.addTestData(done);
	});

	describe('Register', function() {
		it('should register a new user', function(done) {
			request(url)
				.post('/api/register')
				.send({ username: 'john', password: 'test' })
				.expect(200, done);
		});

		it('should fail when attempting to register a user without username', function(done) {
			request(url)
				.post('/api/register')
				.send({ password: 'test' })
				.expect(400, done);
		});

		it('should fail when attempting to register a user without password', function(done) {
			request(url)
				.post('/api/register')
				.send({ username: 'john' })
				.expect(400, done);
		});

		it('should fail when attempting to register an existing user', function(done) {
			request(url)
				.post('/api/register')
				.send({ username: 'michael', password: 'test' })
				.expect(409, done);
		});
	});

	describe('Login', function() {
		it('should login successfully', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'test' })
				.expect(200)
				.end(function(err, res) {
					should.not.exist(err);
					res.body.should.have.property('token');
					done();
				});
		});

		it('should login fail because the username is empty', function(done) {
			request(url)
				.post('/api/login')
				.send({ password: 'test' })
				.expect(400, done);
		});

		it('should login fail because the password is empty', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael' })
				.expect(400, done);
		});

		it('should login fail because the password does not match', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'michael', password: 'testing' })
				.expect(401, done);
		});

		it('should login fail because the username does not exist', function(done) {
			request(url)
				.post('/api/login')
				.send({ username: 'robert', password: 'test' })
				.expect(401, done);
		});
	});
});
