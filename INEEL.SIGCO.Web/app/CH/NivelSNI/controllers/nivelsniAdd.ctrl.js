(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("NivelSNICtrlAdd", ['AuthService', '$scope', 'NivelSNIService', 'globalGet', '$state','comunService', NivelSNICtrlAdd]);
    function NivelSNICtrlAdd(AuthService, $scope, NivelSNIService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.nvl.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.nvl.descripcion.replace(/\n/g, "");
                $scope.nvl.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "nvlsni" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.nvl.fechaEfectiva = new Date();
                        $scope.nvl.estado = 1;
                        $scope.desactivar = true;
                        NivelSNIService.Add($scope.nvl).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.NivelSNIGet");
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