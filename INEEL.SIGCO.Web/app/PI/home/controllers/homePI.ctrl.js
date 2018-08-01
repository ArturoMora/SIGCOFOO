(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('HomePICtrl', ['$scope',
            'AuthService', 'NuevoOCService', 'DTOptionsBuilder', '$filter', 'MenuService', 'comunCountService', HomePICtrl]);

    function HomePICtrl($scope, AuthService, NuevoOCService, DTOptionsBuilder, $filter, MenuService, comunCountService) {
        $scope.modulo = "PI";
        $scope.authentication = AuthService.authentication;

        if ((typeof $scope.authentication.isAuth === undefined) || !$scope.authentication.isAuth) {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }


        var ClavePersona = $scope.authentication.userprofile.clavePersona

        $scope.idRol = MenuService.getRolId();
        $scope.nuevosOCs = [];
        $scope.model = {
            clientes: 0,
            proveedores: 0,
            redExpertos: 0,
            estudiosMercado: 0,
            oportunidadNegocio: 0,

            competidores: 0,
            aliados: 0,
            fuentesFinan: 0,
            partesInteresadas: 0,
        };
        comunCountService.PI.countDerechosAutor().then(
            function (result) { $scope.derechosautor = result.data; },
            function (error) { $scope.derechosautor = 0; }
        );
        comunCountService.PI.countPropiedadIndustrial().then(
            function (result) { $scope.propiedadindustrial = result.data; },
            function (error) { $scope.propiedadindustrial = 0; }
        );
    }
}());