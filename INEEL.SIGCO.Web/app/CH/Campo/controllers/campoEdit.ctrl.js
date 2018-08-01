(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("CampoCtrlEdit", ['AuthService', '$scope', 'CampoService', 'globalGet', '$state', '$stateParams','comunService', CampoCtrlEdit]);
    function CampoCtrlEdit(AuthService, $scope, CampoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtener campo
        CampoService.getById(id).then(
            function (result) {
                $scope.campo = result.data;
                $scope.excepcion = $scope.campo.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.CampoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.campo.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.campo.descripcion.replace(/\n/g, "");
                $scope.campo.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "campo", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                CampoService.Update($scope.campo).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.CamposGet");
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