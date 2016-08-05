( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Item', [ 'Schema', Item ] )

    function Item( Schema ) {
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
            }
        };
    }
} )();
