(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("TipoSoftwareAddCtrl", ['AuthService', '$scope', 'TipoSoftwareService', 'globalGet', '$state', 'comunService',TipoSoftwareAddCtrl]);
    function TipoSoftwareAddCtrl(AuthService, $scope, TipoSoftwareService, globalGet, $state,comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Software
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.software.nombre, "origen": "MT.tiposoftware" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var Registro = {
                            "Nombre": $scope.software.nombre,
                            "Descripcion": $scope.software.descripcion,
                            "FechaRegistro": new Date(),
                            "FechaEfectiva": new Date(),
                            "estado": true
                        };
                        TipoSoftwareService.Add(Registro).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("TipoSoftwareGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });
                }}
    }
})();