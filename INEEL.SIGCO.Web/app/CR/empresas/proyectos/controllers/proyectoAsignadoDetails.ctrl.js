(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ProyectoAsignadoDetailsCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "ProyectosEmpresaCRService",
        ProyectoAsignadoDetailsCtrl
    ]);

    function ProyectoAsignadoDetailsCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, EmpresasCRService, ProyectosEmpresaCRService) {

        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var proyectoId = $scope.proyectoId;

        $scope.proyectoAsginadoDetails = {};

        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error(data.exceptionMessage);
          });

        ProyectosEmpresaCRService.getProyectoEmpresaAsignado(proyectoId).then(
        function (result) {
            $scope.proyectoAsginadoDetails = result.data;
        },
        function (err) {
            toastr.error(data.exceptionMessage);
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();