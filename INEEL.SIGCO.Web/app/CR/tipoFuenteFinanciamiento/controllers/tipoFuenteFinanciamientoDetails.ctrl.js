(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoFuenteFinanciamientoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoFuenteFinanciamientoCRService",
        TipoFuenteFinanciamientoDetailsCtrl
        ]);

    function TipoFuenteFinanciamientoDetailsCtrl(AuthService,$scope, $state, $stateParams, TipoFuenteFinanciamientoCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoFuenteFinanciamiento_id = $stateParams.id;
        TipoFuenteFinanciamientoCRService.get($scope.tipoFuenteFinanciamiento_id).then(
            function (result) {
                $scope.tipoFuenteFinanciamiento = result.data;
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