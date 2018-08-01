(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TipoDocumentoEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TipoDocumentoCPService",
        "comunService",
        TipoDocumentoEditCtrl
        ]);

    function TipoDocumentoEditCtrl($scope, $state, $stateParams, TipoDocumentoCPService, comunService) {

        TipoDocumentoCPService.getById($stateParams.id).then(
            function (result) {
                $scope.tipoDocumento = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveDocumento = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoDocumento.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoDocumento",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoDocumentoCPService.update($scope.tipoDocumento)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("TipoDocumentoGetAll");
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