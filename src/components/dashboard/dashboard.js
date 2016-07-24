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
        vm.activeTable = vm.schema.tables[0];

        getItems();

        vm.switchTableView = function( table ) {
            if ( vm.activeTable.sqlName === table.sqlName ) {
                return;
            }

            vm.activeTable = table;

            getItems();
        }

        function getItems() {
            vm.items = [];

            Table.fetchAll( vm.activeTable ).then( function( items ) {
                vm.items = items;
            }, function() {
            } );
        }
    }
} )();
