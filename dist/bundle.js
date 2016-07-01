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

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        bindings : {},
        controller : [ 'tableMapper', DashboardCtrl ]
    } );

    function DashboardCtrl( tableMapper ) {
        var vm = this;

        vm.schema = tableMapper.schema;

        tableMapper.fetchAll( vm.schema.tables[0] ).then( function( results ) {
            console.log( results );
        }, function() {
        } );
    }
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
                return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath ) );
            },
            fetchByPk : function( table, pk ) {
                if ( table.isSimplePk ) {
                    return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath + '/' + pk ) );
                } else {
                    var params = {};
                    for ( var i = 0; i < table.pks.length; i++ ) {
                        var name = table.pks[i];
                        params[name] = pk[name];
                    }

                    return customPromise( $http.get( schema.webEndpoint + '/' + table.contextPath + '/pk' ), {
                        params : params
                    } );
                }
            },
            findTable : function( sqlName ) {
                for ( var i = 0; i < schema.tables.length; i++ ) {
                    var table = schema.tables[i];
                    if ( table.sqlName === sqlName ) {
                        return table;
                    }
                }
                return undefined;
            }
        };

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

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"col-md-3\">\n            <div class=\"row\">\n                <p>sidebar</p>\n            </div>\n        </div>\n        <div class=\"col-md-9\">\n            <div class=\"row\">\n                <p>main panel</p>\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-success panel-inverse panel-admin\">\n        <pre>{{$ctrl.schema | json}}</pre>\n    </div>\n</div>");}]);})();