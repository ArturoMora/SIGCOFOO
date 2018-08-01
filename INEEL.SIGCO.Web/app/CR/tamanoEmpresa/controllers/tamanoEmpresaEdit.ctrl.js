(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TamanoEmpresaEditCtrl2", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TamanoEmpresaCRService",
        "comunService",
        TamanoEmpresaEditCtrl2
        ]);

    function TamanoEmpresaEditCtrl2(AuthService, $scope, $state, $stateParams, TamanoEmpresaCRService,comunService) {
        $scope.tamanoEmpresa_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TamanoEmpresaCRService.get($scope.tamanoEmpresa_id).then(
            function (result) {
                $scope.tamanoEmpresa = result.data;
                $scope.excepcion = result.data.nomTamEmp.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTamanoEmpresa = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tamanoEmpresa.nomTamEmp.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TamanoEmpresa",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TamanoEmpresaCRService.update($scope.tamanoEmpresa)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tamanoEmpresaGet");
                                    },
                                    function (err) {
                                        console.error(err);
                                    });
                        }
                    });
                
            }

        };
    }
})();