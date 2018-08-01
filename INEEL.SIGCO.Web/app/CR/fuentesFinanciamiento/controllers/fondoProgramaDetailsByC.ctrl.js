(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondoProgramaDetailsByCCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "FuentesFinanciamientoCRService",
        "$uibModal",
        "DTOptionsBuilder",
       FondoProgramaDetailsByCCtrl
        ]);

    function FondoProgramaDetailsByCCtrl(AuthService, $scope, $state, $stateParams, FuentesFinanciamientoCRService, $uibModal, DTOptionsBuilder) {
        $scope.fondoPrograma_id = $stateParams.id;
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        $scope.convocatoriasDeFondo = [];

        //obtiene el nombre de la fuente de financiamiento
        FuentesFinanciamientoCRService.getFuenteFinanciamientoFKFP($scope.fondoPrograma_id).then(
            function (result) {
                $scope.fuentesFinanciamiento = result.data;
            },
            function (err) {
                console.error(err);
            });


        FuentesFinanciamientoCRService.getFuenteFinanciamientoFK($scope.fondoPrograma_id).then(
        function (result) {
            $scope.convocatoriasDeFondo = result.data;
            $scope.dtOptions = DTOptionsBuilder
                            .newOptions()
                            .withOption("responsive", true);
            $scope.loading = false;
        },
        function (err) {
            console.error(err);
        });

        //Consulta estado
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