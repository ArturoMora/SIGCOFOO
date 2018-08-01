/*AYUDA:
FooEntitiesService nombre de factory en formularioevaluacionconductual.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formularioevaluacionconductualCtrlEdit", ['$rootScope', '$scope', 'periodoevaluacionService', 'detalleevaluacionconductualService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', formularioevaluacionconductualCtrlEdit]);

    function formularioevaluacionconductualCtrlEdit($rootScope, $scope, periodoevaluacionService, detalleevaluacionconductualService,evaluacionconductualService,  globalGet, $state, $stateParams) {
        var id = $stateParams.id;

        $scope.periodo = "";
        $scope.evaluacionid = 0;
        $scope.mensaje = 0;

              
        $scope.justifica = "";

        if (typeof $rootScope.parametros !== 'undefined') {
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.periodo      = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.nombreunidad;
                $scope.claveUnidad  = $rootScope.parametros.unidad;

                $scope.clave        = $rootScope.parametros.clave;
                $scope.nombre       = $rootScope.parametros.nombre;

                $scope.cateemp      = $rootScope.parametros.cateemp;
                $scope.catcomp      = $rootScope.parametros.catcomp;
                $scope.calificacion = $rootScope.parametros.calificacion;
                $scope.evaluacionId = $rootScope.parametros.evaluacionId;
                $scope.claveCateNom = $rootScope.parametros.idcategoriacompetencia;
                $scope.categoriaem  = $rootScope.parametros.categoriaem;
                $scope.nombreFamilia = $rootScope.parametros.nombreFamilia;

                if ($scope.evaluacionId == 0) {
                    evaluacionconductualService.getByClaveCategoria($scope.claveCateNom).then(
                      function (result) {
                          $scope.competenciasaevaluar = result.data;
                      },
                      function (err) {
                          toastr.error("No se han podido cargar la información registrada en el sistema");
                      }
                    );

                } else {
                    detalleevaluacionconductualService.getByClaveEvaluacionResultado($scope.evaluacionId).then(
                           function (result) {
                               $scope.competenciasaevaluar = result.data;
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                }

            }
        }

        evaluacionconductualService.getById(id).then(
           function (result) {
               $scope.datosevaluado = result.data;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );


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
          
            var valorcalificacion = 0;
            var nivel_exigido_mayor = 0;
            var nivel_exigido_menor = 0;
            var numCompetencias = 0;

            numCompetencias = $scope.competenciasaevaluar.length;
            for (var j = 0; j < $scope.competenciasaevaluar.length; j++) {

               
                var Registro = {
                    "claveEvaluacion": id,
                    "matrizId": $scope.competenciasaevaluar[j].matrizId,
                    "justificacion": $scope.competenciasaevaluar[j].justificacion,
                    "valorReal": $scope.competenciasaevaluar[j].valorReal                   
                }
                           
               detalleevaluacionconductualService.create(Registro).then(
                      function (result) {
                          toastr.success(result.data);
                      },
                      function (err) {
                          console.error(err);
                      }
               );
             
          
               if (parseInt($scope.competenciasaevaluar[j].valorReal) > parseInt($scope.competenciasaevaluar[j].nivel)) {
                    nivel_exigido_mayor = nivel_exigido_mayor + 1;
                }
                  
               if (parseInt($scope.competenciasaevaluar[j].valorReal) < parseInt($scope.competenciasaevaluar[j].nivel)) {
                    nivel_exigido_menor = nivel_exigido_menor + 1;
                }

            }

            if ($scope.catcomp == 43 || $scope.catcomp == 44 || $scope.catcomp == 45 || $scope.catcomp == 47 || $scope.catcomp == 48) {

                if (numCompetencias == 7 || numCompetencias == 8) {

                    if (nivel_exigido_mayor >= 3 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_mayor == 1 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple_expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_mayor == 2 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_mayor == 0 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_mayor >= 0 && nivel_exigido_menor == 1) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_mayor >= 0 && nivel_exigido_menor == 2) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor >= 3) {
                        $scope.calificacion = "No cumple expectativas";
                        valorcalificacion = 1;
                    }

                    if (nivel_exigido_menor == 3 && (nivel_exigido_mayor >= 1 && nivel_exigido_mayor <= 4)) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor == 2 && (nivel_exigido_mayor >= 1 && nivel_exigido_mayor <= 4)) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor == 1 && nivel_exigido_mayor >= 4) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_menor == 1 && (nivel_exigido_mayor >= 1 && nivel_exigido_mayor <= 3)) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                }

                if (numCompetencias == 5 || numCompetencias == 6) {

                    if (nivel_exigido_mayor >= 2 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_mayor >= 3 && nivel_exigido_menor == 1) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_mayor == 1 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_mayor == 0 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_menor == 1 && nivel_exigido_mayor == 0) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor == 1 && (nivel_exigido_mayor == 1 || nivel_exigido_mayor == 2)) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_menor >= 2) {
                        $scope.calificacion = "No cumple expectativas ";
                        valorcalificacion = 1;
                    }


                    if (nivel_exigido_menor == 2 && nivel_exigido_mayor >= 1) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor == 2 && nivel_exigido_mayor >= 1) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                }


                if (numCompetencias == 4) {
                    if (nivel_exigido_mayor >= 1 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_mayor == 0 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }


                    if (nivel_exigido_menor == 1 && nivel_exigido_mayor >= 0) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor >= 2) {
                        $scope.calificacion = "No cumple expectativas";
                        valorcalificacion = 1;
                    }

                }
            } else {

                if (numCompetencias == 7 || numCompetencias == 8) {

                    if (nivel_exigido_mayor >= 3 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }
                    
                    if ((nivel_exigido_mayor >= 0 && nivel_exigido_mayor <= 2) && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }
                    
                    if (nivel_exigido_mayor >= 0 && (nivel_exigido_menor == 1 || nivel_exigido_menor == 2)) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }
                    
                    if (nivel_exigido_menor >= 3) {
                        $scope.calificacion = "No cumple expectativas";
                        valorcalificacion = 1;
                    }
                    
                }


                if (numCompetencias == 5 || numCompetencias == 6) {

                    if (nivel_exigido_mayor >= 2 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }
                    
                    if (nivel_exigido_menor == 0 && (nivel_exigido_mayor == 1 || nivel_exigido_mayor == 0)) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_menor >= 2) {
                        $scope.calificacion = "No cumple expectativas";
                        valorcalificacion = 1;
                    }

                    if (nivel_exigido_menor == 1 && (nivel_exigido_mayor >= 0 && nivel_exigido_mayor <= 5)) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }
                }


                if (numCompetencias == 4) {
                    if (nivel_exigido_mayor >= 1 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Excede expectativas";
                        valorcalificacion = 4;
                    }

                    if (nivel_exigido_mayor == 0 && nivel_exigido_menor == 0) {
                        $scope.calificacion = "Cumple expectativas";
                        valorcalificacion = 3;
                    }

                    if (nivel_exigido_menor == 1 && nivel_exigido_mayor >= 0) {
                        $scope.calificacion = "Cumple parcialmente";
                        valorcalificacion = 2;
                    }

                    if (nivel_exigido_menor >= 2) {
                        $scope.calificacion = "No cumple expectativas";
                        valorcalificacion = 1;
                    }
                }
            }


           
            $scope.datosevaluado.calificacionId = valorcalificacion;
            $scope.datosevaluado.claveEvaluacion = id;
            $scope.evaluacionId = id;
            $scope.datosevaluado.estadoEvaluacionId = 2;
            evaluacionconductualService.update($scope.datosevaluado).then(
                   function (result) {
                       toastr.success(result.data);
                   },
                   function (err) {
                       console.error(err);
                   }
            );
           


        }

        $scope.onlyNumbers = function (event) {
            var keys = {
                'up': 38, 'right': 39, 'down': 40, 'left': 37,
                'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
                '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
            };
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) continue;
                if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                    return; //default event
                }
            }
            event.preventDefault();
        };

       
        $rootScope.parametros = {};
        $scope.parametrosTransferencia = function () {
            $rootScope.parametros.clave = $scope.clave;
            $rootScope.parametros.nombre = $scope.nombre;
            $rootScope.parametros.cateemp = $scope.cateemp;
            $rootScope.parametros.catcomp = $scope.catcomp;
            $rootScope.parametros.calificacion = $scope.calificacion;
            $rootScope.parametros.periodo = $scope.periodo
            $rootScope.parametros.unidad = $scope.claveUnidad;
            $rootScope.parametros.nombreunidad = $scope.nombreUnidad;
            $rootScope.parametros.idcategoriacompetencia = $scope.claveCateNom;
            $rootScope.parametros.nombreFamilia = $scope.nombreFamilia;
            $rootScope.parametros.evaluacionId = $scope.evaluacionId;
        }



    }

})();