(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoRelacionAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoRelacionCRService",
        "comunService",
        TipoRelacionAddCtrl
        ]);

    function TipoRelacionAddCtrl(AuthService, $scope, $state, $filter, TipoRelacionCRService,comunService) {
        $scope.authentication = AuthService.authentication;    
        $scope.AddTipoRelacion = function () {
                    if ($scope.form.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        var registro = { "dato": $scope.tipoRelacion.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoRelacionEmpresa" };
                        comunService.ValidacionExistCR(registro).then(function(result) {
                            $scope.existente = result.data;
                            if ($scope.existente) {
                                toastr.warning("El registro ya existe!");
                                return false;
                            } else {
                                var TipoRelacion = {
                                    "nombre": $scope.tipoRelacion.nombre.replace(/\n/g, ""),
                                    "descripcion": $scope.tipoRelacion.descripcion,
                                    "fechaEfectiva": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                    "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                    "autor": AuthService.authentication.nombreCompleto,
                                    "estado": 1,

                                };
                                TipoRelacionCRService.create(TipoRelacion).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipoRelacionGetAll");
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