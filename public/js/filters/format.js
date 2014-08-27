define(['./module'], function (filters) {
	'use strict';

	filters.filter('limitText', ['$log', function ($log) {
		return function (text, maxLength) {
			var lineBreak = text.indexOf("</br>");
			
			lineBreak = lineBreak >= 0 && lineBreak < maxLength ? lineBreak : maxLength;
	
			if(lineBreak < text.length)
				return text.substring(0, lineBreak) + "...";
			else
				return text;
		};
	}]);

	filters.filter('daysToTrip', ['$log', function ($log) {
		return function (date) {
			var now = new Date();
			var tripDate = new Date(date);

			if(!(tripDate instanceof Date && !isNaN(tripDate.valueOf())) || now > tripDate) {
				return "";
			}
			else {
				return Math.ceil((tripDate - now) / (1000 * 3600 * 24));
			}
		};
	}]);
});
