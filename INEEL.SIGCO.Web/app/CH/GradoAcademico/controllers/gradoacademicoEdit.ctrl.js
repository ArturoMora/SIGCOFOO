(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("GradoAcademicoCtrlEdit", ['AuthService', '$scope', 'GradoAcademicoService', 'globalGet', '$state', '$stateParams','comunService', GradoAcademicoCtrlEdit]);
    function GradoAcademicoCtrlEdit(AuthService, $scope, GradoAcademicoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        GradoAcademicoService.getById(id).then(
            function (result) {
                $scope.grado = result.data;
                $scope.excepcion = $scope.grado.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.grado.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.grado.descripcion.replace(/\n/g, "");
                $scope.grado.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "gradoacademico", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                GradoAcademicoService.Update($scope.grado).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.GradoAcademicoGet");
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