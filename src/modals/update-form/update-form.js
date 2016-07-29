( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'updateForm', {
        templateUrl : 'modals/update-form/update-form.html',
        replace : true,
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( vm.item ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.json = itemJson;
                    console.log( 'updating...' );
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
