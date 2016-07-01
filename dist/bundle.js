( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'mmdb.admin.templates', 'ui.bootstrap', 'ui.router' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        vm.searchModes = {
            ALL : 'all',
            PK : 'pk'
        };

        vm.$get = function() {
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
    } );
} )();

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

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        bindings : {},
        controller : [ 'tableMapper', DashboardCtrl ]
    } );

    function DashboardCtrl( tableMapper ) {
        var vm = this;

        vm.schema = tableMapper.schema;
    }
} )();

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"col-md-3\">\n            <div class=\"row\">\n                <p>sidebar</p>\n            </div>\n        </div>\n        <div class=\"col-md-9\">\n            <div class=\"row\">\n                <p>main panel</p>\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-success panel-inverse panel-admin\">\n        <pre>{{$ctrl.schema | json}}</pre>\n    </div>\n</div>");}]);})();