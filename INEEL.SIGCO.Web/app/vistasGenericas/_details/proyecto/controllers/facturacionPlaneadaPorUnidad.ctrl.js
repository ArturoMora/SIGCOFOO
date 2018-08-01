(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("facturacionPlaneadaPorUnidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            'comunService',
            '$filter',
            facturacionPlaneadaPorUnidadCtrl
        ]);

    function facturacionPlaneadaPorUnidadCtrl(AuthService, $scope, $state,
        $stateParams, 
        comunService, $filter) {
        $scope.registros = [];
        $scope.max = 100;
        var anio = $stateParams.id;
        try{
            $scope.anio = parseInt(anio);
        } catch (e) { anio = null; }
        $scope.cargarDaros = function (year) {
            comunService.proyectos_FacturacionPlaneadaGroupByUnidad(year).then(
                function (result) {
                    var data = $filter('orderBy')(result.data, '-total');
                    $scope.max = data[0].total;
                    $scope.registros = data;
                },
                function (error) {
                    $scope.registros = [];
                    toastr.error("Error al recuperar la información");
                }
            );
        }
        if (anio == undefined || anio==null || anio=='')
        {
            toastr.error("parametro no especificado o incorrecto", "A&ntilde;o");
        } else {
            //toastr.success("ok");
            $scope.cargarDaros($scope.anio);
        }

        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };
        $scope.recargar = function (year) {
            $scope.cargarDaros(year);
        }
    }
})();