( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/add-form-modal/add-form-modal.html',
        controller : [ '$uibModal', 'Schema', 'Table', DashboardCtrl ]
    } );

    function DashboardCtrl( $location, $uibModal, Schema, Table ) {
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
        }

        vm.itemValue = function( item, column ) {
            if ( !vm.activeTable.isSimplePk && column.isPk ) {
                return item[vm.activeTable.pkKey][column.fieldName];
            } else {
                return item[column.fieldName];
            }
        }

        vm.showAddForm = function( size ) {
            if ( !size ) {
                size = 'lg';
            }

            var modal = $uibModal.open( {
                animation : true,
                size : size,
                templateUrl : 'modals/sample/sample.html',
                controller : 'SampleCtrl',
                controllerAs : '$ctrl',
                bindToController : true,
                resolve : {
                    activeTable : function() {
                        return vm.activeTable;
                    }
                }
            } );

            modal.result.then( function( itemJson ) {
                console.log( 'creating: ' + itemJson );
            }, function() {
                console.log( 'modal dismissed at: ' + new Date() );
            } );
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
