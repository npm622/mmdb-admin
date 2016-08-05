( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'newDeleteConfirm', {
        templateUrl : 'modals/new-delete-confirm/new-delete-confirm.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            item : '<'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                console.log( vm.item );

                vm.ok = function() {
                    modalInstance.close( vm.item );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( pk ) {
                    console.log( pk );
                }, function() {
                    console.log( 'aborting delete...' );
                } );
            }
        }
    } );
} )();
