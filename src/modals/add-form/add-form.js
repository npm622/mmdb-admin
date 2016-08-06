( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            table : '<',
            onAdd : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( dto ) {
                    vm.onAdd( {
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
