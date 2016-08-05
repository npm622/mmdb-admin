( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            onAdd : '&'
        },
        controller : function() {
            var vm = this;

            vm.dto = {};

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( payload ) {
                    vm.onAdd( {
                        dto : dto
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( dto );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }

            function convertDto( dto ) {
                var item = {};

                for ( var prop in dto ) {
                    if ( dto.hasOwnProperty( prop ) ) {
                        var column = findColumn( prop );
                        if ( column.jsonPath.includes( '.' ) ) {
                            if ( !item[vm.parent.activeTable.pkKey] ) {
                                item[vm.parent.activeTable.pkKey] = {};
                            }
                            item[vm.parent.activeTable.pkKey][prop] = dto[prop];
                        } else {
                            item[prop] = dto[prop];
                        }
                    }
                }

                return item;
            }

            function findColumn( fieldName ) {
                for ( var i = 0; i < vm.parent.activeTable.columns.length; i++ ) {
                    var col = vm.parent.activeTable.columns[i];
                    if ( col.fieldName === fieldName ) {
                        return col;
                    }
                }
            }

            function writeJson( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();
