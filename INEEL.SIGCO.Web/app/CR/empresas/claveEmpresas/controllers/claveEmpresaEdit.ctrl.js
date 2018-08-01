(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ClaveEmpresaEditCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "$uibModalInstance",
            "EmpresasCRService",
            "comunService",
            ClaveEmpresaEditCtrl
        ]);

    function ClaveEmpresaEditCtrl(AuthService, $scope, $uibModal, $uibModalInstance, EmpresasCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.claveEmpresaEdit = {};
        var Id = $scope.claveEmpresasId;

        EmpresasCRService.getClaveEmpresa(Id).then(
            function (result) {
                $scope.claveEmpresaEdit = result.data;
                $scope.excepcion = result.data.claveEmpresa.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                toastr.error(err);
            });

        $scope.ok = function () {
            if ($scope.claveEmpresaEditForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.claveEmpresaEdit.claveEmpresa.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "CR.cat_ClavesEmpresas",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            EmpresasCRService.updateClaveEmpresa($scope.claveEmpresaEdit).then(
                                function (result) {
                                toastr.success(result.data);
                                $uibModalInstance.dismiss('cancel');
                                $scope.recargar();
                            },
                            function (err) {
                                toastr.error(data.exceptionMessage);
                            });
                        }
                    });
                
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
