(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TamanoEmpresaAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TamanoEmpresaCRService",
        "comunService",
        TamanoEmpresaAddCtrl
        ]);

    function TamanoEmpresaAddCtrl(AuthService, $scope, $state, $filter, TamanoEmpresaCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddtamanoEmpresa = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tamanoEmpresa.nomTamEmp.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TamanoEmpresa"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var tamanoEmpresa = {
                                "nomTamEmp": $scope.tamanoEmpresa.nomTamEmp.replace(/\n/g, ""),
                                "desTamEmp": $scope.tamanoEmpresa.desTamEmp,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,

                            };
                            TamanoEmpresaCRService.create(tamanoEmpresa)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tamanoEmpresaGet");
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
                
            }

            
        }
    }
})();