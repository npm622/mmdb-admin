( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Item', [ 'Schema', Item ] )

    function Item( Schema ) {
        function findColumn( fieldName ) {
            for ( var i = 0; i < vm.parent.activeTable.columns.length; i++ ) {
                var col = vm.parent.activeTable.columns[i];
                if ( col.fieldName === fieldName ) {
                    return col;
                }
            }
        }

        return {
            determinePk : function( activeTableName, item ) {
                var table = Schema.findTableByName( activeTableName );

                // simple primary key -- return String
                if ( table.pks.length == 1 ) {
                    return item[table.pks[0]];
                }

                // compound primary key -- return "Map"
                var pk = {};
                for ( var i = 0; i < table.pks.length; i++ ) {
                    for ( var j = 0; j < table.columns.length; j++ ) {
                        var column = table.columns[j];

                        if ( table.pks[i] === column.sqlName ) {
                            pk[column.fieldName] = item[table.pkKey][column.fieldName];
                        }
                    }
                }
                return pk;
            },
            convertDto : function( dto ) {
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
        };
    }
} )();
