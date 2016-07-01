( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'tableMapper', [ '$http', '$q', 'mmdbAdmin', tableMapper ] )

    function tableMapper( $http, $q, provider ) {
        var schema = provider.json;

        return {
            schema : schema,
            fetchAll : function( table ) {
                return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath ) );
            },
            fetchByPk : function( table, pk ) {
                if ( table.isSimplePk ) {
                    return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath + '/' + pk ) );
                } else {
                    return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath + '/pk', {
                        params : buildRequestParams( table, pk )
                    } ) );
                }
            },
            findTable : function( sqlName ) {
                return findTableByName( sqlName );
            }
        };

        function buildRequestParams( table, pk ) {
            var params = {};
            for ( var i = 0; i < table.pks.length; i++ ) {
                var name = convertSqlColumnToFieldName( table, table.pks[i] );
                params[name] = pk[name];
            }
            return params;
        }

        function convertSqlColumnToFieldName( table, columnName ) {
            for ( var i = 0; i < table.columns.length; i++ ) {
                var column = table.columns[i];
                if ( column.sqlName === columnName ) {
                    return column.fieldName;
                }
            }
            return undefined;
        }

        function findTableByName( sqlName ) {
            for ( var i = 0; i < schema.tables.length; i++ ) {
                var table = schema.tables[i];
                if ( table.sqlName === sqlName ) {
                    return table;
                }
            }
            return undefined;
        }

        function customPromise( promise ) {
            var deferred = $q.defer();

            promise.then( function( response ) {
                deferred.resolve( response.data );
            }, function() {
                deferred.reject();
            } );

            return deferred.promise;
        }
    }
} )();
