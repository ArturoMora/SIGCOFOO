(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CalificacionPersonalAddCtrl", ['AuthService', '$scope', 'CalificacionPersonalService', 'globalGet', '$state','comunService', CalificacionPersonalAddCtrl]);
    function CalificacionPersonalAddCtrl(AuthService, $scope, CalificacionPersonalService, globalGet, $state,comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Software
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.personal.nombre, "origen": "MT.califCte" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var registro = { "dato": $scope.personal.nombre, "origen": "MT.califPer" };
                        comunService.ValidacionExist(registro).then(function (result) {
                            $scope.existente = result.data;
                            if ($scope.existente == true) {
                                toastr.warning("El registro ya existe!");
                                return false;
                            } else {
                                var Registro = {
                                    "Nombre": $scope.personal.nombre,
                                    "NombreCorto": $scope.personal.nombreCorto,
                                    "FechaAlta": new Date(),
                                    "Estado": 1
                                };
                                CalificacionPersonalService.create(Registro).then(
                                                function (result) {
                                                    toastr.success(result.data);
                                                    $state.go("CalificacionPersonalGet");
                                                },
                                                function (err) {
                                                    console.error(err);
                                                });
                            }
                        });
                    }
                });
            }
        }
    }
})();