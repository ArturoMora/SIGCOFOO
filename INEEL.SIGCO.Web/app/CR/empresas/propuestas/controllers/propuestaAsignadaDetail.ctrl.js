(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("PropuestaAsignadaDetailsCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "PropuestasEmpresaCRService",
         PropuestaAsignadaDetailsCtrl
    ]);

    function PropuestaAsignadaDetailsCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, EmpresasCRService, PropuestasEmpresaCRService) {

        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var propuestaId = $scope.proyectoId;

        $scope.propuestaAsignadaDetails = {};

        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error("Error al recuperar los datos de la empresa");
              console.log(err);
          });

        PropuestasEmpresaCRService.getPropuestaEmpresaAsignada(propuestaId).then(
        function (result) {
            $scope.propuestaAsignadaDetails = result.data;
        },
        function (err) {
            toastr.error("Error al cargar las propuestas asignadas a la empresa");
            console.log(err);
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();