(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoEventoAddCtrl", [
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
            TipoEventoAddCtrl
        ]);

    function TipoEventoAddCtrl(AuthService, $scope, $state, $uibModal, $uibModalInstance, $filter, $stateParams, globalGet, OportunidadNegocioCRService,comunService) {

        $scope.tipoEvento = {};
        $scope.fechaActual = new Date();

        $scope.ok = function () {
            if ($scope.tipoEvento.fechaAlta > $scope.fechaActual) {
                toastr.error("La fecha no debe ser mayor a la actual");
                return false;
            }
            if ($scope.tipoEventoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoEvento.nombreEvento.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TiposEventos"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            $scope.tipoEvento.nombreEvento = $scope.tipoEvento.nombreEvento.replace(/\n/g, "");
                            OportunidadNegocioCRService.createTipoEvento($scope.tipoEvento).then(
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
