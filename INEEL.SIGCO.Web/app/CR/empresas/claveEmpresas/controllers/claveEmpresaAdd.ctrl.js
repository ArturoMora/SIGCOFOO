(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ClaveEmpresaAddCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "$uibModalInstance",
            "EmpresasCRService",
            "comunService",
            ClaveEmpresaAddCtrl
        ]);

    function ClaveEmpresaAddCtrl(AuthService, $scope, $uibModal, $uibModalInstance, EmpresasCRService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.claveEmpresa = {};

        $scope.claveEmpresa.autor = AuthService.authentication.nombreCompleto;

        $scope.ok = function () {
            var registro = {
                "dato": $scope.claveEmpresa.claveEmpresa.replace(/ /g, "").replace(/\n/g, ""),
                "origen": "CR.cat_ClavesEmpresas"
            };
            comunService.ValidacionExistCR(registro)
                .then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        $scope.claveEmpresa.claveEmpresa= "";
                        return false;
                    } else {
                        EmpresasCRService.createClaveEmpresa($scope.claveEmpresa).then(
                            function (result) {
                                toastr.success(result.data);
                                $uibModalInstance.dismiss('cancel');
                                $scope.recargar();
                            },
                            function (err) {
                                toastr.error(result.data.exceptionMessage);
                            });
                    }
                });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
