( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard' // this is to provide the modal instance
        },
        bindings : {
            table : '<',
            item : '<',
            onDelete : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( item ) {
                    vm.onDelete( {
                        item : item
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.item );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }
        }
    } );
} )();
