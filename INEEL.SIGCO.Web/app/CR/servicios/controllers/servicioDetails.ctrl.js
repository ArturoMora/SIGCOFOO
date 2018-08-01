(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ServicioDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ServiciosCRService",
        ServicioDetailsCtrl
        ]);

    function ServicioDetailsCtrl(AuthService,$scope, $state, $stateParams, ServiciosCRService) {
        $scope.servicio_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        ServiciosCRService.getServicio($scope.servicio_id).then(
            function (result) {
                $scope.servicios = result.data;
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



