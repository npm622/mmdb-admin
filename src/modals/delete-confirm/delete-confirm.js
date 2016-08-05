( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            item : '<',
            onDelete : '&'
        },
        controller : [ 'Item', function( Item ) {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( Item.determinePk( vm.parent.activeTable.sqlName, vm.item ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( pk ) {
                    vm.onDelete( {
                        pk : pk
                    } );
                }, function() {
                    // do nothing
                } );
            }
        } ]
    } );
} )();
