(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("TipoBecaCtrlEdit", ['AuthService', '$scope', 'TipoBecaService', 'globalGet', '$state', '$stateParams','comunService', TipoBecaCtrlEdit]);
    function TipoBecaCtrlEdit(AuthService, $scope, TipoBecaService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtener campo
        TipoBecaService.getById(id).then(
            function (result) {
                $scope.tipobeca = result.data;
                $scope.excepcion = $scope.tipobeca.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.TipoBecaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.tipobeca.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.tipobeca.descripcion.replace(/\n/g, "");
                $scope.tipobeca.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "tipobeca", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                TipoBecaService.Update($scope.tipobeca).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.TipoBecaGet");
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                    }
                });
            }
        }
    }
})();