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
