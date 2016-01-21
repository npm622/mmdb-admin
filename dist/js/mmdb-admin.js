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
		var eggcorns = [ {
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
		} ];
		
		var complexCggcorns = [ {
			id : '1',
			eggcorn : 'dummy data 1'
		}, {
			id : '2',
			eggcorn : 'dummy data 2'
		}, {
			id : '3',
			eggcorn : 'dummy data 3'
		} ];
		
		return {
			schema : schema,
			eggcorns : eggcorns,
			complexCggcorns : complexEggcorns,
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
		};
	}

	angular.module("mmdb.admin").run(["$templateCache", function($templateCache) {$templateCache.put("mmdb-admin-data-table.tmpl.html","<table class=\"table table-striped table-bordered table-hover table-sm\">\n    <thead>\n        <tr>\n            <th class=\"col-md-1\"></th>\n            <th class=\"col-md-1\"></th>\n            <th class=\"col-md-4\" ng-repeat=\"pk in mmdbAdminDataTable.activeTable.primaryKeys\">{{pk.sqlName}}</th>\n            <th class=\"col-md-5\" ng-repeat=\"col in mmdbAdminDataTable.activeTable.baseColumns\">{{col.sqlName}}</th>\n            <th class=\"col-md-1\" ng-repeat=\"blob in mmdbAdminDataTable.activeTable.blobColumns\">{{blob.sqlName}}</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td><a ng-click=\"\" class=\"btn btn-small btn-danger\"><span class=\"glyphicon glyphicon-remove-sign\"></span></a></td>\n            <td><a ng-click=\"\" class=\"btn btn-small btn-info\"><span class=\"glyphicon glyphicon-wrench\"></span></a></td>\n            <td ng-repeat=\"dataRow in mmdbAdminDataTable.activeData()\">{{dataRow}}</td>\n        </tr>\n    </tbody>\n</table>");
$templateCache.put("mmdb-admin-search-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-heading\">\n        search by <span class=\"dropdown\"> <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">{{mmdbAdminSearch.activeSearchMode}} <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n            <ul class=\"dropdown-menu\" role=\"menu\">\n                <li ng-repeat=\"searchMode in mmdbAdminSearch.searchModes\"><button class=\"btn btn-block btn-default\"\n                        ng-click=\"mmdbAdminSearch.select($index)\">{{searchMode}}</button></li>\n            </ul>\n        </span>\n    </div>\n    <div class=\"panel-body animate-switch-container\" ng-switch=\"mmdbAdminSearch.activeSearchMode\">\n        <div class=\"animate-switch\" ng-switch-when=\"id\">this will be the id search pane...</div>\n        <div class=\"animate-switch\" ng-switch-when=\"data\">...and this will be the data search pane</div>\n        <div class=\"animate-switch\" ng-switch-default>why am i here? how do i search by {{mmdbAdminSearch.activeSearchMode}}?</div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-status-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-body\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">status dashboard for {{mmdbAdminStatus.activeTable.sqlName}}</div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12\" ng-transclude></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-tables-panel.tmpl.html","<div class=\"big-row panel panel-stacked panel-success\">\n    <div class=\"panel-body\">\n        <div class=\"row\" ng-class=\"{spacer: $index > 0}\" ng-repeat=\"table in mmdbAdminTables.tables\">\n            <div class=\"col-md-12\">\n                <button class=\"btn btn-block btn-default\" ng-click=\"mmdbAdminTables.select($index)\">{{table.sqlName}}</button>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-tool-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-heading\">db schema: {{mmdbAdminTool.schemaName}}</div>\n    <div class=\"panel-body\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                active table: <a ng-click=\"\">{{mmdbAdminTool.activeTable.sqlName}}</a>\n            </div>\n        </div>\n        <div class=\"row spacer\">\n            <div class=\"col-md-12\">\n                <button class=\"btn btn-block btn-default\">add</button>\n            </div>\n        </div>\n        <div class=\"row spacer\">\n            <div class=\"col-md-6\">\n                <button class=\"btn btn-block btn-default\">import</button>\n            </div>\n            <div class=\"col-md-6\">\n                <button class=\"btn btn-block btn-default\">export</button>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin.tmpl.html","<div class=\"container-fluid\">\n    <div class=\"row spacer\">\n        <div class=\"col-md-2\">\n\n            <mmdb-admin-tool-panel schema-name=\"{{mmdbAdmin.schema.schemaName}}\" active-table=\"mmdbAdmin.activeTable\"></mmdb-admin-tool-panel>\n\n            <mmdb-admin-search-panel></mmdb-admin-search-panel>\n\n            <mmdb-admin-tables-panel tables=\"mmdbAdmin.schema.tables\" selection-made=\"mmdbAdmin.tableSelected\"></mmdb-admin-tables-panel>\n\n            <mmdb-admin-status-panel active-table=\"mmdbAdmin.activeTable\">{{mmdbAdmin.schema.webBaseEndpoint}}</mmdb-admin-status-panel>\n\n        </div>\n        <div class=\"col-md-10\">\n\n            <mmdb-admin-data-table active-table=\"mmdbAdmin.activeTable\"></mmdb-admin-data-table>\n\n        </div>\n    </div>\n</div>");}]);
}());
