(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ConfirmacionSeguimientoCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "MenuService",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "ContactosCRService",
        "OportunidadNegocioCRService",
         ConfirmacionSeguimientoCtrl
    ]);

    function ConfirmacionSeguimientoCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.ok = function () {
            OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                function (result) {
                    $scope.oportunidad = result.data;
                    //$scope.enviarCorreos();
                    $uibModalInstance.dismiss('cancel');
                    $state.go("seguimientoOportunidad");
                },
                function (err) {
                    toastr.error(err);
                }
            );
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



     

    }
})();
