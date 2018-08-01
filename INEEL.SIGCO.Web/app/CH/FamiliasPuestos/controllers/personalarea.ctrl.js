/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("personalCtrlGet", ['$scope', 'periodoevaluacionService', 'InventarioRH', 'globalGet', '$state', '$stateParams', personalCtrlGet]);

    function personalCtrlGet($scope, periodoevaluacionService, InventarioRH , globalGet, $state, $stateParams) {
        var id = $stateParams.id;
        $scope.nombreUnidad = {};

        $scope.catInvestigadores = {};
        $scope.unidadOrganizacional = {};
        $scope.uoselecionada = {};
        $scope.investigadores = [];

        periodoevaluacionService.getAll().then(
         function (result) {
             $scope.periodos = result.data;
             $scope.periodoId = parseInt($scope.id);
         },
         function (err) {
             toastr.error("No se han podido cargar la información registrada en el sistema");
         }
       );


        $scope.obtenerInformacion = function () {
            var claveUnidad = "";
            if (typeof $scope.nombreUnidad === 'undefined' || $scope.nombreUnidad.claveUnidad === "") {
                toastr.warning("seleccione una Unidad Organizacional");
                return;
            }
            //obtener registros
            $scope.catInvestigadores.claveunidad = $scope.nombreUnidad.claveUnidad;
            $scope.catInvestigadores.fecha = new Date();

            debugger;
            InventarioRH.getInformacion($scope.catInvestigadores).then(
                function (result) {
                    if (typeof result.data !== undefined && result.data != null && result.data.length > 0) {
                        $scope.investigadores = result.data;

                    }
                    else {
                        $scope.mensajeresultados = "No se han encontrado resultados";
                        toastr.warning($scope.mensajeresultados);
                        $scope.investigadores = [];
                    }

                },
                function (err) {
                    toastr.error("No se han podido cargar el catalogo de investigadores.");
                }
            );

        };

    }

})();