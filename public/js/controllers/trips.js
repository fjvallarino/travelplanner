define(['./module'], function (controllers) {
    'use strict';

    function valueOrEmpty(value) {
        if(typeof(value) == 'undefined' || !value)
            return '';
        else
            return value;
    }

    controllers.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.when('/trips/new', {
			templateUrl: 'partials/trips/trips-edit.tpl.html',
			controller: 'TripsEditController',
			mode: 'create'
		});

		$routeProvider.when('/trips/edit/:id', {
			templateUrl: 'partials/trips/trips-edit.tpl.html',
			controller: 'TripsEditController',
			mode: 'update'
		});

		$routeProvider.when('/trips/delete/:id', {
			templateUrl: 'partials/trips/trips-view.tpl.html',
			controller: 'TripsEditController',
			mode: 'delete'
		});

		$routeProvider.when('/trips/view/:id', {
			templateUrl: 'partials/trips/trips-view.tpl.html',
			controller: 'TripsEditController',
			mode: 'view'
		});

		$routeProvider.when('/trips', {
			templateUrl: 'partials/trips/trips-list.tpl.html',
			controller: 'TripsListController'
		});

        $routeProvider.when('/trips-next-month', {
            templateUrl: 'partials/trips/trips-next-month.tpl.html',
            controller: 'TripsNextMonthController'
        });
    }]);

    controllers.controller('TripsListController', ['$scope', '$location', '$window', 'TripService',  'UserService', function ($scope, $location, $window, TripService, UserService) {
    	$scope.trips = TripService.query();
        $scope.searchCriteria = {};

    	$scope.create = function() {
    		$location.path('/trips/new');
    	};

    	$scope.edit = function(trip) {
    		$location.path('/trips/edit/' + trip._id);
    	};

    	$scope.delete = function(trip) {
    		$location.path('/trips/delete/' + trip._id);
    	};

    	$scope.view = function(trip) {
    		$location.path('/trips/view/' + trip._id);
    	};

        $scope.search = function() {
            $scope.trips = TripService.query($scope.searchCriteria);
        };

        $scope.clear = function() {
            $scope.searchCriteria = {};
        };

        $scope.tripsNextMonth = function() {
            $location.path('/trips-next-month');
        };

        $scope.logout = function() {
            UserService.logout();

            $location.path('/');
        };

        $scope.dateOptions = {
            'starting-day': 1
        };

        $scope.openFromDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            
            $scope.openedFromDate = true;
        };
        
        $scope.openToDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            
            $scope.openedToDate = true;
        };
    }]);

    controllers.controller('TripsEditController', ['$scope', '$location', '$route', 'TripService', function ($scope, $location, $route, TripService) {
    	$scope.mode = $route.current.mode;
    	$scope.errorMessage = null;
    	$scope.trip = $scope.mode != 'create' ? TripService.get($route.current.params.id) : {};

    	$scope.create = function() {
    		TripService.create($scope.trip)
    			.then(function(res) {
    				$location.path('/trips');
    			},
    			function(err) {
    				$scope.errorMessage = err;
    			});
    	};

    	$scope.update = function() {
    		TripService.update($scope.trip)
    			.then(function(res) {
    				$location.path('/trips');
    			},
    			function(err) {
    				$scope.errorMessage = err;
    			});    		
    	};

    	$scope.delete = function() {
    		TripService.delete($scope.trip)
    			.then(function(res) {
    				$location.path('/trips');
    			},
    			function(err) {
    				$scope.errorMessage = err;
    			});
    	};

    	$scope.cancel = function() {
    		$location.path('/trips');
    	};

		$scope.dateOptions = {
			'starting-day': 1
		};
		
		$scope.openStartDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			
			$scope.openedStartDate = true;
		};
		
		$scope.openEndDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			
			$scope.openedEndDate = true;
		};
    }]);

    controllers.controller('TripsNextMonthController', ['$scope', '$location', '$window', 'TripService',  function ($scope, $location, $window, TripService) {
        TripService.tripsNextMonth().then(function(data) {
            $scope.trips = data;
        });

        $scope.print = function() {
            $window.print();
        };

        $scope.cancel = function() {
            $location.path('/trips');
        };
    }]);
});
