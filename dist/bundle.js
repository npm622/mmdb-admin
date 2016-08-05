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
            vm.modalInstance = $uibModal.open( {
                template : '<update-form dto="$ctrl.dtoToUpdate" on-update="$ctrl.updateItem(dto)></update-form>',
                appendTo : $document.find( 'dashboard' ),
                controllerAs : '$ctrl',
                controller : function() {
                    var vm = this;
                    vm.dtoToUpdate = convertItemToDto( item );
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

        function convertItemToDto( item ) {
            return Item.convertItem( vm.activeTable.sqlName, item );
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

( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).component( 'addForm', {
        templateUrl : 'modals/add-form/add-form.html',
        require : {
            parent : '^dashboard'
        },
        bindings : {
            onAdd : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( dto ) {
                    vm.onAdd( {
                        dto : dto
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.dto );
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

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        require : {
            parent : '^dashboard' // this is to provide the modal instance
        },
        bindings : {
            item : '<',
            onDelete : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( item ) {
                    vm.onDelete( {
                        item : item
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.item );
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
            dto : '<',
            onUpdate : '&'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                modalInstance.result.then( function( dto ) {
                    vm.onUpdate( {
                        dto : dto
                    } );
                }, function() { // do nothing
                } );

                vm.ok = function() {
                    modalInstance.close( vm.dto );
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

    .factory( 'Item', [ 'Schema', Item ] )

    function Item( Schema ) {
        function findColumn( columns, fieldName ) {
            for ( var i = 0; i < columns.length; i++ ) {
                var col = columns[i];
                if ( col.fieldName === fieldName ) {
                    return col;
                }
            }
        }

        return {
            determinePk : function( activeTableName, item ) {
                var table = Schema.findTableByName( activeTableName );

                // simple primary key -- return String
                if ( table.pks.length == 1 ) {
                    return item[table.pks[0]];
                }

                // compound primary key -- return "Map"
                var pk = {};
                for ( var i = 0; i < table.pks.length; i++ ) {
                    for ( var j = 0; j < table.columns.length; j++ ) {
                        var column = table.columns[j];

                        if ( table.pks[i] === column.sqlName ) {
                            pk[column.fieldName] = item[table.pkKey][column.fieldName];
                        }
                    }
                }
                return pk;
            },
            convertDto : function( activeTableName, dto ) {
                var table = Schema.findTableByName( activeTableName );

                var item = {};

                for ( var prop in dto ) {
                    if ( dto.hasOwnProperty( prop ) ) {
                        var column = findColumn( table.columns, prop );
                        if ( column.jsonPath.includes( '.' ) ) {
                            if ( !item[table.pkKey] ) {
                                item[table.pkKey] = {};
                            }
                            item[table.pkKey][prop] = dto[prop];
                        } else {
                            item[prop] = dto[prop];
                        }
                    }
                }

                return item;
            },
            convertItem : function( activeTableName, item ) {
                var table = Schema.findTableByName( activeTableName );

                var dto = {};

                for ( var i = 0; i < table.columns.length; i++ ) {
                    var column = table.columns[i];

                    if ( column.jsonPath.includes( '.' ) ) {
                        dto[column.fieldName] = item[table.pkKey][column.fieldName];
                    } else {
                        dto[column.fieldName] = item[column.fieldName];
                    }
                }

                return dto;
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

    .factory( 'Table', [ '$http', '$q', 'Schema', 'Item', Table ] )

    function Table( $http, $q, Schema, Item ) {
        var webEndpoint = Schema.json.webEndpoint;

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

                $http.get( webEndpoint + '/' + table.contextPath ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            keep : function( table, item ) {
                var deferred = $q.defer();

                if ( table.isAutoPk ) {
                    $http.post( webEndpoint + '/' + table.contextPath, angular.toJson( item ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                } else {
                    $http.put( webEndpoint + '/' + table.contextPath + restPath( Item.determinePk( table.sqlName, item ) ), angular.toJson( item ) ).then( function( response ) {
                        deferred.resolve( response.data );
                    }, function() {
                        deferred.reject();
                    } );
                }

                return deferred.promise;
            },
            modify : function( table, pk, payload ) {
                var deferred = $q.defer();

                $http.put( webEndpoint + '/' + table.contextPath + restPath( pk ), payload ).then( function( response ) {
                    deferred.resolve( response.data );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            },
            dropByPrimaryKey : function( table, pk ) {
                var deferred = $q.defer();

                 $http.delete( webEndpoint + '/' + table.contextPath + restPath( pk ) ).then( function( response ) {
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
                console.log( 'TODO: implement a better local date time filter...' );
                console.log( localDateTime );
                return new Date( localDateTime[0], localDateTime[1] - 1, localDateTime[2] );
            } else {
                return null;
            }
        };
    }
} )();

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("modals/add-form/add-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">add new: {{$ctrl.parent.activeTable.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <form ng-submit=\"$ctrl.add()\">\n        <div\n            ng-repeat=\"col in $ctrl.parent.activeTable.columns\"\n            class=\"form-group\">\n            <label\n                id=\"{{col.sqlName}}\"\n                class=\"control-label\"\n                for=\"{{col.sqlName}}\">{{col.displayName}}</label> <input\n                type=\"text\"\n                ng-model=\"$ctrl.dto[col.fieldName]\"\n                ng-disabled=\"col.isUneditable\"\n                class=\"form-control\"\n                placeholder=\"{{col.placeholder}}\">\n        </div>\n    </form>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");
$templateCache.put("modals/delete-confirm/delete-confirm.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">confirm delete</h3>\n</div>\n<div class=\"modal-body\">\n    <p>are you sure you want to delete me?</p>\n    <hr />\n    <pre>{{$ctrl.item | json}}</pre>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");
$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            <button ng-click=\"$ctrl.showAddForm()\" class=\"btn btn-block btn-success\">add...</button>\n\n            <div class=\"form-inline\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" placeholder=\"search\" ng-model=\"$ctrl.searchInput\"> <span class=\"input-group-addon fa fa-search\" ng-click=\"$ctrl.search()\"></span>\n                </div>\n            </div>\n\n            <ul class=\"nav list-group\">\n                <li ng-repeat=\"table in $ctrl.schema.tables\"><a class=\"list-group-item\" ng-click=\"$ctrl.switchTableView(table)\"><i\n                        class=\"icon-home icon-1x\"></i>{{table.displayName}}</a></li>\n            </ul>\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <div class=\"page-header\">\n                <h3>{{$ctrl.activeTable.displayName}}</h3>\n            </div>\n\n            <table class=\"table table-striped table-hover\">\n                <thead>\n                    <tr>\n                        <th></th>\n                        <th ng-repeat=\"col in $ctrl.activeTable.columns\"><a ng-click=\"$ctrl.sortBy(col)\">{{col.displayName}}</a></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr ng-repeat=\"item in $ctrl.items | filter : $ctrl.filter | orderBy : $ctrl.sortExpression : $ctrl.sortDirection as filteredItems\">\n                        <td class=\"item-row-buttons\">\n                            <div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">\n                                <button ng-click=\"$ctrl.showUpdateForm(item)\" class=\"btn btn-info\">\n                                    <i class=\"fa fa-wrench fa-fw\" aria-hidden=\"true\"></i>\n                                </button>\n                                <button ng-click=\"$ctrl.showDeleteConfirm(item)\" class=\"btn btn-danger\">\n                                    <i class=\"fa fa-times-circle fa-fw\" aria-hidden=\"true\"></i>\n                                </button>\n                            </div>\n                        </td>\n                        <td ng-repeat=\"col in $ctrl.activeTable.columns\">{{$ctrl.itemValue(item, col)}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");
$templateCache.put("modals/update-form/update-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">update existing: {{$ctrl.parent.activeTable.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <form ng-submit=\"$ctrl.add()\">\n        <div\n            ng-repeat=\"col in $ctrl.parent.activeTable.columns\"\n            class=\"form-group\">\n            <label\n                id=\"{{col.sqlName}}\"\n                class=\"control-label\"\n                for=\"{{col.sqlName}}\">{{col.displayName}}</label> <input\n                type=\"text\"\n                ng-model=\"$ctrl.dto[col.fieldName]\"\n                ng-disabled=\"col.isPk\"\n                class=\"form-control\"\n                placeholder=\"{{col.placeholder}}\">\n        </div>\n    </form>\n    <hr />\n    <pre>{{$ctrl.dto | json}}</pre>\n</div>\n<div class=\"modal-footer\">\n    <button\n        class=\"btn btn-primary\"\n        type=\"button\"\n        ng-click=\"$ctrl.ok()\">ok</button>\n    <button\n        class=\"btn btn-warning\"\n        type=\"button\"\n        ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");}]);})();