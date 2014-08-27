require.config({
	paths: {
		'underscore': '../libs/underscore/underscore',
		'angular': '../libs/angular/angular',
		'angular-bootstrap': '../libs/angular-bootstrap/ui-bootstrap-tpls',
		'angular-resource': '../libs/angular-resource/angular-resource',
		'angular-route': '../libs/angular-route/angular-route',
		'domReady': '../libs/requirejs-domready/domReady',
	},
	shim: {
		'underscore': {
            exports: '_'
        },
		'angular': {
			'exports': 'angular'
		},
		'angular-bootstrap': {
			deps: ['angular']
		},
		'angular-resource': {
			deps: ['angular']
		},
		'angular-route': {
			deps: ['angular']
		}
	},
	deps: [
		// Bootstrap application
		'./bootstrap'
	]
});
