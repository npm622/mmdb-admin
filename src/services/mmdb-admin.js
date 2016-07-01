( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'tableMapper', [ '$http', '$q', 'mmdbAdmin', tableMapper ] )

    function tableMapper( $http, $q, provider ) {
        var schema = provider.json;

        return {
            schema : schema,
            fetchAll : function( table ) {
                return handlePromiseDelivery( $http.get( schema.webEndpoint + '/' + table.contextPath ) );
            }
        };

        function handlePromiseDelivery( promise ) {
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
