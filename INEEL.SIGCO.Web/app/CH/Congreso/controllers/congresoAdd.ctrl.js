(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("CongresoCtrlAdd", ['AuthService', '$scope', 'CongresoService', 'globalGet', '$state','comunService', CongresoCtrlAdd]);
    function CongresoCtrlAdd(AuthService, $scope, CongresoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            debugger;
            if ($scope.CongresoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.congreso.nombreCongreso.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.congreso.nombreCongreso.replace(/\n/g, "");
                $scope.congreso.nombreCongreso = sinEnter;
                
                var registro = { "dato": sinEspacios, "origen": "congreso" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.congreso.fechaEfectiva = new Date();
                        $scope.congreso.estado = 1;
                        $scope.desactivar = true;
                        CongresoService.Add($scope.congreso).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.CongresoGet");
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