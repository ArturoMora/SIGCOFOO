﻿(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioDetailsCtrl",[
        "$scope",
        "$state",
        "$stateParams",
        "TipoConvenioCRService",
        TipoConvenioDetailsCtrl
        ]);

    function TipoConvenioDetailsCtrl($scope, $state, $stateParams, TipoConvenioCRService) {
        $scope.convenio_id = $stateParams.id;

        TipoConvenioCRService.get($scope.convenio_id).then(
            function (result) {
                $scope.tipoConvenio = result.data;
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