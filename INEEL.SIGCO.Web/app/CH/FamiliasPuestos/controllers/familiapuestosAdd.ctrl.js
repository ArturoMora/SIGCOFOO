/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiapuestosCtrlAdd", ['$scope', 'familiapuestosService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', familiapuestosCtrlAdd]);

    function familiapuestosCtrlAdd($scope, familiapuestosService, periodoevaluacionService, globalGet, $state, $stateParams) {
     


        var id = $stateParams.id;
        $scope.idPeriodoSeleccionado = id;


        if ($scope.idPeriodoSeleccionado === undefined || $scope.idPeriodoSeleccionado === null || isNaN($scope.idPeriodoSeleccionado)) {
            toastr.error("Para poder agregar una nueva familia de puestos es necesario seleccionar un período de evaluación");
        } else {

            periodoevaluacionService.getById(id).then(
              function (result) {
                  $scope.periodosev = result.data;
              },
              function (err) {
                  toastr.error("No se han podido cargar la información registrada en el sistema");
              }
            );

            familiapuestosService.getByPeriodo($stateParams.id).then(
                function (result) {
                    $scope.familiasregistradas = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
            );

            $scope.save = function () {

                var bandera = "0";

                var familia            = $scope.registro.nombreFamilia.trim();
                var descripcion = $scope.registro.descripcion.trim();
               
                for (var i = 0; i < $scope.familiasregistradas.length; i++) {
                    var familiaRegistrada = $scope.familiasregistradas[i].nombreFamilia.trim();
                   
                    if ( (familia.toUpperCase() === familiaRegistrada.toUpperCase()) ) {
                        bandera = "1";
                    }
                }

                if (bandera === "0") {

                    if ($scope.FamiliaPuestosForm.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        var Registro = {
                            "nombreFamilia": $scope.registro.nombreFamilia,
                            "descripcion": $scope.registro.descripcion,
                            "periodoId": id,
                            "estado": 1
                        }

                        familiapuestosService.add(Registro).then(
                               function (result) {
                                   toastr.success(result.data);

                                   $state.go("familiapuestos", { id: $stateParams.id });

                               },
                               function (err) {
                                   console.error(err);
                               }
                        );
                    }
                } else {
                    toastr.error("Ya existe una familia de puestos registrada con ese nombre");
                }
            }
        }


    }      
})();