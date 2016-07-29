( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.form = {};

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( vm.form ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.parent.addItem( itemJson );
                }, function() {
                    console.log( 'aborting add...' );
                } );
            }

            function writeJson( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();
