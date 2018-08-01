/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("periodoevaluacionCtrlEdit", ['$scope', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', periodoevaluacionCtrlEdit]);

    function periodoevaluacionCtrlEdit($scope, periodoevaluacionService, globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;    

        //Obtene ambito
        periodoevaluacionService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }
        );

        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar los períodos registrados en el sistema");
          }
        );

        //Guardar Cambios
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
                    periodoevaluacionService.Update($scope.registro).then(
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
                toastr.error("El perído que desea actualizar ya está registrado");
            }

        }


    }

})();