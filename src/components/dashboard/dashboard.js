( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        controller : [ '$document', '$filter', '$location', '$uibModal', 'Schema', 'Table', 'Item', DashboardCtrl ]
    } );

    function DashboardCtrl( $document, $filter, $location, $uibModal, Schema, Table, Item ) {
        var vm = this;

        vm.schema = Schema.json;
        vm.activeTable = determineActiveTable();

        setupSortAndSearch();
        getItems();

        vm.addItem = function( payload ) {
            Table.keep( vm.activeTable, payload ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }

        vm.updateItem = function( pk, payload ) {
            Table.modify( vm.activeTable, pk, payload ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }

        vm.deleteItem = function( pk ) {
            Table.dropByPrimaryKey( vm.activeTable, pk ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }

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
                    } else if ( filter.name === 'localDate' ) {
                        val = $filter( 'date' )( $filter( 'localDateFilter' )( val ), filter.format, filter.timeZone );
                    } else if ( filter.name === 'localDateTime' ) {
                        val = $filter( 'date' )( $filter( 'localDateTimeFilter' )( val ), filter.format, filter.timeZone );
                    } else {
                        val = $filter( filter.name )( val );
                    }
                }
            }

            return val;
        }

        vm.showAddForm = function() {
            vm.modalInstance = $uibModal.open( {
                template : '<add-form on-add="$ctrl.addItem(dto)"></add-form>',
                appendTo : $document.find( 'dashboard' ), // this is to provide the modal instance
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.addItem = function( dto ) {
                        addItem( dto );
                    }
                }
            } );
        }

        vm.showUpdateForm = function( item ) {
            var dtoToUpdate = Item.convertItem( vm.activeTable.sqlName, item );

            vm.modalInstance = $uibModal.open( {
                template : '<update-form dto="$ctrl.dtoToUpdate" on-update="$ctrl.updateItem(dto)></update-form>',
                appendTo : $document.find( 'dashboard' ),
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.dtoToUpdate = {};
                    vm.updateItem = function( dto ) {
                        updateItem( dto );
                    }
                }
            } );
        }

        vm.showDeleteConfirm = function( item ) {
            vm.modalInstance = $uibModal.open( {
                template : '<delete-confirm item="$ctrl.itemToDelete" on-delete="$ctrl.deleteItem(item)"></delete-confirm>',
                appendTo : $document.find( 'dashboard' ), // this is to provide the modal instance
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.itemToDelete = item;
                    vm.deleteItem = function( item ) {
                        deleteItem( item );
                    }
                }
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
            vm.items = []; // TODO: don't do this and overlay a spinner instead

            Table.fetchAll( vm.activeTable ).then( function( items ) {
                vm.items = items;
            }, function() {
            } );
        }

        function addItem( dto ) {
            var item = Item.convertDto( vm.activeTable.sqlName, dto );

            Table.keep( vm.activeTable, item ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }

        function updateItem( dto ) {
            var item = Item.convertDto( vm.activeTable.sqlName, dto );
            var pk = Item.determinePk( vm.activeTable.sqlName, item );

            Table.modify( vm.activeTable, pk, item ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }

        function deleteItem( item ) {
            var pk = Item.determinePk( vm.activeTable.sqlName, item );

            Table.dropByPrimaryKey( vm.activeTable, pk ).then( function( item ) {
                getItems();
            }, function() {
            } );
        }
    }
} )();
