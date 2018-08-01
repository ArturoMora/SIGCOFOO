(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CalificacionClienteAddCtrl", ['AuthService', '$scope', 'CalificacionClienteService', 'globalGet', '$state', 'comunService',CalificacionClienteAddCtrl]);
    function CalificacionClienteAddCtrl(AuthService, $scope, CalificacionClienteService, globalGet, $state,comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Software
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.cliente.nombre, "origen": "MT.califCte" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var Registro = {
                            "Nombre": $scope.cliente.nombre,
                            "NombreCorto": $scope.cliente.nombreCorto,
                            "FechaAlta": new Date(),
                            "Estado": 1
                        };
                        CalificacionClienteService.create(Registro).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("CalificacionClienteGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });
            }
        }
    }
})();