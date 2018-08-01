(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoRelacionDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoRelacionCRService",
        TipoRelacionDetailsCtrl
        ]);

    function TipoRelacionDetailsCtrl(AuthService,$scope, $state, $stateParams, TipoRelacionCRService) {
        $scope.tipoRelacion_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TipoRelacionCRService.get($scope.tipoRelacion_id).then(
            function (result) {
                $scope.tipoRelacion = result.data;
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