(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TipoLineamientoEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TipoLineamientoCPService",
        "comunService",
        TipoLineamientoEditCtrl
        ]);

    function TipoLineamientoEditCtrl($scope, $state, $stateParams, TipoLineamientoCPService, comunService) {

        TipoLineamientoCPService.getById($stateParams.id).then(
            function (result) {
                $scope.tipoLineamiento = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveLineamiento = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoLineamiento.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoLineamiento",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoLineamientoCPService.update($scope.tipoLineamiento)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("TipoLineamientoGetAll");
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