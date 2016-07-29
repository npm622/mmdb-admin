( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .controller( 'SampleCtrl', [ '$uibModalInstance', 'activeTable', SampleCtrl ] );

    function SampleCtrl( $uibModalInstance, activeTable ) {
        var vm = this;

        vm.activeTable = activeTable;
        vm.form = {};

        vm.$onInit = function() {
            console.log( 'on add form init...' );
            console.log( vm.activeTable );
            console.log( activeTable );
        }

        vm.ok = function() {
            $uibModalInstance.close( angular.toJson( vm.form ) );
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss( 'cancel' );
        };

    }
} )();
