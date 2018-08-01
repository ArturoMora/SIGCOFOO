(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("RevistaCtrlEdit", ['AuthService', '$scope', 'RevistaService', 'globalGet', '$state', '$stateParams','comunService', RevistaCtrlEdit]);
    function RevistaCtrlEdit(AuthService, $scope, RevistaService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        RevistaService.getById(id).then(
            function (result) {
                $scope.revista = result.data;
                $scope.excepcion = $scope.revista.revistaNombre.replace(/ /g, "").replace(/\n/g, "");
                debugger;
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
                debugger;
                var sinEspacios = $scope.revista.revistaNombre.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.revista.revistaNombre.replace(/\n/g, "");
                $scope.revista.revistaNombre = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "revista", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                RevistaService.Update($scope.revista).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.RevistaGet");
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