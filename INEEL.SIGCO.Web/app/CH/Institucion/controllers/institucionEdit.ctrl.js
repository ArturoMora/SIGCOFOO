(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("InstitucionCtrlEdit", ['AuthService', '$scope', 'InstitucionService', 'globalGet', '$state', '$stateParams','comunService', InstitucionCtrlEdit]);
    function InstitucionCtrlEdit(AuthService, $scope, InstitucionService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtener Campos
        InstitucionService.GetPaises().then(
                function (result) {
                    $scope.paises = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });

        //Obtener disciplina
        InstitucionService.getById(id).then(
            function (result) {
                $scope.instituto = result.data;
                $scope.excepcion = $scope.instituto.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.instituto.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.instituto.descripcion.replace(/\n/g, "");
                $scope.instituto.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "instituto", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                InstitucionService.Update($scope.instituto).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.InstitucionGet");
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