define(['./module'], function (controllers) {
	'use strict';

    controllers.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'partials/users/login.tpl.html',
			controller: 'LoginController'
		});

		$routeProvider.when('/register', {
			templateUrl: 'partials/users/register.tpl.html',
			controller: 'RegisterController'
		});

		$routeProvider.when('/register-success', {
			templateUrl: 'partials/users/register-success.tpl.html',
			controller: 'RegisterController'
		});
    }]);

    controllers.controller('LoginController', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
    	$scope.user = {};
    	$scope.errorMessage = null;

    	$scope.login = function() {
    		var user = $scope.user;

    		UserService.login(user.username, user.password)
    			.then(function(data) {
    				$location.path('/trips');
    			}, function(error) {
                    $scope.errorMessage = error.error;
    			});
    	};

    	$scope.logout = function() {
    		UserService.logout();

    		$location.path('/');
    	};

    	$scope.cancel = function() {
    		$location.path('/');
    	};
    }]);

    controllers.controller('RegisterController', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
    	$scope.user = {};
    	$scope.errorMessage = null;

    	$scope.register = function() {
    		var user = $scope.user;

            if(user.password != user.passwordConfirmation) {
                $scope.errorMessage = 'Password and confirmation do not match';
            }
            else {
                UserService.register(user.username, user.password)
                    .then(function(data) {
                        $location.path('/register-success');
                    }, function(error) {
                        $scope.errorMessage = error;
                    });                
            }
    	};

    	$scope.login = function() {
    		$location.path('/login');
    	};

    	$scope.cancel = function() {
    		$location.path('/');
    	};
    }]);
});
