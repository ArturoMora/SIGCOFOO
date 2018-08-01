(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoProductoServicioEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoProductoServicioCRService",
        "comunService",
        TipoProductoServicioEditCtrl
        ]);

    function TipoProductoServicioEditCtrl(AuthService,$scope, $state, $stateParams, TipoProductoServicioCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoProductoServicio_id = $stateParams.id;

        TipoProductoServicioCRService.get($scope.tipoProductoServicio_id).then(
            function (result) {
                $scope.tipoProductoServicio = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoProductoServicio = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoProductoServicio.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoProductoServicio",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoProductoServicioCRService.update($scope.tipoProductoServicio)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tipoProductoServicioGetAll");
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