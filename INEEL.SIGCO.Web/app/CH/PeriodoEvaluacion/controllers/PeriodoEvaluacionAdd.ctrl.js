/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("periodoevaluacionCtrlAdd", ['$scope', 'periodoevaluacionService', 'globalGet', '$state',  periodoevaluacionCtrlAdd]);

    function periodoevaluacionCtrlAdd($scope, periodoevaluacionService, globalGet, $state) {
       

        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;   
          },
          function (err) {
              toastr.error("No se han podido cargar los períodos registrados en el sistema");
          }
        );



        $scope.save = function () {

            var bandera = "0";

            for (var i = 0; i < $scope.periodos.length; i++) {
                if ($scope.periodos[i].periodo === $scope.registro.periodo) {
                    bandera = "1";
                    break;
                }
            }

            if (bandera === "0") {
                if ($scope.PeriodoEvaluacionForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var Registro = {
                        "Periodo": $scope.registro.periodo,
                        "evaluacionFinalizada": 0,
                        "personalMigrado": 0,
                        "estado": 1
                    }
                    periodoevaluacionService.Add(Registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("periodoevaluacion");
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                }
            } else {
                toastr.error("El período a ingresar ya fue registrado perviamente");
            }
        }
                              

    }

})();