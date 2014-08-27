/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';
    
	// app.run(function($rootScope, $location, $window, AuthenticationService) {
	// 	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
	// 		//redirect only if both isAuthenticated is false and no token is set
	// 		if (nextRoute != null && nextRoute.restricted && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
	// 			$location.path("/login");
	// 		}
	// 	});
	// });

    return app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    	$httpProvider.interceptors.push('TokenInterceptor');

    	$routeProvider.otherwise({ redirectTo: '/home' });
    }]);
});
