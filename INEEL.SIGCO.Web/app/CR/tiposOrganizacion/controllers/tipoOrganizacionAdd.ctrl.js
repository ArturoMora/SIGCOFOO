(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoOrganizacionAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TiposOrganizacionCRService",
        "comunService",
        TipoOrganizacionAddCtrl
        ]);

    function TipoOrganizacionAddCtrl(AuthService, $scope, $state,  $filter, TipoOrganizacionCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoOrganizacion = {};

        $scope.AddTipoOrganizacion = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoOrganizacion.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoOrganizacion" };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.tipoOrganizacion.nombre = $scope.tipoOrganizacion.nombre.replace(/\n/g, "");
                        $scope.tipoOrganizacion.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                        $scope.tipoOrganizacion.estado = 1;
                        $scope.tipoOrganizacion.autor = AuthService.authentication.nombreCompleto;

                        TipoOrganizacionCRService.create($scope.tipoOrganizacion)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tiposOrganizacionGet");
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