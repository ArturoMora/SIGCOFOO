(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('solicitudesRHCtrl', ['$scope', '$location', 'AuthService', solicitudesRHCtrl]);


    function solicitudesRHCtrl($scope, $location, AuthService) {

        $scope.authentication = AuthService.authentication;

        $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/sigco.html"
        }
    }
}());
