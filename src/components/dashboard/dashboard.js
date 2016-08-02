( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        controller : [ '$document', '$filter', '$location', '$uibModal', 'Schema', 'Table', DashboardCtrl ]
    } );

    function DashboardCtrl( $document, $filter, $location, $uibModal, Schema, Table ) {
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
            var val;
            if ( !vm.activeTable.isSimplePk && column.isPk ) {
                val = item[vm.activeTable.pkKey][column.fieldName];
            } else {
                val = item[column.fieldName];
            }

            if ( column.filters ) {
                for ( var i = 0; i < column.filters.length; i++ ) {
                    var filter = column.filters[i];

                    if ( filter.name === 'currency' ) {
                        val = $filter( filter.name )( val, filter.symbol, filter.fractionSize );
                    } else if ( filter.name === 'date' ) {
                        console.log( val );
                        console.log( $filter( filter.name )( val, filter.format, filter.timeZone ) );
                        val = $filter( filter.name )( val, filter.format, filter.timeZone );
                    } else {
                        val = $filter( filter.name )( val );
                    }
                }
            }

            return val;
        }

        vm.showAddForm = function() {
            vm.modalInstance = $uibModal.open( {
                template : '<add-form></add-form>',
                appendTo : $document.find( 'dashboard' )
            } );
        }

        vm.addItem = function( json ) {
            console.log( 'adding...' );
            console.log( json );
        }

        vm.updateItem = function( item ) {
            vm.modalInstance = $uibModal.open( {
                template : '<update-form></update-form>',
                appendTo : $document.find( 'dashboard' )
            } );
        }

        vm.deleteItem = function( item ) {
            vm.modalInstance = $uibModal.open( {
                template : '<delete-confirm></delete-confirm>',
                appendTo : $document.find( 'dashboard' )
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
