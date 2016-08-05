( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Item', [ 'Schema', Item ] )

    function Item( Schema ) {
        function findColumn( columns, fieldName ) {
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
            convertDto : function( activeTableName, dto ) {
                var table = Schema.findTableByName( activeTableName );

                var item = {};

                for ( var prop in dto ) {
                    if ( dto.hasOwnProperty( prop ) ) {
                        var column = findColumn( table.columns, prop );
                        if ( column.jsonPath.includes( '.' ) ) {
                            if ( !item[table.pkKey] ) {
                                item[table.pkKey] = {};
                            }
                            item[table.pkKey][prop] = dto[prop];
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
