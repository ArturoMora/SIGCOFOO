/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultafamiliapuestospersonalCtrlGet", ['$scope', 'periodoevaluacionService', 'familiapuestosService',
            'familiacategoriasService', 'evaluacionconductualService',
            'evaluaciontecnicaService', 'tipocompetenciaService', 'tipoareaService',
            'nivelcompetenciatecnicaService', 'evaluacionsindicalizadosService', 'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder",
             "DTColumnDefBuilder", consultafamiliapuestospersonalCtrlGet]);

    function consultafamiliapuestospersonalCtrlGet($scope, periodoevaluacionService,
        familiapuestosService, familiacategoriasService, evaluacionconductualService,
        evaluaciontecnicaService, tipocompetenciaService, tipoareaService, nivelcompetenciatecnicaService, evaluacionsindicalizadosService,
        globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder,  DTColumnDefBuilder) {
 
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

            $scope.muestraListado = 0;
            $scope.NivelPersonalSel = "0";
            $scope.AINV = "0";
            $scope.ATEC = "0";

          
         

            $scope.tipoCompetenciaConsultada = 0;
            $scope.FiltraCatalogoPorPersonal = "0";

            $scope.nivelPersonal = [
                 { valor: "1", descripcion: "Investigador" },
                 { valor: "2", descripcion: "Sindicalizado" }
            ];
        
            $scope.PeriodosInv = [
                 { valor: "1", descripcion: "2010" },
                 { valor: "2", descripcion: "2011" },
                 { valor: "3", descripcion: "2012" },
                 { valor: "5", descripcion: "2013" },
                 { valor: "7", descripcion: "2015" }
            ];
        
            $scope.PeriodosTec = [
                 { valor: "5", descripcion: "2013" },
                 { valor: "7", descripcion: "2015" }
            ];



            $scope.FiltrarCatalogos = function () {
                if ($scope.NivelPersonalSel == "1") {
                    
                    $scope.FiltraCatalogoPorPersonal = "1";

                    tipocompetenciaService.getAll().then(
                          function (result) {
                              $scope.tipocompetencia = result.data;
                          },
                          function (err) {
                              toastr.error("No se han podido cargar la información registrada en el sistema");
                          }
                    );

                } else {
                    if ($scope.NivelPersonalSel == "2") {

                        periodoevaluacionService.getAll().then(
                          function (result) {
                              $scope.periodosEv = result.data;

                          },
                          function (err) {
                              toastr.error("No se han podido cargar la información registrada en el sistema");
                          }
                        );

                        $scope.FiltraCatalogoPorPersonal = "2";
                        $scope.tipoCompetenciaConsultada = 0;
                        $scope.tipocompetencia = null;
                        $scope.cargarFamiliasSind();
                    } else {
                        $scope.FiltraCatalogoPorPersonal = "";
                        $scope.tipoCompetenciaConsultada = 0;
                        $scope.tipocompetencia = null;
                    }
                }

                $scope.personal = null;
            }

            $scope.cargarCatalogosCambioPeriodo = function () {
                $scope.muestraListado = 0;
                $scope.personal = null;
            }

            $scope.cargarCatalogos = function () {

                $scope.muestraListado = 0;
                $scope.personal = null;
              
                               

                    if ($scope.tipoCompetenciaId === 1) {
                        $scope.tipoCompetenciaConsultada = 1;
                       
                        $scope.cargarFamilias();

                    } else {
                        $scope.tipoCompetenciaConsultada = 2;
                        tipoareaService.getAll().then(
                             function (result) {
                                 $scope.tipoarea = result.data;
                             },
                             function (err) {
                                 toastr.error("No se han podido cargar la información registrada en el sistema");
                             }
                        );
                    }


            }

            $scope.cargarFamilias = function () {
                familiapuestosService.getByPeriodo(1).then(
                    function (result) {
                        $scope.familiasPuestos = result.data;
                       
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                        $scope.familiasPuestos = null;
                    }
                );
            }

            $scope.cargarFamiliasSind = function () {
                familiapuestosService.getAllSind().then(
                    function (result) {
                        $scope.familiasPuestosSind = result.data;
                        
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                        $scope.familiasPuestosSind = null;
                    }
                );
            }

            $scope.cargarCategorias = function () {
                $scope.muestraListado = 0;
                $scope.personal = null;

                familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                    function (result) {
                        $scope.categoriasFamilias = result.data;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las categorías registradas en el sistema");
                        $scope.categoriasFamilias = null;
                    }
                );
            }

            $scope.cargarCategoriasSind = function () {

                $scope.muestraListado = 0;
                $scope.personal = null;

                familiacategoriasService.GetCategoriaFamiliaSind($scope.familiaId).then(
                    function (result) {
                        $scope.categoriasFamiliasSind = result.data;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las categorías registradas en el sistema");
                        $scope.categoriasFamiliasSind = null;
                    }
                );

            }


            $scope.recargaTec = function () {

                $scope.muestraListado = 0;
                $scope.personal = null;

                $scope.AINV = "0";
                $scope.ATEC = "0";

            }


            $scope.recargaInv = function () {

                $scope.muestraListado = 0;
                $scope.personal = null;

                $scope.AINV = "0";
                $scope.ATEC = "0";

            }


            $scope.recargaSind = function () {

                $scope.muestraListado = 0;
                $scope.personal = null;
                $scope.periodoId = 0;
                $scope.AINV = "0";
                $scope.ATEC = "0";


            }


            $scope.cargarNivelesPorArea = function () {
                
                $scope.muestraListado = 0;
                $scope.personal = null;

                         var parametros = {
                             'idnivel':  5,
                             'idcategoria': $scope.tipoAreaId
                         }



                         nivelcompetenciatecnicaService.getByPeriodoAndArea(parametros).then(
                           function (result) {
                               $scope.niveles = result.data;
                           },
                           function (err) {
                               toastr.error("No se han podido cargar las niveles asociados al área seleccionada");
                           }
                         );
                     
                     
            }


        $scope.personalEvaluado = function () {

            if ($scope.AINV != null || $scope.AINV != undefined || $scope.AINV > 0) {

                if ($scope.categoriaId != null || $scope.categoriaId != undefined || $scope.categoriaId > 0) {

                         

                    var numero = parseInt($scope.AINV);
                    var cad = "";

                    if (numero == 1) {
                        cad = "2010";
                    }

                    if (numero == 2) {
                        cad = "2011";
                    }

                    if (numero == 3) {
                        cad = "2012";
                    }

                    if (numero == 5) {
                        cad = "2013";
                    }

                    if (numero == 7) {
                        cad = "2015";
                    }

                    if (numero > 0) {

                        var parametros = {
                            'idCategoria': $scope.categoriaId,
                            'periodo': cad
                        }
                        evaluacionconductualService.getByCategoriaPeriodo(parametros).then(
                            function (result) {
                                $scope.personal = result.data;
                                $scope.muestraListado = 1;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar la evaluación registrada en el sistema");
                                $scope.muestraListado = 0;
                            }
                        );
                    } else {
                        toastr.error("Debe seleccionar un período de evaluación");
                        $scope.muestraListado = 0;
                    }
                    debugger;
                } else {
                    toastr.error("Debe seleccionar una categoría");
                    $scope.muestraListado = 0;
                }
            } else {
                toastr.error("Debe seleccionar un período de evaluación");
                $scope.muestraListado = 0;
            }
        }


        $scope.personalEvaluadoSind = function () {

           
            if ($scope.periodoId != null || $scope.periodoId != undefined || $scope.periodoId > 0) {

                if ($scope.categoriaId != null || $scope.categoriaId != undefined || $scope.categoriaId > 0) {

                    periodoevaluacionService.getById($scope.periodoId).then(
                      function (result) {
                          $scope.periodoSel = result.data;

                          var parametros = {
                              'idCategoria': $scope.categoriaId,
                              'periodo': $scope.periodoSel.periodo
                          }
                          evaluacionsindicalizadosService.getByCategoriaPeriodo(parametros).then(
                              function (result) {
                                  $scope.personal = result.data;
                                  $scope.muestraListado = 1;
                              },
                              function (err) {
                                  toastr.error("No se han podido cargar la evaluación registrada en el sistema");
                                  $scope.muestraListado = 0;
                              }
                          );
                      },
                      function (err) {
                          toastr.error("No se han podido cargar la información registrada en el sistema");
                      }
                    );
                } else {
                    toastr.error("Debe seleccionar una categoría");
                    $scope.muestraListado = 0;
                }
            } else {
                toastr.error("Debe seleccionar un período de evaluación");
                $scope.muestraListado = 0;
            }
        }

          
        $scope.personalTecnicas = function () {
          
            if ($scope.ATEC != null || $scope.ATEC != undefined || $scope.ATEC != "0") {
                if ($scope.nivelId != null || $scope.nivelId != undefined || $scope.nivelId > 0) {

                    var numero = parseInt($scope.ATEC);


                    var cad = "";

                    if (numero == 1) {
                        cad = "2010";
                    }

                    if (numero == 2) {
                        cad = "2011";
                    }

                    if (numero == 3) {
                        cad = "2012";
                    }

                    if (numero == 5) {
                        cad = "2013";
                    }

                    if (numero == 7) {
                        cad = "2015";
                    }

                    if (numero > 0) {
                        var parametros = {
                            'idNivel': $scope.nivelId,
                            'periodo': cad
                        }


                        evaluaciontecnicaService.getByAreaPeriodo(parametros).then(
                            function (result) {
                                $scope.personal = result.data;
                                $scope.muestraListado = 1;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar la evaluación registrada en el sistema");
                                $scope.muestraListado = 0;
                            }
                        );
                    } else {
                        toastr.error("Debe seleccionar un período de evaluación");
                        $scope.muestraListado = 0;
                    }
                     
                    
                } else {
                    toastr.error("Debe seleccionar un nivel de competencia");
                    $scope.muestraListado = 0;
                }
            } else {
                toastr.error("Debe seleccionar un período de evaluación");
                $scope.muestraListado = 0;
            }
        }










        //$scope.dtColumnDefs = [
        //    DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'string')
        //];

      






   
    

       


  
    }
})();