(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("MapasRutaDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$rootScope",
            "$stateParams",
            "MapasRutaCPService",
            "AutoresCPService",
            "DTOptionsBuilder",
            MapasRutaDetailsCtrl
        ]);

    function MapasRutaDetailsCtrl(AuthService, $scope, $state,$rootScope, $stateParams, MapasRutaCPService, AutoresCPService, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        $scope.mapaId = $stateParams.id;
        MapasRutaCPService.getById($scope.mapaId).then(
            function (result) {
                $scope.mapas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
               // console.log(err);
            });

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 1, 'ContenidoId': $scope.mapaId };
        AutoresCPService.getByContenido(busqueda).then(
            function (result) {
                $scope.autores = result.data;
            }, function (error) {
                toastr.error("No se han podido cargar los registros de autores");
               // console.log(error);
            });


        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }

})();