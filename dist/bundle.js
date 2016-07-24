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
        controller : [ '$location', 'Schema', 'Table', DashboardCtrl ]
    } );

    function DashboardCtrl( $location, Schema, Table ) {
        var vm = this;

        vm.schema = Schema.json;
        vm.activeTable = determineActiveTable();

        setupSortAndSearch();
        getItems();

        vm.search = function() {
            vm.filter.$ = vm.searchInput;
        }

        vm.switchTableView = function( table ) {
            if ( vm.activeTable.sqlName === table.sqlName ) {
                return;
            }

            vm.activeTable = table;
            $location.search( {
                'table' : vm.activeTable.sqlName
            } );

            setupSortAndSearch();
            getItems();
        }

        vm.sortBy = function( col ) {
            if ( vm.sortExpression === col.jsonPath ) {
                vm.sortDirection = !vm.sortDirection;
            } else {
                vm.sortExpression = col.jsonPath;
                vm.sortDirection = false;
            }
            console.log( 'sorting by...' );
            console.log( vm.sortExpression );
            console.log( vm.filter );
        }

        vm.itemValue = function( item, column ) {
            if ( !vm.activeTable.isSimplePk && column.isPk ) {
                return item[vm.activeTable.pkKey][column.fieldName];
            } else {
                return item[column.fieldName];
            }
        }

        function determineActiveTable() {
            return $location.search().table ? Schema.findTableByName( $location.search().table ) : vm.schema.tables[0];
        }

        function setupSortAndSearch() {
            vm.filter = {};
            vm.sortExpression = vm.activeTable.defaultSortExpression;
            vm.sortDirection = false;
        }

        function getItems() {
            vm.items = [];

            Table.fetchAll( vm.activeTable ).then( function( items ) {
                vm.items = items;
                console.log( vm.items );
            }, function() {
            } );
        }
    }
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Schema', [ 'mmdbAdmin', Schema ] )

    function Schema( mmdbAdmin ) {
        var json = mmdbAdmin.json;

        return {
            json : json,
            findTableByName : function( sqlName ) {
                return findTableByName( sqlName );
            }
        };

        function findTableByName( sqlName ) {
            for ( var i = 0; i < json.tables.length; i++ ) {
                var table = json.tables[i];
                if ( table.sqlName === sqlName ) {
                    return table;
                }
            }
            return undefined;
        }
    }
} )();

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
            }
        };
    }
} )();

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            <button ng-click=\"$ctrl.showAddForm()\" class=\"btn btn-block btn-success\">add...</button>\n\n            <div class=\"form-inline\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" placeholder=\"search\" ng-model=\"$ctrl.searchInput\"> <span class=\"input-group-addon fa fa-search\" ng-click=\"$ctrl.search()\"></span>\n                </div>\n            </div>\n\n            <ul class=\"nav list-group\">\n                <li ng-repeat=\"table in $ctrl.schema.tables\"><a class=\"list-group-item\" ng-click=\"$ctrl.switchTableView(table)\"><i\n                        class=\"icon-home icon-1x\"></i>{{table.displayName}}</a></li>\n            </ul>\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <div class=\"page-header\">\n                <h3>{{$ctrl.activeTable.displayName}}</h3>\n            </div>\n\n            <table class=\"table table-striped table-hover\">\n                <thead>\n                    <tr>\n                        <th></th>\n                        <th ng-repeat=\"col in $ctrl.activeTable.columns\"><a ng-click=\"$ctrl.sortBy(col)\">{{col.displayName}}</a></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr ng-repeat=\"item in $ctrl.items | filter : $ctrl.filter | orderBy : $ctrl.sortExpression : $ctrl.sortDirection as filteredItems\">\n                        <td>\n                            <button ng-click=\"$ctrl.updateItem(item)\" class=\"btn btn-small btn-info\">\n                                <i class=\"fa fa-wrench fa-fw\" aria-hidden=\"true\"></i>\n                            </button>\n                            <button ng-click=\"$ctrl.deleteItem(item)\" class=\"btn btn-small btn-danger\">\n                                <i class=\"fa fa-times-circle fa-fw\" aria-hidden=\"true\"></i>\n                            </button>\n                        </td>\n                        <td ng-repeat=\"col in $ctrl.activeTable.columns\">{{$ctrl.itemValue(item, col)}}</td>\n                    </tr>\n                </tbody>\n            </table>\n            <pre>{{$ctrl.activeTable | json}}</pre>\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");}]);})();