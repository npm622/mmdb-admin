( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'ui.bootstrap', 'ui.router' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        this.$get = function() {
            return this;
        };
    } )

    .config( function config( $stateProvider ) {
        $stateProvider.state( 'mmdbAdmin', {
            url : '/mmdb-admin',
            template : '<p class="poc">hello.</p><dashboard></dashboard>',
            data : {
                pageTitle : 'mmdb admin'
            }
        } );
    } )

    .factory( 'MmdbAdmin', [ '$http', 'mmdbAdmin', MmdbAdmin ] )

    .component( 'dashboard', {
        templateUrl : 'dashboard.tmpl.html',
        bindings : {},
        controller : [ 'MmdbAdmin', DashboardCtrl ]
    } );

    function MmdbAdmin( $http, mmdbAdmin ) {
        console.log( 'factory' );
        console.log( mmdbAdmin.json );

        return {
            schema : mmdbAdmin.json
        };
    }

    function DashboardCtrl( Admin ) {
        var vm = this;

        vm.schema = Admin.schema;

        console.log( 'controller' );
        console.log( Admin.schema );
    }

    angular.module("mmdb.admin").run(["$templateCache", function($templateCache) {$templateCache.put("dashboard.tmpl.html","<div class=\"container\">\n    <div class=\"panel panel-success panel-inverse panel-admin\">\n        <pre>{{$ctrl.schema | json}}</pre>\n    </div>\n</div>");}]);
} )();
