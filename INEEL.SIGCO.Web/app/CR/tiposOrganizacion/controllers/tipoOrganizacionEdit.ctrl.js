(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoOrganizacionEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TiposOrganizacionCRService",
        "comunService",
        TipoOrganizacionEditCtrl
        ]);

    function TipoOrganizacionEditCtrl($scope, $state, $stateParams, TiposOrganizacionCRService,comunService) {
        $scope.tipoOrganizacion_id = $stateParams.id;

        TiposOrganizacionCRService.getTipoOrganizacion($scope.tipoOrganizacion_id).then(
            function (result) {
                $scope.tiposOrganizacion = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoOrganizacion = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tiposOrganizacion.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoOrganizacion", "excepcion": $scope.excepcion };
                comunService.ValidacionExistCR(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        TiposOrganizacionCRService.update($scope.tiposOrganizacion)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tiposOrganizacionGet");
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