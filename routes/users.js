var config = require('../config');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var winston = require('winston');
var log = winston.loggers.get('dev');
var User = require('../model/entity').User;
var authHandler = expressjwt({ secret: config.secretToken });

module.exports = function(app) {
	app.post('/api/register', function(req, res) {
		var username = req.body.username || '';
		var password = req.body.password || '';

		// If no username/password is provided, the user can't be registered
		if (username == '' || password == '') {
			return res.status(400).json('Username and password are required');
		}

		// Validate existing user
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				log.error(err);
				return res.status(500).json({ error: 'Error creating user' });
			}
			else if(user) {
				// If a user already exists, invalidate the process
				return res.status(409).json({ error: 'Username already exists' });
			}
			else {
				// If the user does not exist, create it
				new User({ username: username, password: password }).save(function(err, user, count) {
					if(err) {
						log.error(err);
						return res.status(500).json({ error: 'Error creating user' });
					}
					else {
						return res.json('User created successfully');
					}
				});
			}
		});
	});

	app.post('/api/login', function(req, res) {
		var username = req.body.username || '';
		var password = req.body.password || '';

		// If no username/password is provided, the user can't login
		if (username == '' || password == '') {
			return res.status(400).json({ error: 'Username and password are required' });
		}

		// Check if the user exists
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				log.error(err);
				return res.status(500).json({ error: 'Error validating user' });
			}
			else if(user) {
				// Check if the password matches
				user.comparePassword(password, function(isMatch) {
					if (!isMatch) {
						return res.status(401).json({ error: 'Invalid credentials' });
					}
					else {
						// Return the token that will be used to access the rest of the protected API
						var token = jwt.sign({ id: user._id, username: user.username }, config.secretToken, { expiresInMinutes: 60 });

						return res.json({ token: token });
					}
				});
			}
			else {
				return res.status(401).json({ error: 'Invalid credentials' });
			}
		});
	});
}
