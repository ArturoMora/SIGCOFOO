(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TamanoEmpresaDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TamanoEmpresaCRService",
        TamanoEmpresaDetailsCtrl
        ]);

    function TamanoEmpresaDetailsCtrl(AuthService,$scope, $state, $stateParams, TamanoEmpresaCRService) {
        $scope.tamanoEmpresa_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TamanoEmpresaCRService.get($scope.tamanoEmpresa_id).then(
            function (result) {
                $scope.tamanoEmpresa = result.data;
            },
            function (err) {
                console.error(err);
            });

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