( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( {
                        hello : 'world!'
                    } ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.json = itemJson;
                    console.log( 'deleting...' );
                    console.log( vm.json );
                }, function() {
                    console.log( 'aborting update...' );
                } );
            }

            function writeJson( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();
