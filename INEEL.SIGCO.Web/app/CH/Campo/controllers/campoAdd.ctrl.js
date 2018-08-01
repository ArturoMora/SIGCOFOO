(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("CampoCtrlAdd", ['AuthService', '$scope', 'CampoService', 'globalGet', '$state','comunService', CampoCtrlAdd]);
    function CampoCtrlAdd(AuthService, $scope, CampoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.CampoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.campo.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.campo.descripcion.replace(/\n/g, "");
                $scope.campo.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "campo" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.campo.fechaEfectiva = new Date();
                        $scope.campo.estado = 1;
                        $scope.desactivar = true;
                        CampoService.Add($scope.campo).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.CamposGet");
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