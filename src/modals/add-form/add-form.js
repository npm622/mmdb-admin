( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.dto = {};

            vm.add = function() {
                console.log( 'adding...' );
                console.log( vm.dto );
            }

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( convertDto( vm.dto ) ) );
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

            function convertDto( dto ) {
                var item = {};

                for ( var prop in dto ) {
                    if ( dto.hasOwnProperty( prop ) ) {
                        var column = findColumn( prop );
                        if ( column.jsonPath.contains( '.' ) ) {
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
