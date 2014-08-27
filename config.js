var config = {};

config.http = {};
config.mongo = {};

config.secretToken = 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx';

config.http.port = process.env.HTTP_PORT || 8080;

if(process.env.TEST_TRAVEL_PLANNER) {
	config.mongo.uri = process.env.MONGO_URI || "mongodb://localhost/travelplannertest";
}
else {
	config.mongo.uri = process.env.MONGO_URI || "mongodb://localhost/travelplanner";
}

module.exports = config;
