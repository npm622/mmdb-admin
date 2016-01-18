(function() {
	'use strict';

	angular.module( 'mmdb.admin', [ 'ui.router' ] )
	
	.provider('mmdbAdminConfig', function(){
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

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdminConfig', 'MmdbAdmin', MmdbAdminCtrl ] );

	function MmdbAdmin(schema) {
		return {
			schema : schema
		}
	}

	function MmdbAdminCtrl(mmdbAdminConfig, MmdbAdmin) {
		var vm = this;
		
		vm.schema = mmdbAdminConfig.schema;
	}

	@@templateCache
}());
