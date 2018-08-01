(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("IniciativasAsignadasUnidadesEmpresasDetailsCtrl", [
        "AuthService",
        "$scope",
        "$uibModalInstance",
        "IniciativasEmpresaCRService",
         IniciativasAsignadasUnidadesEmpresasDetailsCtrl
    ]);

    function IniciativasAsignadasUnidadesEmpresasDetailsCtrl(AuthService, $scope, $uibModalInstance, IniciativasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var iniciativaId = $scope.folioId;
        $scope.iniciativaAsignadaDetail = {};

        IniciativasEmpresaCRService.getIniciativaEmpresaAsignada(iniciativaId).then(
        function (result) {
            $scope.iniciativaAsignadaDetail = result.data;
        },
        function (err) {
            toastr.error(data.exceptionMessage);
        });

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }
})();