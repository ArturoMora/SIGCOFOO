(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("PersonasEspecialistasGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "$uibModalInstance",
        "OportunidadNegocioCRService",
         PersonasEspecialistasGetCtrl
    ]);

    function PersonasEspecialistasGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, $uibModalInstance, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.personas = [];
        $scope.persona = {};

        OportunidadNegocioCRService.GetPersonas().then(
             function (result) {
                 $scope.personas = result.data;
                 debugger;
             },
             function (err) {
                 toastr.error(err);
             });

        $scope.personaSeleccionada = function (empleado) {
            $scope.persona = empleado;
            $uibModalInstance.close($scope.persona);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
