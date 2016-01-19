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
	
	.directive('mmdbAdminToolPanel', function(){
		return {
			restrict: 'E',
			templateUrl:'mmdb-admin-tool-panel.tmpl.html',
			scope: {
				activeTable: '=',
				schemaName: '@'
			},
			controller: 'MmdbAdminToolCtrl',
			controllerAs: 'mmdbAdminTool',
			bindToController: true
		}
	})
	
	.directive('mmdbAdminSearchPanel', function(){
		return {
			restrict: 'E',
			templateUrl:'mmdb-admin-search-panel.tmpl.html',
			scope: {
			},
			controller: 'MmdbAdminSearchCtrl',
			controllerAs: 'mmdbAdminSearch',
			bindToController: true
		}
	})
	
	.directive('mmdbAdminTablesPanel', function(){
		return {
			restrict: 'E',
			templateUrl:'mmdb-admin-tables-panel.tmpl.html',
			scope: {
				tables: '='
			},
			controller: 'MmdbAdminTablesCtrl',
			controllerAs: 'mmdbAdminTables',
			bindToController: true
		}
	})
	
	.directive('mmdbAdminStatusPanel', function(){
		return {
			restrict: 'E',
			templateUrl:'mmdb-admin-status-panel.tmpl.html',
			scope: {
				activeTable: '='
			},
			controller: 'MmdbAdminStatusCtrl',
			controllerAs: 'mmdbAdminStatus',
			bindToController: true,
			transclude: true
		}
	})

	.factory( 'MmdbAdmin', [ 'SCHEMA', MmdbAdmin ] )

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdminConfig', 'MmdbAdmin', MmdbAdminCtrl ] )

	.controller( 'MmdbAdminTablesCtrl', [ MmdbAdminTablesCtrl ] )

	.controller( 'MmdbAdminStatusCtrl', [ MmdbAdminStatusCtrl ] );

	function MmdbAdmin(schema) {
		return {
			schema : schema
		}
	}

	function MmdbAdminCtrl(mmdbAdminConfig, MmdbAdmin) {
		var vm = this;
		
		vm.schema = mmdbAdminConfig.schema;
	}
	
	function MmdbAdminToolCtrl() {
		var vm = this;
	}
	
	function MmdbAdminSearchCtrl() {
		var vm = this;
	}
	
	function MmdbAdminTablesCtrl() {
		var vm = this;
	}
	
	function MmdbAdminStatusCtrl() {
		var vm = this;
	}

	@@templateCache
}());
