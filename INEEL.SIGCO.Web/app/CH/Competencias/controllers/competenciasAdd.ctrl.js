/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciasCtrlAdd", ['$scope', 'competenciasService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', competenciasCtrlAdd]);

    function competenciasCtrlAdd($scope, competenciasService, periodoevaluacionService, globalGet, $state, $stateParams) {
    
        var id = $stateParams.id;


        if ($stateParams.id === undefined || $stateParams.id === null || isNaN($stateParams.id)) {
            toastr.error("Para poder agregar una nueva competencia, es necesario seleccionar un período de evaluación");
        } else {

            periodoevaluacionService.getById(id).then(
              function (result) {
                  $scope.periodosev = result.data;
              },
              function (err) {
                  toastr.error("No se han podido cargar la información registrada en el sistema");
              }
            );

            competenciasService.getByPeriodo($stateParams.id).then(
                function (result) {
                    $scope.competencias = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las competencias registradas en el sistema");
                }
            );

            $scope.save = function () {

                var bandera = "0";

                var destino = $scope.registro.competencia.trim();
                var destinodescripcion = $scope.registro.descripcion.trim();
                var origen = "";

                for (var i = 0; i < $scope.competencias.length; i++) {
                    var origen = $scope.competencias[i].competencia.trim();
                    var origendescripcion = $scope.competencias[i].descripcion.trim();
                    if (origen.toUpperCase() === destino.toUpperCase()) {
                        bandera = "1";
                    }
                }

                if (bandera === "0") {

                    if ($scope.CompetenciasForm.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        var Registro = {
                            "competencia": $scope.registro.competencia,
                            "descripcion": $scope.registro.descripcion,
                            "periodoId": id,
                            "estado": 1
                        }


                        competenciasService.add(Registro).then(
                               function (result) {
                                   toastr.success(result.data);
                                   $state.go("competencias", { id: $stateParams.id });
                                   //         $state.go("competencias");
                               },
                               function (err) {
                                   console.error(err);
                               }
                        );
                    }
                } else {
                    toastr.error("Ya existe una competencia registrada con el mismo nombre");
                }
            }
        }


    }
})();