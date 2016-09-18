( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Resource', [ 'Schema', Resource ] )

    function Resource( Schema ) {
        var collectPkCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'PRIMARY_KEY';
            } );
        };
        
        var collectBaseCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'BASE';
            } );
        };
        
        var collectDateAuditCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'DATE_AUDIT';
            } );
        };
        
        return {
            pkCols : collectPkCols,
            baseCols : collectBaseCols,
            dateAuditCols : collectDateAuditCols,
            determinePk : function( activeTableName, resource ) {
                var table = Schema.findTableByName( activeTableName );

                var pkCols = collectPkCols( table );

                // simple primary key -- return String
                if ( pkCols.length == 1 ) {
                    return resource[pkCols[0].fieldName];
                }

                // compound primary key -- return "Map"
                var pk = {};
                for ( var i = 0; i < pkCols.length; i++ ) {
                    for ( var j = 0; j < table.columns.length; j++ ) {
                        var column = table.columns[j];

                        if ( pkCols[i].name === column.name ) {
                            pk[column.fieldName] = resource[column.fieldName];
                        }
                    }
                }
                return pk;
            }
        };
    }
} )();
