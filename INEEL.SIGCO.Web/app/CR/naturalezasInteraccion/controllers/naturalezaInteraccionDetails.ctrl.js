(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("NaturalezaInteraccionDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "NaturalezasInteraccionCRService",
        NaturalezaInteraccionDetailsCtrl
        ]);

    function NaturalezaInteraccionDetailsCtrl(AuthService,$scope, $state, $stateParams, NaturalezasInteraccionCRService) {
        $scope.naturalezaInteraccion_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        NaturalezasInteraccionCRService.getNaturalezaInteraccion($scope.naturalezaInteraccion_id).then(
            function (result) {
                $scope.naturalezasInteraccion = result.data;
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



