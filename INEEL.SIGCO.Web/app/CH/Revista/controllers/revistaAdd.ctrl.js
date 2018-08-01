(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("RevistaCtrlAdd", ['AuthService', '$scope', 'RevistaService', 'globalGet', '$state','comunService', RevistaCtrlAdd]);
    function RevistaCtrlAdd(AuthService, $scope, RevistaService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.revista.revistaNombre.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.revista.revistaNombre.replace(/\n/g, "");
                $scope.revista.revistaNombre = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "revista" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.revista.fechaEfectiva = new Date();
                        $scope.revista.estado = 1;
                        $scope.desactivar = true;
                        RevistaService.Add($scope.revista).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.RevistaGet");
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