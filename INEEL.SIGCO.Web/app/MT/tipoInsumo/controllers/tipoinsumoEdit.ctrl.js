(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("TipoInsumoEditCtrl", ['AuthService', '$scope', 'TipoInsumoService', 'globalGet', '$state', '$stateParams', 'comunService', TipoInsumoEditCtrl]);
    function TipoInsumoEditCtrl(AuthService, $scope, TipoInsumoService, globalGet, $state, $stateParams, comunService) {
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        debugger;
        TipoInsumoService.getById(id)
            .then(function(result) {
                $scope.insumos = result.data;
                $scope.excepcion = $scope.insumos.descripcionInsumo;
                },function(error) {
                    console.error(error.message);
                }
            );

        //Guardar cambios
        $scope.save = function () {
            debugger;
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    dato: $scope.insumos.descripcionInsumo,
                    "origen": "MT.tipoinsumo",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExist(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        TipoInsumoService.Update($scope.insumos)
                            .then(
                                function(result) {
                                    toastr.success(result.data);
                                    $state.go("tipoInsumoGet");
                                },
                                function(error) {
                                    console.error(error.message);
                                });
                    }

                });
            }
        }
    }
})();