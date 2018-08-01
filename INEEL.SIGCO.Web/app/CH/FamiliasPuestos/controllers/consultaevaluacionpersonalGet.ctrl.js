/*AYUDA:
FooEntitiesService nombre de factory en consultapersonal.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultaevaluacionpersonalCtrlGet", ["AuthService", "MenuService", '$scope', 'globalGet', '$state', '$stateParams', "$uibModal",
            'tipocompetenciaService','periodoevaluacionService', 'detalleevaluacionconductualService',
            'evaluacionconductualService', 'evaluaciontecnicaService',
            'detalletecnicaService', consultaevaluacionpersonalCtrlGet]);

    function consultaevaluacionpersonalCtrlGet(AuthService, MenuService, $scope, globalGet, $state, $stateParams, $uibModal,
        tipocompetenciaService, periodoevaluacionService, detalleevaluacionconductualService,
        evaluacionconductualService, evaluaciontecnicaService, detalletecnicaService) {
          
        $scope.authentication = AuthService.authentication;
        $scope.informacion = {};
        $scope.count = "0";

        $scope.tipoCompetenciaConsultada = 0;
        $scope.conductual = 0;
        $scope.tecnica = 0;

        $scope.bandera = true;

        $scope.categoriaCompetencia = "";
        $scope.categoriaNomina = "";
        $scope.nombreFamiliaPuestos = "";
        $scope.fortalezas = "";
        $scope.areasmejora = "";
        $scope.habilidades = "";
        $scope.brecha = "";
    
        $scope.muestraDatos = 0;
        $scope.periodoId = "0"

        //obtener clave de usuario
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;
        //Saber con que rol inicio session
        $scope.idRol = MenuService.getRolId();
        if ($scope.idRol == 8) {
            $scope.datosUsuarioAux = AuthService.authentication.userprofile;
        } else {
            $scope.datosUsuarioAux = {
                'clavePersona': '',
                'fechaIngreso': '',
                'categoria': { 'descripcion': '' },
                'nombreCompleto': '',
                'unidadOrganizacional': { 'nombreUnidad': '' },
                'antiguedad': ''
            };
        }

        console.log($scope.idRol);

        if ($scope.idRol == 5 || $scope.idRol == 16) {
            $scope.bandera = false;
        }

        $scope.loading = true;


        $scope.periodosEv = [
                     { valor: "2010", descripcion: "2010" },
                     { valor: "2011", descripcion: "2011" },
                     { valor: "2012", descripcion: "2012" },
                     { valor: "2013", descripcion: "2013" },
                     { valor: "2014", descripcion: "2014" },
                     { valor: "2015", descripcion: "2015" },
                     { valor: "2016", descripcion: "2016" }
        ];
       


        tipocompetenciaService.getAll().then(
          function (result) {
              $scope.tipocompetencia = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

         

        $scope.modificaPeriodos = function () {
            var tipocompetenciaS = parseInt($scope.tipoCompetenciaId);

            if ($scope.datosUsuarioAux.tipoPersonalId == "INV") {
                if (tipocompetenciaS == 1) {
                  
                    $scope.periodosEv = [
                       { valor: "2010", descripcion: "2010" },
                       { valor: "2011", descripcion: "2011" },
                       { valor: "2012", descripcion: "2012" },
                       { valor: "2013", descripcion: "2013" },
                       { valor: "2015", descripcion: "2015" }
                    ];
                }

                if (tipocompetenciaS == 2) {

                    $scope.periodosEv = [
                     { valor: "2013", descripcion: "2013" },
                     { valor: "2015", descripcion: "2015" }
                    ];
                }
            } else {

                if ($scope.datosUsuarioAux.tipoPersonalId == "SIN" || $scope.datosUsuarioAux.tipoPersonalId == "ADM") {


                    $scope.periodosEv = [
                       { valor: "2010", descripcion: "2010" },
                       { valor: "2011", descripcion: "2011" },
                       { valor: "2012", descripcion: "2012" },
                       { valor: "2013", descripcion: "2013" },
                       { valor: "2014", descripcion: "2014" },
                       { valor: "2015", descripcion: "2015" },
                       { valor: "2016", descripcion: "2016" }
                    ];

                } else {

                    if (tipocompetenciaS == 1) {

                        $scope.periodosEv = [
                           { valor: "2010", descripcion: "2010" },
                           { valor: "2011", descripcion: "2011" },
                           { valor: "2012", descripcion: "2012" },
                           { valor: "2013", descripcion: "2013" },
                           { valor: "2015", descripcion: "2015" }
                        ];
                    }

                    if (tipocompetenciaS == 2) {

                        $scope.periodosEv = [
                         { valor: "2013", descripcion: "2013" },
                         { valor: "2015", descripcion: "2015" }
                        ];
                    }
                }



            }


            if ($scope.periodoId != "0") {
                $scope.obtenDatosEmpleado();
            }

           
        }



        $scope.obtenDatosEmpleado = function () {
                                
            

            var parametros = {
                 'claveEmpleado': $scope.authentication.userprofile.clavePersona,
                 'periodo': $scope.periodoId
            }                  
                        
            var periodoS = parseInt($scope.periodoId);
            var tipocompetenciaS = parseInt($scope.tipoCompetenciaId);


           

            if ($scope.datosUsuarioAux.tipoPersonalId == "SIN" || $scope.datosUsuarioAux.tipoPersonalId == "ADM") {
               
                if (periodoS > 0) {
                   
                    evaluacionconductualService.getMisEvaluacionesConductuales(parametros).then(
                         function (result) {
                             
                             $scope.resultado = result.data;

                             $scope.categoriaCompetencia = $scope.resultado.info.registroEvaluacion.categoriaSind.nombreCategoria;
                             $scope.categoriaNomina = $scope.resultado.info.registroEvaluacion.categoriaNomina;
                             $scope.nombreFamiliaPuestos = $scope.resultado.info.registroEvaluacion.categoriaSind.familiaPuestos.nombreFamilia;
                             $scope.fortalezas = $scope.resultado.info.registroEvaluacion.fortalezas;
                             $scope.areasmejora = $scope.resultado.info.registroEvaluacion.areasMejora;
                             $scope.habilidades = $scope.resultado.info.registroEvaluacion.planAccion;
                             $scope.competenciasaevaluar = $scope.resultado.info.competencias;
                                       
                             $scope.tipoCompetenciaConsultada = 1;
                             $scope.conductual = 1;
                             $scope.muestraDatos = 1;
                             $scope.loading = false;

                         },
                         function (err) {
                             toastr.error("No se hay información disponible");
                             $scope.muestraDatos = 0;
                         }
                        );

                }

            }

           
         
            if (periodoS > 0 && tipocompetenciaS > 0) {
               
                if ($scope.tipoCompetenciaId == 1) {

                    evaluacionconductualService.getMisEvaluacionesConductuales(parametros).then(
                     function (result) {
                         $scope.muestraDatos = 1;
                         $scope.tipoCompetenciaConsultada = 1;
                         $scope.conductual = 1;
                         $scope.resultado = result.data;


                         console.log($scope.resultado.tipoPersonalId);
                         console.log($scope.resultado);

                         if ($scope.resultado.tipoPersonalId === "SIN") {
                             $scope.categoriaCompetencia = $scope.resultado.info.registroEvaluacion.categoriaSind.nombreCategoria;
                             $scope.categoriaNomina = $scope.resultado.info.registroEvaluacion.categoriaNomina;
                             $scope.nombreFamiliaPuestos = $scope.resultado.info.registroEvaluacion.categoriaSind.familiaPuestos.nombreFamilia;
                             $scope.fortalezas = $scope.resultado.info.registroEvaluacion.fortalezas;
                             $scope.areasmejora = $scope.resultado.info.registroEvaluacion.areasMejora;
                             $scope.habilidades = $scope.resultado.info.registroEvaluacion.planAccion;
                             $scope.competenciasaevaluar = $scope.resultado.info.competencias;
                         } else {
                             $scope.categoriaCompetencia = $scope.resultado.conductuales.datosEvaluado.categoria.nombreCategoria;
                             $scope.categoriaNomina = $scope.resultado.conductuales.datosEvaluado.categoriaNomina;
                             $scope.nombreFamiliaPuestos = $scope.resultado.conductuales.datosEvaluado.categoria.familiaPuestos.nombreFamilia;
                             $scope.fortalezas = $scope.resultado.conductuales.datosEvaluado.fortalezas;
                             $scope.areasmejora = $scope.resultado.conductuales.datosEvaluado.areasMejora;
                             $scope.habilidades = $scope.resultado.conductuales.datosEvaluado.debilidades;
                             $scope.competenciasaevaluar = $scope.resultado.conductuales.competencias;

                             console.log("aqi");
                         }


                         if ($scope.datosUsuarioAux.tipoPersonalId == "ADM") {
                             $scope.tipoCompetenciaConsultada = 3;

                         }
                        
                         $scope.loading = false;

                     },
                     function (err) {
                         toastr.error("No se hay información disponible");
                         $scope.muestraDatos = 0;
                     }
                    );
                 
                   
                } else {
                    if ($scope.tipoCompetenciaId == 2) {

                        $scope.tipoCompetenciaConsultada = 2;

                        evaluaciontecnicaService.getByPersonaPeriodo(parametros).then(
                               function (result) {
                                   $scope.muestraDatos = 1;
                                   $scope.datosevaluado = result.data;
                                   $scope.categoriaCompetencia = $scope.datosevaluado[0].nivel.descripcion;
                                   $scope.brecha = $scope.datosevaluado[0].brecha;
                                   detalletecnicaService.getByEmpleado(parametros).then(
                                        function (result) {
                                            $scope.competenciasaevaluar = result.data;
                                            $scope.tecnica = 1;
                                            $scope.loading = false;
                                        },
                                        function (err) {
                                            $scope.muestraDatos = 0;
                                            toastr.error("No se han podido cargar la evaluación del período seleccionado");
                                        }
                                   );

                               },
                               function (err) {
                                   $scope.muestraDatos = 0;
                                   toastr.error("No se han podido cargar la información registrada en el sistema");
                               }
                              );
                    }
                }
            } else {
                $scope.muestraDatos = 0;
            }
        }

    }
})();