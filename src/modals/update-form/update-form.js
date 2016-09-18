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
            resource : '<',
            onUpdate : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( resource ) {
                    vm.onUpdate( {
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
            
            vm.isPkCol = function(col) {
                return col.type === 'PRIMARY_KEY';
            }

            vm.isColEditable = function( col ) {
                var isPrimaryKey = col.type === 'PRIMARY_KEY';
                var isDateAudit = col.type === 'DATE_AUDIT';
                return !isPrimaryKey && !isDateAudit;
            }
        }
    } );
} )();
