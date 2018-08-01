(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SegmentoMercadoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "SegmentosMercadoCRService",
        SegmentoMercadoDetailsCtrl
        ]);

    function SegmentoMercadoDetailsCtrl(AuthService,$scope, $state, $stateParams, SegmentosMercadoCRService) {
        $scope.segmentoMercado_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        SegmentosMercadoCRService.getSegmentoMercado($scope.segmentoMercado_id).then(
            function (result) {
                $scope.segmentosMercado = result.data;
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



