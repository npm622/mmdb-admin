( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'updateForm', {
        templateUrl : 'modals/update-form/update-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            item : '<'
        },
        controller : [ 'Item', function( Item ) {
            var vm = this;
            
            vm.dto = {};

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.dto = convertItem( vm.item );

                vm.ok = function() {
                    var result = {};
                    result.pk = Item.determinePk( vm.parent.activeTable.sqlName, vm.item );
                    result.payload = writeJson( convertDto( vm.dto ) );

                    modalInstance.close( result );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( result ) {
                    vm.parent.updateItem( result.pk, result.payload );
                }, function() {
                    console.log( 'aborting update...' );
                } );
            }

            function convertItem( item ) {
                var dto = {};

                for ( var i = 0; i < vm.parent.activeTable.columns; i++ ) {
                    var column = vm.parent.activeTable.columns[i];

                    if ( column.jsonPath.includes( '.' ) ) {
                        dto[column.fieldName] = item[vm.parent.activeTable.pkKey][column.fieldName];
                    } else {
                        dto[column.fieldName] = item[column.fieldName];
                    }
                }

                return dto;
            }

            function determinePk( item ) {
                return angular.toJson( item );
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
        } ]
    } );
} )();
