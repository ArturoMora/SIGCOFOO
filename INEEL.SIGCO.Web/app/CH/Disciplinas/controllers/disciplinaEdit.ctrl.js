(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("DisciplinaCtrlEdit", ['AuthService', '$scope', 'DisciplinaService', 'globalGet', '$state', '$stateParams','comunService', DisciplinaCtrlEdit]);
    function DisciplinaCtrlEdit(AuthService, $scope, DisciplinaService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtener Campos
        DisciplinaService.GeCampos().then(
                function (campo) {
                    $scope.campos = campo.data;
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });

        //Obtener disciplina
        DisciplinaService.getById(id).then(
            function (result) {
                $scope.disciplina = result.data;
                $scope.excepcion = $scope.disciplina.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.DisciplinaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                debugger;
                var sinEspacios = $scope.disciplina.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.disciplina.descripcion.replace(/\n/g, "");
                $scope.disciplina.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "disciplina", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                DisciplinaService.Update($scope.disciplina).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.DisciplinaGet");
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