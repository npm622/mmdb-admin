(function() {
	'use strict';

	angular.module( 'mmdb.toolbar', [ 'ui.router' ] )

	.provider( 'mmdbToolbar', function() {

		this.setSchema = function(schema) {
			this.schema = schema;
		};

		this.$get = function() {
			return this;
		};
	} )

	.directive( 'mmdbToolbar', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-toolbar.tmpl.html',
			scope : {
				baseServiceEndpoint: '@'
			},
			controller : 'MmdbToolbarCtrl',
			controllerAs : 'mmdbToolbar',
			bindToController : true,
			transclude: true
		}
	} )

	.config( function config($stateProvider) {
		$stateProvider.state( 'mmdbAdmin', {
			url : '/mmdbAdmin',
			templateUrl : 'mmdb-admin.tmpl.html',
			controller : 'MmdbAdminCtrl',
			controllerAs : 'mmdbAdmin',
			data : {
				pageTitle : 'mmdbAdmin'
			}
		} );
	} )

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdmin', MmdbAdminCtrl ] );

	function MmdbAdminCtrl(mmdbAdmin) {
		var vm = this;

		vm.brand = mmdbToolbar.brand;
	}

	angular.module("mmdb.admin").run(["$templateCache", function($templateCache) {$templateCache.put("mmdb-admin.tmpl.html","<div class=\"container-fluid\">\n    <div class=\"row\">\n        <div class=\"col-md-2\">\n            sidebar action\n        </div>\n        <div class=\"col-md-10\">\n            dashboard action\n        </div>\n    </div>\n</div>");}]);
}());
