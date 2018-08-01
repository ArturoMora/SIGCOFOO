(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AmbitoConvDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AmbitosConvCRService",
        AmbitoConvDetailsCtrl
        ]);

    function AmbitoConvDetailsCtrl(AuthService, $scope, $state, $stateParams, AmbitosConvCRService) {
        $scope.ambitoConv_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        AmbitosConvCRService.getAmbitoConv($scope.ambitoConv_id).then(
            function (result) {
                $scope.ambitosConv = result.data;
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



