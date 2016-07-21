( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'mmdb.admin.templates', 'ui.bootstrap', 'ui.router' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        vm.page = {
            state : 'mmdbAdmin',
            url : '#/mmdb-admin',
            display : 'mmdb admin',
            template : '<dashboard></dashboard>'
        };

        vm.$get = function() {
            return vm;
        };
    } );
} )();
