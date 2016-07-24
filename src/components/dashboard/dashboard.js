( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        controller : [ 'Schema', 'Table', DashboardCtrl ]
    } );

    function DashboardCtrl( Schema, Table ) {
        var vm = this;

        vm.schema = Schema.json;
        vm.activeTable = determineActiveTable();

        vm.filter = {};
        vm.sortExpression = vm.activeTable.defaultSortExpression;
        vm.sortDirection = false;

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

            getItems();
        }

        vm.sortBy = function(col) {
            if ( vm.sortExpression === col.sqlName ) {
                vm.sortDirection = !vm.sortDirection;
            } else {
                vm.sortExpression = col.sqlName;
                vm.sortDirection = false;
            }
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
