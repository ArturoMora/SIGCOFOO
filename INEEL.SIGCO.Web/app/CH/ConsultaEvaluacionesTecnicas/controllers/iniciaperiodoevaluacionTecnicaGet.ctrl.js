/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("iniciaperiodoevaluacionTecnicaCtrlGet", ['$scope', 'periodoevaluacionService', 'evaluaciontecnicaService', 'globalGet', '$state', '$stateParams', iniciaperiodoevaluacionTecnicaCtrlGet]);

    function iniciaperiodoevaluacionTecnicaCtrlGet($scope, periodoevaluacionService, evaluaciontecnicaService, globalGet, $state, $stateParams) {
      
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEV = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );


        $scope.cargarEmpleados = function () {                             
            evaluaciontecnicaService.cargarEmpleadosPeriodo($scope.periodo).then(
                    function (result) {
                        $scope.registro = result.data;
                    },
                    function (err) {
                        toastr.error("No se actualizaron las competencias para el presente periodo");
                    }
            );
        }
      

    
  

    }

})();