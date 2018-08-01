(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoFuenteFinanciamientoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoFuenteFinanciamientoCRService",
        "comunService",
        TipoFuenteFinanciamientoAddCtrl
        ]);

    function TipoFuenteFinanciamientoAddCtrl(AuthService, $scope, $state, $filter, TipoFuenteFinanciamientoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddTipoFuenteFinanciamiento = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {"dato": $scope.tipoFuenteFinanciamiento.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoFuentesFinanciamiento"};
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var tipoFuenteFinanciamiento = {
                                "nombre": $scope.tipoFuenteFinanciamiento.nombre.replace(/\n/g, ""),
                                "descripcion": $scope.tipoFuenteFinanciamiento.descripcion,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,

                            };
                            TipoFuenteFinanciamientoCRService.create(tipoFuenteFinanciamiento)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tipoFuenteFinanciamientoGet");
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
                
            }
        }
    }
})();