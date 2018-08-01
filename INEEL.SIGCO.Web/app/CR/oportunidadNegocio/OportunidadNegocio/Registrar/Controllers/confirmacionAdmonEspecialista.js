(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ConfirmaAdmonEspecialistaCtrl", [
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
         ConfirmaAdmonEspecialistaCtrl
    ]);

    function ConfirmaAdmonEspecialistaCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.ok = function () {
            OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                function (result) {
                    $scope.oportunidad = result.data;

                    debugger;
                    $state.go("asignarOportunidad");
                    $state.go("home.misOportunidadesAsignadas");
                    $scope.enviarCorreos();
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
