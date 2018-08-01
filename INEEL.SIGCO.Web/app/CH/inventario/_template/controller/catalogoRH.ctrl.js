(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('catalogosRHCtrl', ['$scope', '$location', 'AuthService', catalogosRHCtrl]);


    function catalogosRHCtrl($scope, $location, AuthService) {

        $scope.authentication = AuthService.authentication;

        $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/sigco.html"
        }
    }
}());
