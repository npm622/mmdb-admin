( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'ui.bootstrap', 'ui.router' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        this.$get = function() {
            return this;
        };
    } )

    .config( function config( $stateProvider ) {
        $stateProvider.state( 'mmdbAdmin', {
            url : '/mmdb-admin',
            template : '<dashboard></dashboard>',
            data : {
                pageTitle : 'mmdb admin'
            }
        } );
    } )

    .factory( 'MmdbAdmin', [ '$http', '$q', 'mmdbAdmin', MmdbAdmin ] )

    .component( 'dashboard', {
        templateUrl : 'dashboard.tmpl.html',
        bindings : {},
        controller : [ 'MmdbAdmin', DashboardCtrl ]
    } );

    function MmdbAdmin( $http, $q, provider ) {
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

    function DashboardCtrl( Admin ) {
        var vm = this;

        vm.schema = Admin.schema;
    }

    // @@templateCache
} )();
