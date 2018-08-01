(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("NivelCursoCtrlEdit", ['AuthService', '$scope', 'NivelCursoService', 'globalGet', '$state', '$stateParams','comunService', NivelCursoCtrlEdit]);
    function NivelCursoCtrlEdit(AuthService, $scope, NivelCursoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        NivelCursoService.getById(id).then(
            function (result) {
                $scope.curso = result.data;
                $scope.excepcion = $scope.curso.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.curso.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.curso.descripcion.replace(/\n/g, "");
                $scope.curso.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "nivelcurso", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                NivelCursoService.Update($scope.curso).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.NivelCursoGet");
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