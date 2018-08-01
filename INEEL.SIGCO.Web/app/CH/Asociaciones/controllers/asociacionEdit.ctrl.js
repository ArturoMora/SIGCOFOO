(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("AsociacionCtrlEdit", ['AuthService', '$scope', 'AsociacionService', 'globalGet', '$state', '$stateParams','comunService', AsociacionCtrlEdit]);
    function AsociacionCtrlEdit(AuthService, $scope, AsociacionService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        AsociacionService.getById(id).then(
            function (result) {
                $scope.asociacion = result.data;
                $scope.excepcion = $scope.asociacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
                $scope.asociacion.fechaEfectiva = new Date(result.data.fechaEfectiva);
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.AsociacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.asociacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.asociacion.descripcion.replace(/\n/g, "");
                $scope.asociacion.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "asociacion", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                AsociacionService.Update($scope.asociacion).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.AsociacionGet");
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