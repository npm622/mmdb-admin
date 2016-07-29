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
        controller : [ '$location', 'ModalService', 'Schema', 'Table', DashboardCtrl ]
    } );

    function DashboardCtrl( $location, ModalService, Schema, Table ) {
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

        vm.showAddForm = function() {
            var modal = $uibModal.open( {
                animation : true,
                size : 'lg',
                templateUrl : 'modals/add-form/add-form.html',
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

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .controller( 'AddFormCtrl', [ '$uibModalInstance', 'activeTable', AddFormCtrl ] );

    function AddFormCtrl( $uibModalInstance, activeTable ) {
        var vm = this;

        vm.activeTable = activeTable;
        vm.form = {};

        vm.$onInit = function() {
            console.log( 'on add form init...' );
            console.log( vm.activeTable );
            console.log( activeTable );
        }

        vm.ok = function() {
            $uibModalInstance.close( angular.toJson( vm.form ) );
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss( 'cancel' );
        };

    }
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'deleteConfirm', {
        templateUrl : 'modals/delete-confirm/delete-confirm.html',
        replace : true,
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( {
                        hello : 'world!'
                    } ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.json = itemJson;
                    console.log( 'deleting...' );
                    console.log( vm.json );
                }, function() {
                    console.log( 'aborting update...' );
                } );
            }

            function writeJson( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'updateForm', {
        templateUrl : 'modals/update-form/update-form.html',
        replace : true,
        require : {
            parent : '^dashboard'
        },
        controller : function() {
            var vm = this;

            vm.$onInit = function() {
                var modalInstance = vm.parent.modalInstance;

                vm.ok = function() {
                    modalInstance.close( writeJson( vm.item ) );
                }

                vm.cancel = function() {
                    modalInstance.dismiss( 'cancel' );
                }

                modalInstance.result.then( function( itemJson ) {
                    vm.json = itemJson;
                    console.log( 'updating...' );
                    console.log( vm.json );
                }, function() {
                    console.log( 'aborting update...' );
                } );
            }

            function writeJson( item ) {
                return angular.toJson( item );
            }
        }
    } );
} )();

( function() {
    'use strict';

    angular.module( 'mmdb.admin' ).service( 'ModalService', [ '$uibModal', ModalService ] );

    function ModalService( $uibModal ) {
        var vm = this;

        var defaults = {
            backdrop : true,
            keybaord : true,
            modalFade : true,
            templateUrl : 'modals/undefined/undefined.html'
        };

        var options = {
            closeButtonText : 'close',
            actionButtonText : 'ok',
            headerText : 'confirm or deny',
            bodyText : 'should we proceed?'
        };

        vm.showModal = function( defaultsOverride, optionsOverride ) {
            if ( !defaultsOverride ) {
                defaultsOverride = {}
            }

            defaultsOverride.backdrop = 'static';

            return vm.show( defaultsOverride, optionsOverrde );
        }

        vm.show = function( defaultsOverride, optionsOverride ) {
            var modalDefaults = angular.extend( {}, defaults, defaultsOverride );
            var modalOptions = angular.extend( {}, options, optionsOverride );

            if ( !modalDefaults.controller ) {
                modalDefaults.controller = function( $modalInstance ) {
                    var _this = this;

                    _this.options = modalOptions;
                    _this.options.ok = function( result ) {
                        $modalInstance.close( result );
                    }
                    _this.options.close = function( result ) {
                        $modalInstance.dismiss( 'cancel' );
                    }
                }
            }

            return $uibModal.open( modalOptions ).result;
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

(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            <button ng-click=\"$ctrl.showAddForm()\" class=\"btn btn-block btn-success\">add...</button>\n\n            <div class=\"form-inline\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" placeholder=\"search\" ng-model=\"$ctrl.searchInput\"> <span class=\"input-group-addon fa fa-search\" ng-click=\"$ctrl.search()\"></span>\n                </div>\n            </div>\n\n            <ul class=\"nav list-group\">\n                <li ng-repeat=\"table in $ctrl.schema.tables\"><a class=\"list-group-item\" ng-click=\"$ctrl.switchTableView(table)\"><i\n                        class=\"icon-home icon-1x\"></i>{{table.displayName}}</a></li>\n            </ul>\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <div class=\"page-header\">\n                <h3>{{$ctrl.activeTable.displayName}}</h3>\n            </div>\n\n            <table class=\"table table-striped table-hover\">\n                <thead>\n                    <tr>\n                        <th></th>\n                        <th ng-repeat=\"col in $ctrl.activeTable.columns\"><a ng-click=\"$ctrl.sortBy(col)\">{{col.displayName}}</a></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr ng-repeat=\"item in $ctrl.items | filter : $ctrl.filter | orderBy : $ctrl.sortExpression : $ctrl.sortDirection as filteredItems\">\n                        <td class=\"item-row-buttons\">\n                            <div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">\n                                <button ng-click=\"$ctrl.updateItem(item)\" class=\"btn btn-info\">\n                                    <i class=\"fa fa-wrench fa-fw\" aria-hidden=\"true\"></i>\n                                </button>\n                                <button ng-click=\"$ctrl.deleteItem(item)\" class=\"btn btn-danger\">\n                                    <i class=\"fa fa-times-circle fa-fw\" aria-hidden=\"true\"></i>\n                                </button>\n                            </div>\n                        </td>\n                        <td ng-repeat=\"col in $ctrl.activeTable.columns\">{{$ctrl.itemValue(item, col)}}</td>\n                    </tr>\n                </tbody>\n            </table>\n            <pre>{{$ctrl.activeTable | json}}</pre>\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");
$templateCache.put("modals/add-form/add-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">add new: {{$ctrl.activeTable.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <ul>\n        <li ng-repeat=\"col in $ctrl.activeTable.columns\">{{col.fieldName}}</li>\n    </ul>\n    Form:\n    <pre>{{ $ctrl.form | json }}</pre>\n</div>\n<div class=\"modal-footer\">\n    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.ok()\">ok</button>\n    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");
$templateCache.put("modals/delete-confirm/delete-confirm.html","Are you sure you want to delete me?");
$templateCache.put("modals/update-form/update-form.html","<div class=\"modal-header\">\n    <h3 class=\"modal-title\">add new: {{$ctrl.activeTable.displayName}}</h3>\n</div>\n<div class=\"modal-body\">\n    <ul>\n        <li ng-repeat=\"col in $ctrl.activeTable.columns\">{{col.fieldName}}</li>\n    </ul>\n    Form:\n    <pre>{{ $ctrl.form | json }}</pre>\n</div>\n<div class=\"modal-footer\">\n    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.ok()\">ok</button>\n    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"$ctrl.cancel()\">cancel</button>\n</div>");}]);})();