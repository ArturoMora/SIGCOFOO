(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ProyectosAsignadosGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "ProyectosEmpresaCRService",
        ProyectosAsignadosGetCtrl
    ]);

    function ProyectosAsignadosGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, ProyectosEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;

        $scope.proyectosAsignadosEmpresa = [];
        $scope.proyectoAsginadoEdit = {};

        $scope.recargar = function() {
            ProyectosEmpresaCRService.getProyectosAsignadosEmpresa(id).then(
            function (result) {
                $scope.proyectosAsignadosEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });
        }

        $scope.editarProyectoAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/proyectos/proyectoAsignadoEdit.html',
                controller: 'ProyectoAsignadoEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detalleProyectoAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/proyectos/proyectoAsignadoDetail.html',
                controller: 'ProyectoAsignadoDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.recargar();

        $scope.eliminarProyecto = function (p) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ProyectosEmpresaCRService.delete(p).then(
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
