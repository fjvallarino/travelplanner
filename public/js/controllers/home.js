define(['./module'], function (controllers) {
    'use strict';

    controllers.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'partials/home.tpl.html',
			controller: 'HomeController'
		});
    }]);

    controllers.controller('HomeController', ['$scope', '$location', function ($scope, $location) {

    }]);
});
