( function() {
    'use strict';

    angular.module( 'mmdb.admin', [ 'mmdb.admin.templates', 'ui.bootstrap' ] )

    .provider( 'mmdbAdmin', function() {
        var vm = this;

        vm.setJson = function( json ) {
            vm.json = json;
        };

        vm.state = 'mmdbAdmin';
        vm.setState = function( state ) {
            vm.state = state;
        }

        vm.url = '#/mmdb-admin';
        vm.setUrl = function( url ) {
            vm.url = url;
        }

        vm.display = 'mmdb admin';
        vm.setDisplay = function( display ) {
            vm.display = display;
        }

        vm.page = {
            state : vm.state,
            url : vm.url,
            template : '<dashboard></dashboard>',
            display : vm.display
        }

        vm.$get = function() {
            return vm;
        };
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

        tableMapper.fetchByPk( vm.schema.tables[4], {
            customerId : "02de345a-72df-4677-be12-b867c58d9b51",
            sandwichId : "2cb6d513-06a3-4aa4-93bb-e53d279d95cb"
        } ).then( function( results ) {
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

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n  <div class=\"col-md-1 dashboard-sidebar-wrapper\">\n            <div class=\"dashboard-sidebar\">\n                <ul class=\"nav list-group\">\n                    <li>\n                        <a class=\"list-group-item\" href=\"#\"><i class=\"icon-home icon-1x\"></i>sidebar item 1</a>\n                    </li>\n                    <li>\n                        <a class=\"list-group-item\" href=\"#\"><i class=\"icon-home icon-1x\"></i>sidebar item 2</a>\n                    </li>\n                    <li>\n                        <a class=\"list-group-item\" href=\"#\"><i class=\"icon-home icon-1x\"></i>sidebar item 9</a>\n                    </li>\n                    <li>\n                        <a class=\"list-group-item\" href=\"#\"><i class=\"icon-home icon-1x\"></i>sidebar item 10</a>\n                    </li>\n                    <li>\n                        <a class=\"list-group-item\" href=\"#\"><i class=\"icon-home icon-1x\"></i>sidebar item 11</a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"col-md-11 pull-right dashboard-main-wrapper\">\n            <div class=\"dashboard-main\">\n              <div class=\"page-header\">\n                <h3>mmdb admin</h3>\n              </div>\n              <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. praesent eget magna et ante suscipit lacinia. aenean porttitor velit id pretium blandit.</p>\n            </div>\n          \n            <div class=\"footer\">\n              <ul class=\"nav navbar-nav\"><li><a href=\"\">Link</a></li><li><a href=\"\">Link</a></li><li><a href=\"\">Link</a></li></ul>\n            </div>\n          \n        </div>\n</div>");}]);})();