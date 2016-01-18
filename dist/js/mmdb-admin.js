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

	angular.module("mmdb.admin").run(["$templateCache", function($templateCache) {$templateCache.put("mmdb-admin.tmpl.html","<div class=\"container-fluid\">\n    <div class=\"row spacer\">\n        <div class=\"col-md-2\">\n            <div class=\"panel panel-stacked panel-success\">\n                <div class=\"panel-heading\">table name</div>\n                <div class=\"panel-body\">\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">\n                            <button class=\"btn btn-block btn-default\">add</button>\n                        </div>\n                    </div>\n                    <div class=\"row spacer\">\n                        <div class=\"col-md-6\">\n                            <button class=\"btn btn-block btn-default\">import</button>\n                        </div>\n                        <div class=\"col-md-6\">\n                            <button class=\"btn btn-block btn-default\">export</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"panel panel-stacked panel-success\">\n                <div class=\"panel-heading\">search by ...</div>\n                <div class=\"panel-body\">search pane to be built</div>\n            </div>\n            <div class=\"big-row panel panel-stacked panel-success\">\n                <div class=\"panel-body\">\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">eggcorn</div>\n                    </div>\n                    <div class=\"row spacer\">\n                        <div class=\"col-md-12\">complex_eggcorn</div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"panel panel-stacked panel-success\">\n                <div class=\"panel-body\">\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">status dashboard to be built</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-10\">\n            <table class=\"table table-striped table-bordered table-hover table-sm\">\n                <thead>\n                    <tr>\n                        <th>#</th>\n                        <th>First Name</th>\n                        <th>Last Name</th>\n                        <th>Username</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <th scope=\"row\">1</th>\n                        <td>Mark</td>\n                        <td>Otto</td>\n                        <td>@mdo</td>\n                    </tr>\n                    <tr>\n                        <th scope=\"row\">2</th>\n                        <td>Jacob</td>\n                        <td>Thornton</td>\n                        <td>@fat</td>\n                    </tr>\n                    <tr>\n                        <th scope=\"row\">3</th>\n                        <td>Larry</td>\n                        <td>the Bird</td>\n                        <td>@twitter</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>");}]);
}());
