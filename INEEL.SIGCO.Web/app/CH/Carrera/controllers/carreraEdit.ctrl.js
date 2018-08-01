(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("CarreraCtrlEdit", ['AuthService', '$scope', 'CarreraService', 'globalGet', '$state', '$stateParams','comunService', CarreraCtrlEdit]);
    function CarreraCtrlEdit(AuthService, $scope, CarreraService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtener carrera
        CarreraService.getById(id).then(
            function (result) {
                $scope.carrera = result.data;
                $scope.excepcion = $scope.carrera.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });
        //Obtener Disciplinas
        //ObtenerDisciplinas
        CarreraService.DisciplinasGet().then(
            function (result) {
                $scope.Disciplinas = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Disciplina");
            })

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.CarreraForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.carrera.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.carrera.descripcion.replace(/\n/g, "");
                $scope.carrera.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "carrera", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                CarreraService.Update($scope.carrera).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.CarreraGet");
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