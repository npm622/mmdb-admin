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
