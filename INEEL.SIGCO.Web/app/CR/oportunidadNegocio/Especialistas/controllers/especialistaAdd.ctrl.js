(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EspecialitaAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "$uibModalInstance",
            "$filter",
            "$stateParams",
            "globalGet",
            "OportunidadNegocioCRService",
            EspecialitaAddCtrl
        ]);

    function EspecialitaAddCtrl(AuthService, $scope, $state, $uibModal, $uibModalInstance, $filter, $stateParams, globalGet, OportunidadNegocioCRService) {

        $scope.especialista = {};

        $scope.ok = function () {
            if ($scope.tipoEventoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
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
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
