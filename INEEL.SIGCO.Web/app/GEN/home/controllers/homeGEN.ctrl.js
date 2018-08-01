(function () {
    'use strict';
    angular
        .module("ineelGEN")
        .controller('homeGENCtrl', [
           '$scope',
           '$location',
           'AuthService',
           'MenuService',
            homeGENCtrl]);

    function homeGENCtrl($scope, $location, AuthService, MenuService) {
        $scope.isSigco = false;
        $scope.isModulo = true;
        
        $scope.modulo = "ADM";
        $scope.authentication = AuthService.authentication;
        $scope.rol = MenuService.getRolId();
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        $scope.funciones = MenuService.getMenuAdmin();

         $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }
    }                                   
}());
