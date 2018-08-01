(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AlumnoGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AlumnoCRService",
        "DTOptionsBuilder",
        "$uibModal",
        AlumnoGetCtrl
        ]);

    function AlumnoGetCtrl($scope, $state, $stateParams, AlumnoCRService, DTOptionsBuilder, $uibModal) {


        $scope.ImprimeSexo = function (Cadena) {

            if (Cadena == "F") {
                return "Femenino";
            }
            else {
                return "Masculino";
            }

        };


        $scope.dtInstance = {};
        $scope.loading = true;
        AlumnoCRService.getAll().then(
            function (result) {

                $scope.alumno = result.data;
                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withOption('responsive', true);
                $scope.loading = false;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

    }

})();