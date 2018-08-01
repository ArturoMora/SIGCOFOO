(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("EventoCtrlAdd", ['AuthService', '$scope', 'EventoService', 'globalGet', '$state','comunService', EventoCtrlAdd]);
    function EventoCtrlAdd(AuthService, $scope, EventoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.evento.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.evento.descripcion.replace(/\n/g, "");
                $scope.evento.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "evento" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.evento.fechaEfectiva = new Date();
                        $scope.evento.estado = 1;
                        $scope.desactivar = true;
                        EventoService.Add($scope.evento).then(
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