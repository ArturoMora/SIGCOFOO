(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("NivelSNICtrlEdit", ['AuthService', '$scope', 'NivelSNIService', 'globalGet', '$state', '$stateParams','comunService', NivelSNICtrlEdit]);
    function NivelSNICtrlEdit(AuthService, $scope, NivelSNIService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        NivelSNIService.getById(id).then(
            function (result) {
                $scope.nvl = result.data;
                $scope.excepcion = $scope.nvl.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.nvl.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.nvl.descripcion.replace(/\n/g, "");
                $scope.nvl.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "nvlsni", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                NivelSNIService.Update($scope.nvl).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.NivelSNIGet");
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