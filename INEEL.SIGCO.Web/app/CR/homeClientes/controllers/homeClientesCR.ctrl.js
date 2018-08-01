(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('homeClientesCRCtrl', [
            '$scope',
            '$location',
            'AuthService',
            'MenuService',
            homeClientesCRCtrl
        ]);

    function homeClientesCRCtrl($scope, $location, AuthServiceCR, MenuService) {
        $scope.modulo = "CR";
        $scope.authentication = AuthServiceCR.authentication;
        $scope.funciones = MenuService.getMenu();
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        $scope.logOut = function () {
            AuthServiceCR.logOut();
            window.location = "/sigco.html"
        }
        //$scope.authentication = AuthServiceCR.authentication;
    }
}());
