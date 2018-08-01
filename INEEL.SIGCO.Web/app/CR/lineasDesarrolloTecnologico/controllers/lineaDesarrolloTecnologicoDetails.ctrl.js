(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("LineaDesarrolloTecnologicoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "LineasDesarrolloTecnologicoCRService",
        LineaDesarrolloTecnologicoDetailsCtrl
        ]);

    function LineaDesarrolloTecnologicoDetailsCtrl(AuthService,$scope, $state, $stateParams, LineasDesarrolloTecnologicoCRService) {
        $scope.lineaDesarrolloTecnologico_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        LineasDesarrolloTecnologicoCRService.getLineaDesarrolloTecnologico($scope.lineaDesarrolloTecnologico_id).then(
            function (result) {
                $scope.lineasDesarrolloTecnologico = result.data;
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



