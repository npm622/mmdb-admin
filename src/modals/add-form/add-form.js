( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^^dashboard'
        },
        bindings : {
            table : '<',
            onAdd : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( resource ) {
                    vm.onAdd( {
                        resource : resource
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.resource );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }

            vm.isColEditable = function( col ) {
                var isPrimaryKey = col.type === 'PRIMARY_KEY' && vm.table.isManagedResource;
                var isDateAudit = col.type === 'DATE_AUDIT';
                return !isPrimaryKey && !isDateAudit;
            }
        }
    } );
} )();
