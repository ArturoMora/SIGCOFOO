(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("CongresoCtrlEdit", ['AuthService', '$scope', 'CongresoService', 'globalGet', '$state', '$stateParams','comunService', CongresoCtrlEdit]);
    function CongresoCtrlEdit(AuthService, $scope, CongresoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        CongresoService.getById(id).then(
            function (result) {
                $scope.congreso = result.data;
                $scope.excepcion = $scope.congreso.nombreCongreso.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            debugger;
            if ($scope.CongresoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                debugger;
                var sinEspacios = $scope.congreso.nombreCongreso.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.congreso.nombreCongreso.replace(/\n/g, "");
                $scope.congreso.nombreCongreso = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "congreso", "excepcion": $scope.excepcion};
                comunService.ValidacionExist(registro).then(function (result) {
                    debugger;
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                CongresoService.Update($scope.congreso).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.CongresoGet");
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