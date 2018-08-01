(function () {
    'use strict';
    angular
        .module("ineelDESCARGAS")
        .controller('indexControllerDescargas', ['$scope', '$location',
            'AuthService', 'MenuService', '$crypto', '$window', indexControllerDescargas]);

    function indexControllerDescargas($scope, $location, AuthService, MenuService, $crypto, $window) {
        debugger;
        //$scope.modulo = "MT";
        $scope.authentication = AuthService.authentication;
        //$scope.funciones = MenuService.getMenu();
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }

        //$scope.foo = "fooo1";
        //$scope.foo2 = new Date().toLocaleDateString();
        //$scope.encrypted = $crypto.encrypt('74',  $crypto.getCryptoKey());
        //debugger;
        //$scope.decrypted = $crypto.decrypt($scope.encrypted, $crypto.getCryptoKey());
        //$scope.decrypted2 = $crypto.decrypt("U2FsdGVkX1/51NdgRa8ZOzDw6ir5XS+sJr8auvrZA+c=", $crypto.getCryptoKey());
        $scope.close = function () {
            $window.close();
        }
        
    }
}());