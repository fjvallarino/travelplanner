/**
 * Loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define([
    'angular',
    'angular-bootstrap',
    'angular-resource',
    'angular-route',
    './services/index',
    './filters/index',
    './directives/index',
    './controllers/index'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers',
        'ngRoute'
    ]);
});
