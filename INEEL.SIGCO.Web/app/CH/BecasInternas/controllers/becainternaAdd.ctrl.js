(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("BecasInternasCtrlAdd", ['AuthService', '$scope', 'BecaInternaService', 'globalGet', '$state','comunService', BecasInternasCtrlAdd]);
    function BecasInternasCtrlAdd(AuthService, $scope, BecaInternaService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.BecaInternaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.beca.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.beca.descripcion.replace(/\n/g, "");
                $scope.beca.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "becainterna" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data; if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.beca.fechaEfectiva = new Date();
                        $scope.beca.estado = 1;
                        $scope.desactivar = true;
                        BecaInternaService.Add($scope.beca).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.BecaInternaGet");
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