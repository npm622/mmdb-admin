( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Table', [ '$http', '$q', 'Schema', 'Item', Table ] )

    function Table( $http, $q, Schema, Item ) {
        var webEndpoint = Schema.json.webEndpoint;
        
        function restPath(pk) {
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
            
            return restPath;
        }

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
                
                if (table.isAutoPk) {
                    $http.post( webEndpoint + '/' + table.contextPath, payload ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                } else {
                    $http.put( webEndpoint + '/' + table.contextPath + restPath(Item.determinePk(table, Angular.fromJson(payload))), payload ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                }

                return deferred.promise;
            },
            dropByPrimaryKey : function(table, pk) {
                console.log( 'deleting...' );
                console.log( pk );
                
                var deferred = $q.defer();
                
                $http.delete( webEndpoint + '/' + table.contextPath + restPath(pk) ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );
                
                return deferred.promise;
            }
        };
    }
} )();
