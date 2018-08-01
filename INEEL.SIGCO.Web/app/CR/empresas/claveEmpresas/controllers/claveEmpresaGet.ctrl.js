(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ClaveEmpresaGetCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "EmpresasCRService",
            ClaveEmpresaGetCtrl
        ]);

    function ClaveEmpresaGetCtrl(AuthService, $scope, $uibModal, EmpresasCRService) {
        $scope.authentication = AuthService.authentication;
        var pagina;
        $scope.clavesEmpresas = [];
        $scope.claveEmpresa = {};

        $scope.recargar = function () {
            EmpresasCRService.getClavesEmpresas().then(
                function (result) {
                    $scope.clavesEmpresas = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.agregarClaveEmpresa = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/claveEmpresas/claveEmpresaAdd.html',
                controller: 'ClaveEmpresaAddCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.editarClaveEmpresa = function (id) {
            debugger;
            $scope.claveEmpresasId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/claveEmpresas/claveEmpresaEdit.html',
                controller: 'ClaveEmpresaEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.eliminacionLogica = function (id) {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + (id.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.claveEmpresa = id;
                        EmpresasCRService.deleteClaveEmpresa($scope.claveEmpresa).then(
                            function (success) {
                                
                            },
                            function (err) {                                
                                toastr.error("No se ha podido actualizar el estado");
                                $scope.cancel();
                            }
                        );
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.clavesEmpresas.indexOf(id));
                        $scope.clavesEmpresas[idx].estado = !$scope.clavesEmpresas[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.recargar();
    }
})();