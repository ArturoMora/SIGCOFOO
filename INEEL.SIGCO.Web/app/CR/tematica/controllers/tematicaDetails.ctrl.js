(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TematicaDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TematicaCRService",
        TematicaDetailsCtrl
        ]);

    function TematicaDetailsCtrl(AuthService,$scope, $state, $stateParams, TematicaCRService) {
        $scope.tematica_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TematicaCRService.get($scope.tematica_id).then(
            function (result) {
                $scope.tematica = result.data;
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