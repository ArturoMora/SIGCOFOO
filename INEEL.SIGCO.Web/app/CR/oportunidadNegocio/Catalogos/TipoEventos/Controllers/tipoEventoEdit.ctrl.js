(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoEventoEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "$uibModalInstance",
            "$filter",
            "$stateParams",
            "globalGet",
            "OportunidadNegocioCRService",
            "comunService",
            TipoEventoEditCtrl
        ]);

    function TipoEventoEditCtrl(AuthService, $scope, $state, $uibModal, $uibModalInstance, $filter, $stateParams, globalGet, OportunidadNegocioCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoEventoEdit = {};
        var tipoEventoId = $scope.tipoEventoONId;

        OportunidadNegocioCRService.getTipoEvento(tipoEventoId).then(
            function (result) {
                $scope.tipoEventoEdit = result.data;
                $scope.excepcion=result.data.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                toastr.error(err);
            });

        $scope.ok = function () {
            if ($scope.tipoEventoEditForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoEventoEdit.nombreEvento.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TiposEventos",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            OportunidadNegocioCRService.updateTipoEvento($scope.tipoEventoEdit).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $uibModalInstance.dismiss('cancel');
                                    $scope.recargar();
                                },
                                function (err) {
                                    toastr.error(data.exceptionMessage);
                                });
                        }
                    });
                
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
