( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        controller : [ '$document', '$filter', '$location', '$uibModal', 'Schema', 'Table', 'Resource', DashboardCtrl ]
    } );

    function DashboardCtrl( $document, $filter, $location, $uibModal, Schema, Table, Resource ) {
        var vm = this;

        vm.schema = Schema.json;
        vm.activeTable = determineActiveTable();

        setupSortAndSearch();
        getResources();

        vm.search = function() {
            vm.filter.$ = vm.searchInput;
        }

        vm.switchTableView = function( table ) {
            if ( vm.activeTable.name === table.name ) {
                return;
            }

            vm.activeTable = table;
            $location.search( {
                'table' : vm.activeTable.name
            } );

            setupSortAndSearch();
            getResources();
        }

        vm.sortBy = function( col ) {
            if ( vm.sortExpression === col.jsonPath ) {
                vm.sortDirection = !vm.sortDirection;
            } else {
                vm.sortExpression = col.jsonPath;
                vm.sortDirection = false;
            }
        }

        vm.resourceValue = function( resource, column ) {
            var val = resource[column.fieldName];

            if ( column.filters ) {
                for ( var i = 0; i < column.filters.length; i++ ) {
                    var filter = column.filters[i];

                    if ( filter.name === 'currency' ) {
                        val = $filter( filter.name )( val, filter.symbol, filter.fractionSize );
                    } else if ( filter.name === 'date' ) {
                        val = $filter( filter.name )( $filter( filter.type + 'Filter' )( val ), filter.format, filter.timeZone );
                    } else {
                        val = $filter( filter.type )( val );
                    }
                }
            }

            return val;
        }

        vm.showAddForm = function() {
            var activeTable = vm.activeTable;

            vm.modalInstance = $uibModal.open( {
                template : '<add-form table="$ctrl.activeTable" on-add="$ctrl.addResource(resource)"></add-form>',
                appendTo : $document.find( 'dashboard' ), // this is to provide the modal instance
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.activeTable = activeTable;
                    vm.addResource = function( resource ) {
                        addResource( resource );
                    }
                }
            } );
        }

        vm.showUpdateForm = function( resource ) {
            var activeTable = vm.activeTable;

            vm.modalInstance = $uibModal.open( {
                template : '<update-form table="$ctrl.activeTable" resource="$ctrl.resourceToUpdate" on-update="$ctrl.updateResource(resource)"></update-form>',
                appendTo : $document.find( 'dashboard' ), // this is to provide the modal instance
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.activeTable = activeTable;
                    vm.resourceToUpdate = resource;
                    vm.updateResource = function( resource ) {
                        updateResource( resource );
                    }
                }
            } );
        }

        vm.showDeleteConfirm = function( resource ) {
            var activeTable = vm.activeTable;

            vm.modalInstance = $uibModal.open( {
                template : '<delete-confirm table="$ctrl.activeTable" resource="$ctrl.resourceToDelete" on-delete="$ctrl.deleteResource(resource)"></delete-confirm>',
                appendTo : $document.find( 'dashboard' ), // this is to provide the modal instance
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.activeTable = activeTable;
                    vm.resourceToDelete = resource;
                    vm.deleteResource = function( resource ) {
                        deleteResource( resource );
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

        function getResources() {
            Table.fetchAll( vm.activeTable ).then( function( resources ) {
                vm.resources = resources;
            }, function() {
            } );
        }

        function addResource( resource ) {
            Table.keep( vm.activeTable, resource ).then( function( resource ) {
                getResources();
            }, function() {
            } );
        }

        function updateResource( resource ) {
            var pk = Resource.determinePk( vm.activeTable.name, resource );

            Table.modify( vm.activeTable, resource, pk ).then( function( resource ) {
                getResources();
            }, function() {
            } );
        }

        function deleteResource( resource ) {
            var pk = Resource.determinePk( vm.activeTable.name, resource );

            Table.dropByPrimaryKey( vm.activeTable, pk ).then( function( resource ) {
                getResources();
            }, function() {
            } );
        }
    }
} )();
