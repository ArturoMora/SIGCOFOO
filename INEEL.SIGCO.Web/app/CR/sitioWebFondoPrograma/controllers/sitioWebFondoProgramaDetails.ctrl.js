(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SitioWebFondoProgramaDetailsCtrl",[
        "$scope",
        "$state",
        "$stateParams",
        "SitioWebFondoProgramaCRService",
        SitioWebFondoProgramaDetailsCtrl
        ]);

    function SitioWebFondoProgramaDetailsCtrl($scope, $state, $stateParams, SitioWebFondoProgramaCRService) {
        $scope.sitioWebFondoPrograma_id = $stateParams.id;

        SitioWebFondoProgramaCRService.get($scope.sitioWebFondoPrograma_id).then(
            function (result) {
                $scope.sitioWebFondoPrograma = result.data;
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