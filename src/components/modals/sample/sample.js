( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .controller( 'SampleCtrl', [ '$uibModalInstance', 'items', SampleCtrl ] )

    .component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        controller : [ AddFormCtrl ]
    } );

    function SampleCtrl( $uibModalInstance, items ) {
        var vm = this;

        vm.items = items;
        vm.selected = {
            item : vm.items[0]
        };

        vm.ok = function() {
            $uibModalInstance.close( vm.selected.item );
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss( 'cancel' );
        };

    }

    function AddFormCtrl( $location, $uibModal, Schema, Table ) {
        var vm = this;

    }
} )();
