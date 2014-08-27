define(['./module'], function (services) {
	'use strict';

	services.factory('UserService', function($http, $q, $window) {
		return {
			login: function(username, password) {
				var deferred = $q.defer();

				$http.post('/api/login', { username: username, password: password })
					.success(function(data) {
						$window.sessionStorage.token = data.token;

						deferred.resolve(data);
					})
					.error(function(message, code) {
						deferred.reject(message);
					});

				return deferred.promise;
			},

			logout: function() {
				delete $window.sessionStorage.token;
			},

			register: function(username, password) {
				var deferred = $q.defer();

				$http.post('/api/register', { username: username, password: password })
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(message, code) {
						deferred.reject(message.error);
					});

				return deferred.promise;
			}
		};
	});

	services.factory('TokenInterceptor', function ($q, $window) {
		return {
			request: function (config) {
				config.headers = config.headers || {};

				if ($window.sessionStorage.token) {
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
				}
				return config;
			},

			response: function (response) {
				return response || $q.when(response);
			}
		};
	});
});
