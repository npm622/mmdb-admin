( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        bindings : {
            activeTable : '<'
        },
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            console.log( vm.activeTable );

            vm.form = {};

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                console.log( vm.activeTable );

                vm.ok = function() {
                    modalInstance.close( writeJson( vm.item ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.json = itemJson;
                    console.log( 'adding...' );
                    console.log( vm.json );
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
