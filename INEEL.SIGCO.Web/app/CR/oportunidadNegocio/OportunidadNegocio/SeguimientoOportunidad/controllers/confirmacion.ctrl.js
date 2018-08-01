(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ConfirmacionCtrl", [
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
         ConfirmacionCtrl
    ]);

    function ConfirmacionCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.ok = function () {
            OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                function (result) {
                    $scope.oportunidad = result.data;
                    //$scope.enviarCorreos();
                    $uibModalInstance.dismiss('cancel');
                    $state.go("historialOportunidades");
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
