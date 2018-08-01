/*AYUDA:
FooEntitiesService nombre de factory en formularioevaluaciontecnica.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formularioevaluaciontecnicasCtrlGet", ['$rootScope', '$scope', 'periodoevaluacionService', 'evaluaciontecnicaService', 'detalletecnicaService', 'globalGet', '$state', '$stateParams', formularioevaluaciontecnicasCtrlGet]);

    function formularioevaluaciontecnicasCtrlGet($rootScope, $scope, periodoevaluacionService, evaluaciontecnicaService, detalletecnicaService, globalGet, $state, $stateParams) {
        var id = $stateParams.id;
        
        $scope.calificacionObtenidaEnEvaluacion = "";
        $scope.valorEvaluacion = 0;
        $scope.nuevabrecharegistrada = "";

        $scope.cuentaExcede   = 0;
        $scope.cumple         = 0;
        $scope.cumpleparcial  = 0;
        $scope.cuentanocumple = 0;
        
     
        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.nombreunidad;

                $scope.clave        = $rootScope.parametros.clave;
                $scope.nombre       = $rootScope.parametros.nombre;
                $scope.nivel        = $rootScope.parametros.nivel;
                $scope.calificacion = $rootScope.parametros.calificacion;
                $scope.brecha = $rootScope.parametros.brecha;
                $scope.nomina = $rootScope.parametros.claveCategoria;

                $scope.calificacionObtenidaEnEvaluacion = $rootScope.parametros.calificacion;
              
                evaluaciontecnicaService.getById(id).then(
                   function (result) {
                       $scope.datosevaluado = result.data;

                       if ($scope.datosevaluado.estadoEvaluacionId == 2) {

                           $scope.nuevabrecharegistrada = $scope.datosevaluado.brecha;

                           var parametros = {
                               'periodo': $scope.periodo,
                               'claveEmpleado': $scope.clave
                           }

                           detalletecnicaService.getByEmpleadoAuxiliar(parametros).then(
                               function (result) {
                                   $scope.registro = result.data;
                                   $scope.loading = false;
                               },
                               function (err) {
                                   toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                               }
                           );
                       } else {
                           if ($scope.datosevaluado.estadoEvaluacionId == 1) {
                               evaluaciontecnicaService.getByNivel($scope.datosevaluado.nivelCompetencia).then(
                                 function (result) {
                                     $scope.registro = result.data;
                                     $scope.loading = false;
                                 },
                                 function (err) {
                                     toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                                 }

                               );
                           }

                       }

                   },
                   function (err) {
                       toastr.error("No se han podido cargar la información registrada en el sistema");
                   }
                );
        }


        $scope.finalizarEvaluacion = function () {
            $scope.datosevaluado.estadoEvaluacionId = 4;
            evaluacionconductualService.update($scope.datosevaluado).then(
                   function (result) {
                       toastr.success(result.data);
                   },
                   function (err) {
                       console.error(err);
                   }
            );
        }
                
        $scope.save = function () {
            for (var j = 0; j < $scope.registro.length; j++) {

                var Registro = {
                    "claveEmpleado": $scope.datosevaluado.claveEmpleado,
                    "periodoId": $scope.periodo,
                    "idCompetenciaTecnica": $scope.registro[j].idCompetenciaTecnica,
                    "calificacionEvaluacionId": $scope.registro[j].calificacionEvaluacionId,
                    "observaciones": $scope.registro[j].observaciones,
                    "idEvaluacion": $scope.datosevaluado.idEvaluacion,
                }
                
                if ($scope.registro[j].calificacionEvaluacionId == 4) {
                    $scope.cuentaExcede = $scope.cuentaExcede + 1;
                }

                if ($scope.registro[j].calificacionEvaluacionId == 3) {
                    $scope.cumple = $scope.cumple + 1;
                }

                if ($scope.registro[j].calificacionEvaluacionId == 2) {
                    $scope.cumpleparcial = $scope.cumpleparcial + 1;
                }

                if ($scope.registro[j].calificacionEvaluacionId == 1) {
                    $scope.cuentanocumple = $scope.cuentanocumple + 1;
                }

                detalletecnicaService.add(Registro).then(
                       function (result) {
                           toastr.success(result.data);
                       },
                       function (err) {
                           console.error(err);
                       }
                );            
            }


            if ($scope.registro.length === 3) {
                //CASO 1
                if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 3) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 2
                if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 2) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 3
                if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 2) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 4
                if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 2) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 5
                if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 6
                if ($scope.cuentaExcede === 1 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                    $scope.valorEvaluacion = 2;
                }
                //CASO 7
                if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 8
                if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 9
                if ($scope.cuentaExcede === 0 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                    $scope.valorEvaluacion = 2;
                }
                //CASO 10
                if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                    $scope.valorEvaluacion = 2;
                }
                //CASO 11
                if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 3 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 12
                if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                    $scope.valorEvaluacion = 1;
                }
                //CASO 13
                if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                    $scope.valorEvaluacion = 2;
                }
                //CASO 14
                if ($scope.cuentaExcede === 1 && $scope.cumple === 1 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Expectativas";
                    $scope.valorEvaluacion = 3;
                }
                //CASO 15
                if ($scope.cuentaExcede === 1 && $scope.cumple ===2 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                    $scope.valorEvaluacion = 2;
                }
                //CASO 16
                if ($scope.cuentaExcede === 2 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                    $scope.valorEvaluacion = 4;
                }
                //CASO 17
                if ($scope.cuentaExcede === 0 && $scope.cumple === 3 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Cumple Expectativas";
                    $scope.valorEvaluacion = 3;
                }
                //CASO 18
                if ($scope.cuentaExcede === 1 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                    $scope.valorEvaluacion = 4;
                }
                //CASO 19
                if ($scope.cuentaExcede === 2 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                    $scope.valorEvaluacion = 4;
                }
                //CASO 20
                if ($scope.cuentaExcede === 3 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                    $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                    $scope.valorEvaluacion = 4;
                }
            } else {
                if ($scope.registro.length === 4) {
                    //CASO 1
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 4) {
                        $scope.calificacionObtenidaEnEvaluacion = "No cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 2
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 4 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 3
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 4 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Expectativas";
                        $scope.valorEvaluacion = 3;
                    }
                    //CASO 4
                    if ($scope.cuentaExcede === 4 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 5
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 3) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 6
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 3) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 7
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 3) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 8
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 3 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 9
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 3 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 10
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 3 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 11
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 3 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 12
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 3 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 13
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 3 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 14
                    if ($scope.cuentaExcede === 3 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 15
                    if ($scope.cuentaExcede === 3 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 16
                    if ($scope.cuentaExcede === 3 && $scope.cumple === 0 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 17
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 18
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 19
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 20
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 0 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 21
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 22
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 2) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 23
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 2 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 24
                    if ($scope.cuentaExcede === 2 && $scope.cumple === 0 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente Expectativas";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 25
                    if ($scope.cuentaExcede === 2 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 26
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 1 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 27
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 0 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 28
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 1 && $scope.cumpleparcial === 2 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple parcialmente";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 29
                    if ($scope.cuentaExcede === 0 && $scope.cumple === 2 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "No Cumple Expectativas";
                        $scope.valorEvaluacion = 1;
                    }
                    //CASO 30
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 2 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Expectativas";
                        $scope.valorEvaluacion = 3;
                    }
                    //CASO 31
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 2 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente Expectativas";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 32
                    if ($scope.cuentaExcede === 2 && $scope.cumple === 0  && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente Expectativas";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 33
                    if ($scope.cuentaExcede === 2 && $scope.cumple === 1 && $scope.cumpleparcial === 0 && $scope.cuentanocumple === 1) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente Expectativas";
                        $scope.valorEvaluacion = 2;
                    }
                    //CASO 34
                    if ($scope.cuentaExcede === 2 && $scope.cumple === 1 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Excede Expectativas";
                        $scope.valorEvaluacion = 4;
                    }
                    //CASO 35
                    if ($scope.cuentaExcede === 1 && $scope.cumple === 1 && $scope.cumpleparcial === 1 && $scope.cuentanocumple === 0) {
                        $scope.calificacionObtenidaEnEvaluacion = "Cumple Parcialmente Expectativas";
                        $scope.valorEvaluacion = 2;
                    }
                }

            }


            $scope.datosevaluado.estadoEvaluacionId = 2;
            $scope.datosevaluado.brecha = $scope.nuevabrecharegistrada;
            $scope.datosevaluado.calificacionEvaluacionId = $scope.valorEvaluacion;
            evaluaciontecnicaService.update($scope.datosevaluado).then(
             function (result) {
                 $scope.registro = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
             }
            );



          

        }
       

    }

})();