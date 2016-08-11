( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'updateForm', {
        templateUrl : 'modals/update-form/update-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            table : '<',
            dto : '<',
            onUpdate : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( dto ) {
                    vm.onUpdate( {
                        dto : dto
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.dto );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }
        }
    } );
} )();