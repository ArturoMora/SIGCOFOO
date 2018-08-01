(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("EstadoSolicitudAddCtrl", ['AuthService', '$scope', 'EstadoSolicitudService', 'globalGet', '$state', EstadoSolicitudAddCtrl]);
    function EstadoSolicitudAddCtrl(AuthService, $scope, EstadoSolicitudService, globalGet, $state) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Software
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var Registro = {
                    "DescripcionCorta": $scope.estado.descripcionCorta,
                    "Descripcion": $scope.estado.descripcion,
                    "FechaEfectiva": new Date(),
                    "Estado": 1
                };
                debugger;
                EstadoSolicitudService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("EstadoSolicitud");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
    }
})();