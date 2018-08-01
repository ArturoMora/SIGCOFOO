(function() {
    "use strict";
    angular
        .module("ineelMT")
        .controller("TipoInsumoAddCtrl", ['AuthService', '$scope', 'TipoInsumoService', 'globalGet', '$state', 'comunService', TipoInsumoAddCtrl]);
    function TipoInsumoAddCtrl(AuthService, $scope, TipoInsumoService, globalGet, $state, comunService) {
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Insumo
        $scope.save=function() {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoInsumo.descripcionInsumo, "origen": "MT.tipoinsumo" };
                comunService.ValidacionExist(registro).then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente == true) {
                            toastr.warning("El registro ya existe!");
                            return false;
                        } else {
                            var Registro = {
                                "DescripcionInsumo": $scope.tipoInsumo.descripcionInsumo,
                                "EstadoDisponible":true

                            };
                            TipoInsumoService.Add(Registro)
                                .then(function(result) {
                                        toastr.success(result.data);
                                        $state.go("tipoInsumoGet");
                                    },
                                    function(error) {
                                        toastr.error("No se ha podido insertar el registro");
                                        console.log(error.message);
                                    }
                                );
                        }
                    });
            }
        }
    }
})();