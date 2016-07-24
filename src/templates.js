(function(){angular.module("mmdb.admin.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/dashboard/dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            <ul class=\"nav list-group\">\n                <li ng-repeat=\"table in $ctrl.schema.tables\"><a class=\"list-group-item\" ng-click=\"$ctrl.switchTableView(table)\"><i\n                        class=\"icon-home icon-1x\"></i>{{table.displayName}}</a></li>\n            </ul>\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <div class=\"page-header\">\n                <h3>{{$ctrl.activeTable.displayName}}</h3>\n            </div>\n\n            <table class=\"table table-striped table-hover table-sm\">\n                <thead>\n                    <tr>\n                        <th></th>\n                        <th></th>\n                        <th ng-repeat=\"col in $ctrl.activeTable.columns\">{{col.displayName}}</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr ng-repeat=\"item in $ctrl.items\">\n                        <td>\n                            <button ng-click=\"$ctrl.updateItem(item)\" class=\"btn btn-small btn-info\">\n                                <i class=\"fa fa-wrench\" aria-hidden=\"true\"></i>\n                            </button>\n                        </td>\n                        <td>\n                            <button ng-click=\"$ctrl.deleteItem(item)\" class=\"btn btn-small btn-danger\">\n                                <i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>\n                            </button>\n                        </td>\n                        <td ng-repeat=\"col in $ctrl.activeTable.columns\">{{item[col.fieldName]}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");}]);})();