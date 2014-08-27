/**
 * Attach services to this module
 **/
define(['angular'], function (ng) {
	'use strict';
	
	return ng.module('app.services', ['ngRoute', 'ngResource']);
});
