define(['./module'], function (services) {
	'use strict';

	services.factory('Trip', ['$resource', function($resource) {
		return $resource('/api/trips/:id', { id: '@_id' }, { update: { method: 'PUT' } });
	}]);

	services.factory('TripService', ['$http', '$q', 'Trip', function($http, $q, Trip) {
		return {
			get: function(id) {
				return Trip.get({ id: id });
			},

			query: function(criteria) {
				return Trip.query(criteria || {});
			},

			create: function(trip) {
				var deferred = $q.defer();

				Trip.save(trip,
					function(res) {
						deferred.resolve(res);
					}, function(error) {
						deferred.reject(error.data.error);
					});

				return deferred.promise;
			},

			update: function(trip) {
				var deferred = $q.defer();

				Trip.update(trip,
					function(res) {
						deferred.resolve(res);
					}, function(error) {
						deferred.reject(error.data.error);
					});

				return deferred.promise;
			},

			delete: function(trip) {
				var deferred = $q.defer();

				Trip.delete({ id: trip._id },
					function(res) {
						deferred.resolve(res);
					}, function(error) {
						deferred.reject(error.data.error);
					});

				return deferred.promise;
			},

			tripsNextMonth: function() {
				var deferred = $q.defer();

				$http.get('/api/next-month-trips')
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(message, code) {
						deferred.reject(message.error);
					});

				return deferred.promise;
			}
		};
	}]);
});
