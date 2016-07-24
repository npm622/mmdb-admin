( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Table', [ '$http', '$q', 'mmdbAdmin', Table ] )

    function Table( $http, $q, mmdbAdmin ) {
        var webEndpoint = mmdbAdmin.schema.webEndpoint;

        return {
            fetchAll : function( table ) {
                var deferred = $q.defer();

                $http.get( webEndpoint + '/' + table.contextPath ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            }
        };
    }
} )();
