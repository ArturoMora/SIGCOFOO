(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("AsociacionCtrlAdd", ['AuthService', '$scope', 'AsociacionService', 'globalGet', '$state','comunService', AsociacionCtrlAdd]);
    function AsociacionCtrlAdd(AuthService, $scope, AsociacionService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.AsociacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.asociacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.asociacion.descripcion.replace(/\n/g, "");
                $scope.asociacion.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "asociacion" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data; if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.asociacion.fechaEfectiva = new Date();
                        $scope.asociacion.estado = 1;
                        $scope.desactivar = true;
                        AsociacionService.Add($scope.asociacion).then(
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