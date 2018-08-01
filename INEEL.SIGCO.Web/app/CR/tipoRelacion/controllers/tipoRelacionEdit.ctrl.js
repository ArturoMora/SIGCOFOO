(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoRelacionEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TipoRelacionCRService",
        "comunService",
        TipoRelacionEditCtrl
        ]);

    function TipoRelacionEditCtrl($scope, $state, $stateParams, TipoRelacionCRService,comunService) {

        $scope.tipoRelacion_id = $stateParams.id;
        TipoRelacionCRService.get($scope.tipoRelacion_id).then(
            function (result) {
                $scope.tipoRelacion = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoRelacion = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoRelacion.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoRelacionEmpresa",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoRelacionCRService.update($scope.tipoRelacion)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tipoRelacionGetAll");
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