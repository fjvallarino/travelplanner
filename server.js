var express = require('express');
var jwt = require('express-jwt');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var path = require('path');
var serveFavicon = require('serve-favicon');
var serveStatic = require('serve-static');

var winston = require('winston');
var config = require('./config');
var app = express();
var log = null;

// Init global Winston logger
winston.loggers.add('dev', {
	console: {
		level: 'debug',
		colorize: 'true',
		label: 'dev'
	},
	file: {
		filename: 'dev.log'
	}
});

log = winston.loggers.get('dev');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
 // HTTP PUT and DELETE support
app.use(methodOverride());
 // log all requests
app.use(morgan('dev'));
// use standard favicon
//app.use(serveFavicon(__dirname + '/public/favicon.ico'));
// starting static fileserver, that will watch `public` folder (in our case there will be `index.html`)
app.use(serveStatic(path.join(__dirname, "public")));

// Test URL
app.get('/api', function (req, res) {
	res.send('API is running');
});

// Register routes
require('./routes/users')(app);
require('./routes/trips')(app);

// Register default handler for unknown URL
app.use(function(req, res, next) {
	res.status(404);
	res.send({ error: 'Not found' });
	return;
});

// Register default handler for server errors
app.use(function(err, req, res, next) {
	log.error('Internal error (%d): %s', res.statusCode, err.message);
	res.status(err.status || 500);
	res.send({ error: err.message });
	return;
});

// Start HTTP server
app.listen(config.http.port, function() {
	log.debug("Listening on port: " + config.http.port);	
});
