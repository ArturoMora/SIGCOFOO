(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoFuenteFinanciamientoEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoFuenteFinanciamientoCRService",
        "comunService",
        TipoFuenteFinanciamientoEditCtrl
        ]);

    function TipoFuenteFinanciamientoEditCtrl(AuthService,$scope, $state, $stateParams, TipoFuenteFinanciamientoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoFuenteFinanciamiento_id = $stateParams.id;
        TipoFuenteFinanciamientoCRService.get($scope.tipoFuenteFinanciamiento_id).then(
            function (result) {
                $scope.tipoFuenteFinanciamiento = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoFuenteFinanciamiento = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoFuenteFinanciamiento.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoFuentesFinanciamiento",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoFuenteFinanciamientoCRService.update($scope.tipoFuenteFinanciamiento)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tipoFuenteFinanciamientoGet");
                                    },
                                    function (err) {
                                        console.error(err);
                                    });
                        }
                    });
                
            }
        };
    }
})();