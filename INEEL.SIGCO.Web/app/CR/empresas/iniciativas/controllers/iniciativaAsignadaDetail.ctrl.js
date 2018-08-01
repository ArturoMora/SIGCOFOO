(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("IniciativaAsignadaDetailCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "IniciativasEmpresaCRService",
         IniciativaAsignadaDetailCtrl
    ]);

    function IniciativaAsignadaDetailCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, EmpresasCRService, IniciativasEmpresaCRService) {

        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var iniciativaId = $scope.folioId;

        $scope.iniciativaAsignadaDetail = {};

        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error(data.exceptionMessage);
          });

        IniciativasEmpresaCRService.getIniciativaEmpresaAsignada(iniciativaId).then(
        function (result) {
            $scope.iniciativaAsignadaDetail = result.data;
        },
        function (err) {
            toastr.error(data.exceptionMessage);
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();