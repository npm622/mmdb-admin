( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .filter( 'localDateFilter', [ LocalDateFilter ] );

    function LocalDateFilter() {
        return function( localDate ) {
            return new Date( localDate[0], localDate[1] - 1, localDate[2] );
        };
    }
} )();
