( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        replace : true,
        bindins : {
            activeTable : '<'
        },
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.activeTable = activeTable;
            vm.form = {};

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
    } )

    .controller( 'AddFormCtrl', [ '$uibModalInstance', 'activeTable', AddFormCtrl ] );

    function AddFormCtrl( $uibModalInstance, activeTable ) {
        var vm = this;

        vm.$onInit = function() {
            console.log( 'on add form init...' );
            console.log( vm.activeTable );
            console.log( activeTable );
        }

        vm.ok = function() {
            $uibModalInstance.close( angular.toJson( vm.form ) );
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss( 'cancel' );
        };

    }
} )();
