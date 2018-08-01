(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("BecasInternasCtrlEdit", ['AuthService', '$scope', 'BecaInternaService', 'globalGet', '$state', '$stateParams','comunService', BecasInternasCtrlEdit]);
    function BecasInternasCtrlEdit(AuthService, $scope, BecaInternaService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        BecaInternaService.getById(id).then(
            function (result) {
                $scope.beca = result.data;
                $scope.excepcion = $scope.beca.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.BecaInternaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.beca.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.beca.descripcion.replace(/\n/g, "");
                $scope.beca.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "becainterna", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                BecaInternaService.Update($scope.beca).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.BecaInternaGet");
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