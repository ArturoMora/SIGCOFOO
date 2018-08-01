(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("PropuestasAsignadasGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "PropuestasEmpresaCRService",
        PropuestasAsignadasGetCtrl
    ]);

    function PropuestasAsignadasGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, PropuestasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;

        $scope.propuestasAsignadsEmpresa = [];

        $scope.recargar = function () {
            PropuestasEmpresaCRService.getPropuestasAsignadasEmpresa(id).then(
            function (result) {
                $scope.propuestasAsignadosEmpresa = result.data;
                debugger;
            },
            function (err) {
                toastr.error(err);
            });
        }

        $scope.editarPropuestaAsignada = function (id) {
            $scope.propuestaId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/propuestas/propuestaAsignadaEdit.html',
                controller: 'PropuestaAsignadaEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detallePropuestaAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/propuestas/propuestaAsignadaDetail.html',
                controller: 'PropuestaAsignadaDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.recargar();

        $scope.eliminarPropuesta = function (p) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        PropuestasEmpresaCRService.delete(p).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $scope.recargar();
                                    $uibModalInstance.dismiss('cancel');
                                },
                        function (err) {
                            toastr.error(data.exceptionMessage);
                        });
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }
})();
