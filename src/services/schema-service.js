( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Schema', [ 'mmdbAdmin', Schema ] )

    function Schema( mmdbAdmin ) {
        var json = mmdbAdmin.json;

        return {
            json : json,
            findTableByName : function( sqlName ) {
                return findTableByName( sqlName );
            }
        };

        function findTableByName( sqlName ) {
            for ( var i = 0; i < json.tables.length; i++ ) {
                var table = json.tables[i];
                if ( table.sqlName === sqlName ) {
                    return table;
                }
            }
            return undefined;
        }
    }
} )();
