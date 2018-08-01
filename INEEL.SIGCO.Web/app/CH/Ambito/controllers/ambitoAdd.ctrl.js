(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("AmbitoCtrlAdd", ['AuthService', '$scope','AmbitoService', 'globalGet', '$state','comunService', AmbitoCtrlAdd]);
    function AmbitoCtrlAdd(AuthService, $scope, AmbitoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.ambito.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.ambito.descripcion.replace(/\n/g, "");
                $scope.ambito.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "ambito" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.ambito.fechaEfectiva = new Date();
                        $scope.ambito.estado = 1;
                        $scope.desactivar = true;
                        AmbitoService.Add($scope.ambito).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.AmbitoGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                            $scope.desactivar = false;
                                        });
                    }
                });
            }
        }
    }
})();