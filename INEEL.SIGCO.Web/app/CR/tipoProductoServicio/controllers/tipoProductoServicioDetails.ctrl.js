(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoProductoServicioDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoProductoServicioCRService",
        TipoProductoServicioDetailsCtrl
        ]);

    function TipoProductoServicioDetailsCtrl(AuthService,$scope, $state, $stateParams, TipoProductoServicioCRService) {
        $scope.tipoProductoServicio_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TipoProductoServicioCRService.get($scope.tipoProductoServicio_id).then(
            function (result) {
                $scope.tipoProductoServicio = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;

            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
        }
    }
})();