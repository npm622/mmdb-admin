(function() {
	'use strict';

	angular.module( 'mmdb.admin', [ 'app', 'ui.router' ] )
	
	.provider('mmdbAdminProvider', function(){
		this.setSchema = function(SCHEMA) {
			this.schema = SCHEMA;
		}

		this.$get = function() {
			return this;
		};
	})

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

	.factory( 'MmdbAdmin', [ 'SCHEMA', MmdbAdmin ] )

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdminProvider', 'MmdbAdmin', MmdbAdminCtrl ] );

	function MmdbAdmin(schema) {
		return {
			schema : schema
		}
	}

	function MmdbAdminCtrl(mmdbAdminProvider, MmdbAdmin) {
		var vm = this;
		
		vm.schema = mmdbAdminProvider.schema;
	}

	@@templateCache
}());
