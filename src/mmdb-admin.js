(function() {
	'use strict';

	angular.module( 'mmdb.admin', [ 'ui.router' ] )

	.provider( 'mmdbAdminConfig', function() {
		this.setSchema = function(SCHEMA) {
			this.schema = SCHEMA;
		}

		this.$get = function() {
			return this;
		};
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

	.directive( 'mmdbAdminToolPanel', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-admin-tool-panel.tmpl.html',
			scope : {
				activeTable : '=',
				schemaName : '@'
			},
			controller : 'MmdbAdminToolCtrl',
			controllerAs : 'mmdbAdminTool',
			bindToController : true
		}
	} )

	.directive( 'mmdbAdminSearchPanel', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-admin-search-panel.tmpl.html',
			scope : {},
			controller : 'MmdbAdminSearchCtrl',
			controllerAs : 'mmdbAdminSearch',
			bindToController : true
		}
	} )

	.directive( 'mmdbAdminTablesPanel', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-admin-tables-panel.tmpl.html',
			scope : {
				tables : '=',
				selectionMade : '&'
			},
			controller : 'MmdbAdminTablesCtrl',
			controllerAs : 'mmdbAdminTables',
			bindToController : true
		}
	} )

	.directive( 'mmdbAdminStatusPanel', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-admin-status-panel.tmpl.html',
			scope : {
				activeTable : '='
			},
			controller : 'MmdbAdminStatusCtrl',
			controllerAs : 'mmdbAdminStatus',
			bindToController : true,
			transclude : true
		}
	} )

	.directive( 'mmdbAdminDataTable', function() {
		return {
			restrict : 'E',
			templateUrl : 'mmdb-admin-data-table.tmpl.html',
			scope : {
				activeTable : '='
			},
			controller : 'MmdbAdminDataTableCtrl',
			controllerAs : 'mmdbAdminDataTable',
			bindToController : true
		}
	} )

	.factory( 'MmdbAdmin', [ 'SCHEMA', MmdbAdmin ] )

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdminConfig', 'MmdbAdmin', MmdbAdminCtrl ] )

	.controller( 'MmdbAdminToolCtrl', [ MmdbAdminToolCtrl ] )

	.controller( 'MmdbAdminSearchCtrl', [ MmdbAdminSearchCtrl ] )

	.controller( 'MmdbAdminTablesCtrl', [ MmdbAdminTablesCtrl ] )

	.controller( 'MmdbAdminStatusCtrl', [ MmdbAdminStatusCtrl ] )

	.controller( 'MmdbAdminDataTableCtrl', [ 'MmdbAdmin', MmdbAdminDataTableCtrl ] );

	function MmdbAdmin(schema) {
		return {
			schema : schema,
			eggcorns : [ {
				id : '1',
				eggcorn : 'dummy data 1'
			}, {
				id : '2',
				eggcorn : 'dummy data 2'
			}, {
				id : '3',
				eggcorn : 'dummy data 3'
			}, {
				id : '4',
				eggcorn : 'dummy data 4'
			}, {
				id : '5',
				eggcorn : 'dummy data 5'
			} ],
			complexCggcorns : [ {
				id : '1',
				eggcorn : 'dummy data 1'
			}, {
				id : '2',
				eggcorn : 'dummy data 2'
			}, {
				id : '3',
				eggcorn : 'dummy data 3'
			} ],
			activeTableData : function(activeTable) {
				switch ( activeTable.sqlName ) {
				case 'eggcorn':
					return eggcorns;
				case 'complex_eggcorn':
					return complexEggcorns;
				default:
					return [];
				}
			}
		}
	}

	function MmdbAdminCtrl(mmdbAdminConfig, MmdbAdmin) {
		var vm = this;

		vm.schema = mmdbAdminConfig.schema;

		vm.activeTable = vm.schema.tables[0];

		vm.tableSelected = function(selection) {
			if ( selection.sqlName == vm.activeTable.sqlName ) {
				return;
			}
			vm.activeTable = selection;
		}
	}

	function MmdbAdminToolCtrl() {
		var vm = this;
	}

	function MmdbAdminSearchCtrl() {
		var vm = this;

		vm.searchModes = [ 'id', 'data' ];

		vm.activeSearchMode = vm.searchModes[0];

		vm.select = function(idx) {
			var selection = vm.searchModes[idx];
			if ( selection == vm.activeSearchMode ) {
				return;
			}
			vm.activeSearchMode = selection;
		}
	}

	function MmdbAdminTablesCtrl() {
		var vm = this;

		vm.select = function(idx) {
			vm.selectionMade()( vm.tables[idx] );
		}
	}

	function MmdbAdminStatusCtrl() {
		var vm = this;
	}

	function MmdbAdminDataTableCtrl(MmdbAdmin) {
		var vm = this;
		console.log( 'inside mmdb admin table' );
		console.log( vm.activeTable );

		vm.activeData = function() {
			return MmdbAdmin.activeTableData( vm.activeTable );
		}
	}

	// @@templateCache
}());
