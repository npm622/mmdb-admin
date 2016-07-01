( function() {
    'use strict';

    angular.module( 'mmdb.admin' )

    .component( 'dashboard', {
        templateUrl : 'components/dashboard/dashboard.html',
        bindings : {},
        controller : [ 'tableMapper', DashboardCtrl ]
    } );

    function DashboardCtrl( tableMapper ) {
        var vm = this;

        vm.schema = tableMapper.schema;

        tableMapper.fetchByPk( vm.schema.tables[4], {
            customerId : "02de345a-72df-4677-be12-b867c58d9b51",
            sandwichId : "2cb6d513-06a3-4aa4-93bb-e53d279d95cb"
        } ).then( function( results ) {
            console.log( results );
        }, function() {
        } );
    }
} )();
