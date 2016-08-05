( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            itemToDelete : '<'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( determinePk( 'pk' ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( pk ) {
                    vm.parent.deleteItem( pk );
                }, function() {
                    console.log( 'aborting delete...' );
                } );
            }

            function determinePk( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();
