(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("EventoCtrlEdit", ['AuthService', '$scope', 'EventoService', 'globalGet', '$state', '$stateParams','comunService', EventoCtrlEdit]);
    function EventoCtrlEdit(AuthService, $scope, EventoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        EventoService.getById(id).then(
            function (result) {
                $scope.evento = result.data;
                $scope.excepcion = $scope.evento.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.evento.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.evento.descripcion.replace(/\n/g, "");
                $scope.evento.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "evento", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                EventoService.Update($scope.evento).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.EventoGet");
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