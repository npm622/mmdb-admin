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
				tables: '=',
				selectionMade: '&'
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
	
	.directive('mmdbAdminTablePanel', function(){
		return {
			restrict: 'E',
			templateUrl:'mmdb-admin-table-panel.tmpl.html',
			scope: {
				activeTable: '='
			},
			controller: 'MmdbAdminTableCtrl',
			controllerAs: 'mmdbAdminTable',
			bindToController: true
		}
	})

	.factory( 'MmdbAdmin', [ 'SCHEMA', MmdbAdmin ] )

	.controller( 'MmdbAdminCtrl', [ 'mmdbAdminConfig', 'MmdbAdmin', MmdbAdminCtrl ] )

	.controller( 'MmdbAdminToolCtrl', [ MmdbAdminToolCtrl ] )

	.controller( 'MmdbAdminSearchCtrl', [ MmdbAdminSearchCtrl ] )

	.controller( 'MmdbAdminTablesCtrl', [ MmdbAdminTablesCtrl ] )

	.controller( 'MmdbAdminStatusCtrl', [ MmdbAdminStatusCtrl ] )

	.controller( 'MmdbAdminTableCtrl', [ MmdbAdminTableCtrl ] );

	function MmdbAdmin(schema) {
		return {
			schema : schema
		}
	}

	function MmdbAdminCtrl(mmdbAdminConfig, MmdbAdmin) {
		var vm = this;
		
		vm.schema = mmdbAdminConfig.schema;
		
		vm.activeTable = vm.schema.tables[0];
		
		vm.tableSelected = function(selection) {
			if (selection.sqlName == vm.activeTable.sqlName) {
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
		
		vm.searchModes = ['id', 'data'];
		
		vm.activeSearchMode = vm.searchModes[0];
		
		vm.select = function(idx) {
			var selection = vm.searchModes[idx];
			if (selection == vm.activeSearchMode) {
				return;
			}
			vm.activeSearchMode = selection; 
		}
	}
	
	function MmdbAdminTablesCtrl() {
		var vm = this;
		
		vm.select = function(idx) {
			vm.selectionMade()(vm.tables[idx]);
		}
	}
	
	function MmdbAdminStatusCtrl() {
		var vm = this;
	}
	
	function MmdbAdminTableCtrl() {
		var vm = this;
		console.log('inside mmdb admin table');
		console.log(vm.activeTable);
	}

	angular.module("mmdb.admin").run(["$templateCache", function($templateCache) {$templateCache.put("mmdb-admin-search-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-heading\">\n        search by <span class=\"dropdown\"> <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">{{mmdbAdminSearch.activeSearchMode}} <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n            <ul class=\"dropdown-menu\" role=\"menu\">\n                <li ng-repeat=\"searchMode in mmdbAdminSearch.searchModes\"><button class=\"btn btn-block btn-default\"\n                        ng-click=\"mmdbAdminSearch.select($index)\">{{searchMode}}</button></li>\n            </ul>\n        </span>\n    </div>\n    <div class=\"panel-body animate-switch-container\" ng-switch=\"mmdbAdminSearch.activeSearchMode\">\n        <div class=\"animate-switch\" ng-switch-when=\"id\">this will be the id search pane...</div>\n        <div class=\"animate-switch\" ng-switch-when=\"data\">...and this will be the data search pane</div>\n        <div class=\"animate-switch\" ng-switch-default>why am i here? how do i search by {{mmdbAdminSearch.activeSearchMode}}?</div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-status-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-body\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">status dashboard for {{mmdbAdminStatus.activeTable.sqlName}}</div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12\" ng-transclude></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-table-panel.tmpl.html","<table class=\"table table-striped table-bordered table-hover table-sm\">\n    <thead>\n        <tr>\n            <th>#</th>\n            <th>First Name</th>\n            <th>Last Name</th>\n            <th>Username</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <th scope=\"row\">1</th>\n            <td>Mark</td>\n            <td>Otto</td>\n            <td>@mdo</td>\n        </tr>\n        <tr>\n            <th scope=\"row\">2</th>\n            <td>Jacob</td>\n            <td>Thornton</td>\n            <td>@fat</td>\n        </tr>\n        <tr>\n            <th scope=\"row\">3</th>\n            <td>Larry</td>\n            <td>the Bird</td>\n            <td>@twitter</td>\n        </tr>\n    </tbody>\n</table>");
$templateCache.put("mmdb-admin-tables-panel.tmpl.html","<div class=\"big-row panel panel-stacked panel-success\">\n    <div class=\"panel-body\">\n        <div class=\"row\" ng-class=\"{spacer: $index > 0}\" ng-repeat=\"table in mmdbAdminTables.tables\">\n            <div class=\"col-md-12\">\n                <button class=\"btn btn-block btn-default\" ng-click=\"mmdbAdminTables.select($index)\">{{table.sqlName}}</button>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin-tool-panel.tmpl.html","<div class=\"panel panel-stacked panel-success\">\n    <div class=\"panel-heading\">db schema: {{mmdbAdminTool.schemaName}}</div>\n    <div class=\"panel-body\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                active table: <a ng-click=\"\">{{mmdbAdminTool.activeTable.sqlName}}</a>\n            </div>\n        </div>\n        <div class=\"row spacer\">\n            <div class=\"col-md-12\">\n                <button class=\"btn btn-block btn-default\">add</button>\n            </div>\n        </div>\n        <div class=\"row spacer\">\n            <div class=\"col-md-6\">\n                <button class=\"btn btn-block btn-default\">import</button>\n            </div>\n            <div class=\"col-md-6\">\n                <button class=\"btn btn-block btn-default\">export</button>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("mmdb-admin.tmpl.html","<div class=\"container-fluid\">\n    <div class=\"row spacer\">\n        <div class=\"col-md-2\">\n\n            <mmdb-admin-tool-panel schema-name=\"{{mmdbAdmin.schema.schemaName}}\" active-table=\"mmdbAdmin.activeTable\"></mmdb-admin-tool-panel>\n\n            <mmdb-admin-search-panel></mmdb-admin-search-panel>\n\n            <mmdb-admin-tables-panel tables=\"mmdbAdmin.schema.tables\" selection-made=\"mmdbAdmin.tableSelected\"></mmdb-admin-tables-panel>\n\n            <mmdb-admin-status-panel active-table=\"mmdbAdmin.activeTable\">{{mmdbAdmin.schema.webBaseEndpoint}}</mmdb-admin-status-panel>\n\n        </div>\n        <div class=\"col-md-10\">\n\n            <mmdb-admin-table-panel active-table=\"mmdbAdmin.activeTable\"></mmdb-admin-table-panel>\n\n        </div>\n    </div>\n</div>");}]);
}());
