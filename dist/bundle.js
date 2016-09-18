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

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard' // this is to provide the modal instance
        },
        bindings : {
            table : '<',
            resource : '<',
            onDelete : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( resource ) {
                    vm.onDelete( {
                        resource : resource
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.resource );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }
        }
    } );
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'updateForm', {
        templateUrl : 'modals/update-form/update-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            table : '<',
            resource : '<',
            onUpdate : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( resource ) {
                    vm.onUpdate( {
                        resource : resource
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.resource );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }
            
            vm.isPkCol = function(col) {
                return col.type === 'PRIMARY_KEY';
            }

            vm.isColEditable = function( col ) {
                var isPrimaryKey = col.type === 'PRIMARY_KEY' && vm.table.isManagedResource;
                var isDateAudit = col.type === 'DATE_AUDIT';
                return !isPrimaryKey && !isDateAudit;
            }
        }
    } );
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^^dashboard'
        },
        bindings : {
            table : '<',
            onAdd : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( resource ) {
                    vm.onAdd( {
                        resource : resource
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.resource );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }
            }

            vm.isColEditable = function( col ) {
                var isPrimaryKey = col.type === 'PRIMARY_KEY' && vm.table.isManagedResource;
                var isDateAudit = col.type === 'DATE_AUDIT';
                return !isPrimaryKey && !isDateAudit;
            }
        }
    } );
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .factory( 'Resource', [ 'Schema', Resource ] )

    function Resource( Schema ) {
        var collectPkCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'PRIMARY_KEY';
            } );
        };
        
        var collectBaseCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'BASE';
            } );
        };
        
        var collectDateAuditCols = function( table ) {
            return table.columns.filter( function( val ) {
                return val.type === 'DATE_AUDIT';
            } );
        };
        
        return {
            pkCols : collectPkCols,
            baseCols : collectBaseCols,
            dateAuditCols : collectDateAuditCols,
            determinePk : function( activeTableName, resource ) {
                var table = Schema.findTableByName( activeTableName );

                var pkCols = collectPkCols( table );

                // simple primary key -- return String
                if ( pkCols.length == 1 ) {
                    return resource[pkCols[0].fieldName];
                }

                // compound primary key -- return "Map"
                var pk = {};
                for ( var i = 0; i < pkCols.length; i++ ) {
                    for ( var j = 0; j < table.columns.length; j++ ) {
                        var column = table.columns[j];

                        if ( pkCols[i].name === column.name ) {
                            pk[column.fieldName] = resource[column.fieldName];
                        }
                    }
                }
                return pk;
            }
        };
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
            findTableByName : function( name ) {
                return findTableByName( name );
            }
        };

        function findTableByName( name ) {
            for ( var i = 0; i < json.tables.length; i++ ) {
                var table = json.tables[i];
                if ( table.name === name ) {
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

    .factory( 'Table', [ '$http', '$q', 'Schema', 'Resource', Table ] )

    function Table( $http, $q, Schema, Resource ) {
        var applicationEndpoint = Schema.json.applicationEndpoint;

        function restPath( pk ) {
            var restPath = '';
            if ( typeof pk === 'object' ) {
                for ( var property in pk ) {
                    if ( pk.hasOwnProperty( property ) ) {
                        restPath += '/' + property + '/' + pk[property];
                    }
                }
            } else {
                restPath = '/' + pk;
            }

            return restPath;
        }

        return {
            fetchAll : function( table ) {
                var deferred = $q.defer();

                $http.get( applicationEndpoint + '/' + table.requestMapping ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            keep : function( table, resource ) {
                var deferred = $q.defer();

                if ( table.isManagedResource ) {
                    $http.post( applicationEndpoint + '/' + table.requestMapping, angular.toJson( resource ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                } else {
                    $http.put( applicationEndpoint + '/' + table.requestMapping + restPath( Resource.determinePk( table.name, resource ) ), angular.toJson( resource ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                }

                return deferred.promise;
            },
            modify : function( table, resource, pk ) {
                var deferred = $q.defer();

                $http.put( applicationEndpoint + '/' + table.requestMapping + restPath( pk ), resource ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            dropByPrimaryKey : function( table, pk ) {
                var deferred = $q.defer();

                 $http.delete( applicationEndpoint + '/' + table.requestMapping + restPath( pk ) ).then( function( response ) {
                     deferred.resolve( response.data );
                 }, function() {
                     deferred.reject();
                 } );

                return deferred.promise;
            }
        };
    }
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .filter( 'localDateFilter', [ LocalDateFilter ] );

    function LocalDateFilter() {
        return function( localDate ) {
            if ( localDate ) {
                return new Date( localDate[0], localDate[1] - 1, localDate[2] );
            } else {
                return null;
            }
        };
    }
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .filter( 'localDateTimeFilter', [ LocalDateTimeFilter ] );

    function LocalDateTimeFilter() {
        return function( localDateTime ) {
            if ( localDateTime ) {
                return new Date( localDateTime[0], localDateTime[1] - 1, localDateTime[2], localDateTime[3], localDateTime[4], localDateTime[5] );
            } else {
                return null;
            }
        };
    }
} )();

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n            <ul class=\"nav list-group\">\n                <li ng-repeat=\"table in $ctrl.schema.tables\"><a\n                    class=\"list-group-item\"\n                    ng-click=\"$ctrl.switchTableView(table)\"><i class=\"icon-home icon-1x\"></i>{{table.displayName}}</a></li>\n            </ul>\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n            <div class=\"panel panel-default\">\n\n                <div class=\"panel-heading\">\n                    <h3>{{$ctrl.activeTable.displayName}}</h3>\n                </div>\n\n                <div class=\"panel-body\">\n\n                    <div class=\"input-group\">\n                        <div class=\"input-group-btn\">\n                            <button\n                                class=\"btn btn-success\"\n                                ng-click=\"$ctrl.showAddForm()\">add...</button>\n                        </div>\n                        <input\n                            type=\"text\"\n                            class=\"form-control\"\n                            aria-label=\"search\"\n                            placeholder=\"search\"\n                            ng-model=\"$ctrl.searchInput\">\n                        <div class=\"input-group-btn\">\n                            <button\n                                class=\"btn btn-default\"\n                                ng-click=\"$ctrl.search()\">\n                                <span class=\"fa fa-search\"></span>\n                            </button>\n                        </div>\n\n                        <!--  <span\n                            class=\"input-group-addon fa fa-search\"\n                            ng-click=\"$ctrl.search()\"></span> -->\n                    </div>\n                </div>\n\n                <table class=\"table table-striped table-hover\">\n                    <thead>\n                        <tr>\n                            <th></th>\n                            <th ng-repeat=\"col in $ctrl.activeTable.columns\"><a ng-click=\"$ctrl.sortBy(col)\">{{col.displayName}}</a></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat=\"resource in $ctrl.resources | filter : $ctrl.filter | orderBy : $ctrl.sortExpression : $ctrl.sortDirection as filteredResources\">\n                            <td class=\"resource-row-buttons\">\n                                <div\n                                    class=\"btn-group btn-group-xs\"\n                                    role=\"group\"\n                                    aria-label=\"...\">\n                                    <button\n                                        ng-click=\"$ctrl.showUpdateForm(resource)\"\n                                        class=\"btn btn-info\">\n                                        <i\n                                            class=\"fa fa-wrench fa-fw\"\n                                            aria-hidden=\"true\"></i>\n                                    </button>\n                                    <button\n                                        ng-click=\"$ctrl.showDeleteConfirm(resource)\"\n                                        class=\"btn btn-danger\">\n                                        <i\n                                            class=\"fa fa-times-circle fa-fw\"\n                                            aria-hidden=\"true\"></i>\n                                    </button>\n                                </div>\n                            </td>\n                            <td ng-repeat=\"col in $ctrl.activeTable.columns\">{{$ctrl.resourceValue(resource, col)}}</td>\n                        </tr>\n                    </tbody>\n                </table>\n\n            </div>\n        </div>\n    </div>\n\n    <div class=\"footer\">hand rolled by nick.</div>\n</div>\n</div>\n");
$templateCache.put("modals/delete-confirm/delete-confirm.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">confirm delete: {{$ctrl.table.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <p>are you sure you want to delete me?</p>\n    <form>\n        <div\n            ng-repeat=\"col in $ctrl.table.columns\"\n            class=\"form-group\">\n            <label\n                id=\"{{col.name}}\"\n                class=\"control-label\"\n                for=\"{{col.name}}\">{{col.displayName}}</label> <input\n                type=\"text\"\n                ng-model=\"$ctrl.resource[col.fieldName]\"\n                ng-disabled=\"true\"\n                class=\"form-control\"\n                placeholder=\"{{col.placeholder}}\">\n        </div>\n    </form>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");
$templateCache.put("modals/add-form/add-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">add new: {{$ctrl.table.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <form ng-submit=\"$ctrl.add()\">\n        <div\n            ng-repeat=\"col in $ctrl.table.columns\"\n            class=\"form-group\">\n            <label\n                id=\"{{col.name}}\"\n                class=\"control-label\"\n                for=\"{{col.name}}\">{{col.displayName}}</label> <input\n                type=\"text\"\n                ng-model=\"$ctrl.resource[col.fieldName]\"\n                ng-disabled=\"!$ctrl.isColEditable(col)\"\n                class=\"form-control\"\n                placeholder=\"{{col.placeholder}}\">\n        </div>\n    </form>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");
$templateCache.put("modals/update-form/update-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">update existing: {{$ctrl.table.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <form ng-submit=\"$ctrl.add()\">\n        <div\n            ng-repeat=\"col in $ctrl.table.columns\"\n            class=\"form-group\">\n            <label\n                id=\"{{col.name}}\"\n                class=\"control-label\"\n                for=\"{{col.name}}\">{{col.displayName}}</label> <input\n                type=\"text\"\n                ng-model=\"$ctrl.resource[col.fieldName]\"\n                ng-disabled=\"!$ctrl.isColEditable(col)\"\n                class=\"form-control\"\n                placeholder=\"{{col.placeholder}}\">\n        </div>\n    </form>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");}]);})();