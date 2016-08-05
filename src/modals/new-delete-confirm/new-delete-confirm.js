( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'newDeleteConfirm', {
        templateUrl : 'modals/new-delete-confirm/new-delete-confirm.html',
        bindings : {
            item : '<',
            ok : '&',
            cancel : '&'
        }
    } );
} )();
