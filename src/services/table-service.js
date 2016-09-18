( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Table', [ '$http', '$q', 'Schema', 'Resource', Table ] )

    function Table( $http, $q, Schema, Resource ) {
        var applicationEndpoint = Schema.json.applicationEndpoint;

        function restPath( pk ) {
            var restPath = '';
            if ( typeof pk === 'object' ) {
                for ( var property in pk ) {
                    if ( pk.hasOwnProperty( property ) ) {
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

                $http.get( applicationEndpoint + '/' + table.requestMapping ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            keep : function( table, resource ) {
                var deferred = $q.defer();

                if ( table.isManagedResource ) {
                    $http.post( applicationEndpoint + '/' + table.requestMapping, angular.toJson( resource ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                } else {
                    $http.put( applicationEndpoint + '/' + table.requestMapping + restPath( Resource.determinePk( table.name, resource ) ), angular.toJson( resource ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                }

                return deferred.promise;
            },
            modify : function( table, resource, pk ) {
                var deferred = $q.defer();

                $http.put( applicationEndpoint + '/' + table.requestMapping + restPath( pk ), resource ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            dropByPrimaryKey : function( table, pk ) {
                var deferred = $q.defer();

                 $http.delete( applicationEndpoint + '/' + table.requestMapping + restPath( pk ) ).then( function( response ) {
                     deferred.resolve( response.data );
                 }, function() {
                     deferred.reject();
                 } );

                return deferred.promise;
            }
        };
    }
} )();
