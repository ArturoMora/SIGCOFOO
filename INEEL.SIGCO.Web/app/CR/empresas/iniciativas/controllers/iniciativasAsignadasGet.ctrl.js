(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("IniciativasAsignadasGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "IniciativasEmpresaCRService",
         IniciativasAsignadasGetCtrl
    ]);

    function IniciativasAsignadasGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, IniciativasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;

        $scope.iniciativasAsignadasEmpresa = [];

        $scope.recargar = function () {
            IniciativasEmpresaCRService.getIniciativasAsignadasEmpresa(id).then(
            function (result) {
                $scope.iniciativasAsignadasEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });
        }

        $scope.editarIniciativaAsignada = function (id) {
            $scope.folioId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/iniciativas/iniciativaAsignadaEdit.html',
                controller: 'IniciativaAsignadaEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detalleIniciativaAsignada = function (id) {
            $scope.folioId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/iniciativas/iniciativaAsignadaDetail.html',
                controller: 'IniciativaAsignadaDetailCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.recargar();

        $scope.eliminarIniciativa = function (i) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        IniciativasEmpresaCRService.delete(i).then(
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