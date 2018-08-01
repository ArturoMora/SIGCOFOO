(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvocatoriaDetailsCtrl", [
            "$scope",
            'globalGet',
            "$stateParams",
            "ConvocatoriasCRService",
            ConvocatoriaDetailsCtrl
        ]);

    function ConvocatoriaDetailsCtrl($scope, globalGet, $stateParams, ConvocatoriasCRService) {
        $scope.convocatoria_id = $stateParams.id;
        $scope.vigencia = 0;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        ConvocatoriasCRService.getConvocatoriaFKById($scope.convocatoria_id).then(
            function (result) {
                $scope.convocatorias = result.data;
            },
            function (err) {
                console.error(err);
            });


        //Obtiene Vigencia
        $scope.getVigencia = function (fechaTermino) {
            var vigencia;
            //debugger;
            $scope.fechaActual = new Date();
            var finalDateComparacion = new Date(fechaTermino);

            if ($scope.fechaActual > finalDateComparacion) {
                //vigencia = $scope.fechaActual + " > " + finalDateComparacion + " Inactivo";
                vigencia = "Inactiva";
                $scope.vigencia = 0;
            }
            else if ($scope.fechaActual < finalDateComparacion) {
                
                vigencia = "Activa";
                $scope.vigencia = 1;
            }

            return vigencia;
        }
    }
})();



