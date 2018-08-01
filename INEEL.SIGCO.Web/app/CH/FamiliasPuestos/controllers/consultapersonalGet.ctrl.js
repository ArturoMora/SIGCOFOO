/*AYUDA:
FooEntitiesService nombre de factory en consultapersonal.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultapersonalCtrlGet", ['$scope', 'globalGet', '$state', '$stateParams', "$uibModal", 'tipocompetenciaService',
            'periodoevaluacionService', 'detalleevaluacionconductualService',
            'evaluacionconductualService', 'evaluaciontecnicaService',
            'detalletecnicaService', consultapersonalCtrlGet]);

    function consultapersonalCtrlGet($scope, globalGet, $state, $stateParams, $uibModal,
        tipocompetenciaService, periodoevaluacionService, detalleevaluacionconductualService,
        evaluacionconductualService, evaluaciontecnicaService, detalletecnicaService) {
             
        $scope.tipoCompetenciaConsultada = 0;
        $scope.conductual = 0;
        $scope.tecnica = 0;

        $scope.categoriaCompetencia = "";
        $scope.categoriaNomina = "";
        $scope.nombreFamiliaPuestos = "";
        $scope.fortalezas = "";
        $scope.areasmejora = "";
        $scope.habilidades = "";
        $scope.brecha = "";


        $scope.muestraDatos = 0;

        tipocompetenciaService.getAll().then(
          function (result) {
              $scope.tipocompetencia = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEv = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        $scope.open = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;

                if ($scope.periodoId !== null && $scope.periodoId !== "undefined" && $scope.periodoId !== undefined)
                        $scope.obtenDatosEmpleado();
            });
        }

        $scope.obtenDatosEmpleado = function () {
            $scope.muestraDatos = 1;

            var cadPeriodo = "";

            for (var item = 0; item < $scope.periodosEv.length; item++) {
                if ($scope.periodosEv[item].periodoEvaluaionId === $scope.periodoId) {
                    cadPeriodo = $scope.periodosEv[item].periodo;
                }
            }
                       var parametros = {
                          'claveEmpleado': $scope.PersonaSeleccionada.clavePersona,
                          'periodo': cadPeriodo
                      }

                      if ($scope.tipoCompetenciaId == 1) {
                          evaluacionconductualService.getByPersonaPeriodo(parametros).then(
                           function (result) {
                               $scope.datosevaluado = result.data;

                               $scope.categoriaCompetencia = $scope.datosevaluado[0].categoria.nombreCategoria;
                               $scope.categoriaNomina = $scope.datosevaluado[0].categoriaNomina;
                               $scope.nombreFamiliaPuestos = $scope.datosevaluado[0].categoria.familiaPuestos.nombreFamilia;
                              

                               detalleevaluacionconductualService.getByClaveEvaluacion($scope.datosevaluado[0].claveEvaluacion).then(
                                    function (result) {
                                        $scope.competenciasaevaluar = result.data;
                                        $scope.conductual = 1;
                                        $scope.loading = false;
                                    },
                                    function (err) {
                                        toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                                    }
                               );

                           },
                           function (err) {
                               toastr.error("No se han podido cargar la información registrada en el sistema");
                           }
                          );
                      } else {
                          if ($scope.tipoCompetenciaId == 2) {

                              evaluaciontecnicaService.getByPersonaPeriodo(parametros).then(
                                     function (result) {
                                         $scope.datosevaluado = result.data;
                                         $scope.categoriaCompetencia = $scope.datosevaluado[0].nivel.descripcion;
                                                                             
                                                                            
                                         detalletecnicaService.getByEmpleado(parametros).then(
                                              function (result) {
                                                  $scope.competenciasaevaluar = result.data;
                                                  $scope.tecnica = 1;
                                                  $scope.loading = false;
                                              },
                                              function (err) {
                                                  toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                                              }
                                         );
                                        
                                     },
                                     function (err) {
                                         toastr.error("No se han podido cargar la información registrada en el sistema");
                                     }
                                    );
                          }
                      }

                 
        }

   


    }

})();