( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'mmdb.admin.templates', 'ui.bootstrap' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        vm.state = 'mmdbAdmin';
        vm.setState = function( state ) {
            vm.state = state;
        }

        vm.url = '#/mmdb-admin';
        vm.setUrl = function( url ) {
            vm.url = url;
        }

        vm.display = 'mmdb admin';
        vm.setDisplay = function( display ) {
            vm.display = display;
        }

        vm.page = {
            state : vm.state,
            url : vm.url,
            template : '<dashboard></dashboard>',
            display : vm.display
        }

        vm.$get = function() {
            return vm;
        };
    } );
} )();
