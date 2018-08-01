(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TamanoEmpresaGetCtrl", [
        "AuthService",
        "$scope",
        "TamanoEmpresaCRService",
        "$uibModal",
        TamanoEmpresaGetCtrl
        ]);

    function TamanoEmpresaGetCtrl(AuthService,$scope, TamanoEmpresaCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        TamanoEmpresaCRService.getAll().then(
            function (result) {
                $scope.tamanoEmpresa = result.data;
            },
            function (err) {
                console.error(err);
            });

        $scope.saveEstado = function (empresa) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (empresa.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TamanoEmpresaCRService.UpdateEstado(empresa).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tamanoEmpresa.indexOf(empresa));
                        $scope.tamanoEmpresa[idx].estado = !$scope.tamanoEmpresa[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();