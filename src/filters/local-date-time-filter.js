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
