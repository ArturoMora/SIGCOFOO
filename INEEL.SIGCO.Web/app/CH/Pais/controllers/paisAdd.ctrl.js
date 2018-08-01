(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("PaisCtrlAdd", ['AuthService', '$scope', 'PaisService', 'globalGet', '$state','comunService', PaisCtrlAdd]);
    function PaisCtrlAdd(AuthService, $scope, PaisService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.pais.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.pais.descripcion.replace(/\n/g, "");
                $scope.pais.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "pais" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.pais.fechaEfectiva = new Date();
                        $scope.pais.estado = 1;
                        $scope.desactivar = true;
                        PaisService.Add($scope.pais).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.PaisGet");
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