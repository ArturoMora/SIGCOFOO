(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoProductoServicioAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoProductoServicioCRService",
        "comunService",
        TipoProductoServicioAddCtrl
        ]);

    function TipoProductoServicioAddCtrl(AuthService, $scope, $state, $filter, TipoProductoServicioCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddProductoServicio = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoProductoServicio.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoProductoServicio" };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var tipoProductoServicio = {
                            "nombre": $scope.tipoProductoServicio.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.tipoProductoServicio.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,
                        };
                        TipoProductoServicioCRService.create(tipoProductoServicio)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipoProductoServicioGetAll");
                                },
                                function (err) {
                                    toastr.error(err.data.message);
                                    console.error(err);
                                });
                       }
                });
                
            }
        }
    }
})();