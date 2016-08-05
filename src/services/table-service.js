( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Table', [ '$http', '$q', 'Schema', Table ] )

    function Table( $http, $q, Schema ) {
        var webEndpoint = Schema.json.webEndpoint;

        return {
            fetchAll : function( table ) {
                var deferred = $q.defer();

                $http.get( webEndpoint + '/' + table.contextPath ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            keep : function( table, payload ) {
                console.log( 'adding...' );
                console.log( payload );
                
                var deferred = $q.defer();

                $http.post( webEndpoint + '/' + table.contextPath, payload ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            dropByPrimaryKey : function(table, pk) {
                console.log( 'deleting...' );
                console.log( pk );
                
                var restPath = '';
                if (typeof pk === 'object') {
                    for (var property in pk) {
                        if (pk.hasOwnProperty(property)) {
                            restPath += '/' + property + '/' + pk[property];
                        }
                    }
                } else {
                    restPath = '/' + pk;
                }
                
                var deferred $q.defer();
                
                $http.delete( webEndpoint + '/' + table.contextPath + restPath ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );
                
                return deferred.promise;
            }
        };
    }
} )();
