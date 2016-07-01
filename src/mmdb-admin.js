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

    .factory( 'MmdbAdmin', [ '$http', 'mmdbAdminProvider', MmdbAdmin ] )

    .component( 'dashboard', {
        templateUrl : 'dashboard.tmpl.html',
        bindings : {},
        controller : [ 'MmdbAdmin', DashboardCtrl ]
    } );

    function MmdbAdmin( $http, mmdbAdminProvider ) {
        console.log( 'factory' );
        console.log( mmdbAdminProvider.json );

        return {
            schema : mmdbAdminProvider.json
        };
    }

    function DashboardCtrl( Admin ) {
        var vm = this;

        vm.schema = Admin.schema;

        console.log( 'controller' );
        console.log( Admin.schema );
    }

    @@templateCache
} )();
