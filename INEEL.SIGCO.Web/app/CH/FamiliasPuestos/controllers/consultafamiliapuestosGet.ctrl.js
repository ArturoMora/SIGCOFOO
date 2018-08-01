/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultafamiliapuestosCtrlGet", ['$scope', 'periodoevaluacionService', 'familiapuestosService',
            'familiacategoriasService', 'matrizcompetenciasService', 'tipocompetenciaService', 'tipoareaService', 'nivelcompetenciatecnicaService', 'competenciatecnicaService',
            'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", consultafamiliapuestosCtrlGet]);

    function consultafamiliapuestosCtrlGet($scope, periodoevaluacionService, familiapuestosService,
        familiacategoriasService, matrizcompetenciasService, tipocompetenciaService, tipoareaService, nivelcompetenciatecnicaService, competenciatecnicaService,
        globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
             
        
        $scope.muestraListado = 0;
        $scope.NivelPersonalSel = "0";
        $scope.tipoCompetenciaConsultada = 0;
        $scope.FiltraCatalogoPorPersonal = "0";

        $scope.nivelPersonal = [
             { valor: "1", descripcion: "Investigador" },
             { valor: "2", descripcion: "Sindicalizado" }
        ];

       
                   
        $scope.FiltrarCatalogos = function () {             
            if ($scope.NivelPersonalSel == "1") {

                tipocompetenciaService.getAll().then(
                      function (result) {
                          $scope.tipocompetencia = result.data;
                      },
                      function (err) {
                          toastr.error("No se han podido cargar la información registrada en el sistema");
                      }
                );

                $scope.FiltraCatalogoPorPersonal = "1";
                $scope.tipoCompetenciaConsultada = 0;
                $scope.muestraListado = 0;
                $scope.matriz = null;
                $scope.registroCompetenciasTecnicas = null;
            } else {
                if ($scope.NivelPersonalSel == "2") {
                    $scope.tipoCompetenciaConsultada = 1;
                    $scope.FiltraCatalogoPorPersonal = "2";
                    $scope.muestraListado = 0;
                    $scope.matriz = null;
                    $scope.registroCompetenciasTecnicas = null;
                    $scope.tipocompetencia = null;
                    $scope.cargarFamiliasSind();
                } else {
                    $scope.tipoCompetenciaConsultada = 0;
                    $scope.FiltraCatalogoPorPersonal = "";
                    $scope.muestraListado = 0;
                    $scope.matriz = null;
                    $scope.registroCompetenciasTecnicas = null;
                    $scope.tipocompetencia = null;
                }
            }
        }
        
    

        $scope.cargarCatalogos = function () {
          
            $scope.muestraListado = 0;
            $scope.matriz = null;
            $scope.registroCompetenciasTecnicas = null;


            if ($scope.tipoCompetenciaId == 1) {
                $scope.tipoCompetenciaConsultada = 1;
                $scope.cargarFamilias();

            } else {
                if ($scope.tipoCompetenciaId == 2) {
                    $scope.tipoCompetenciaConsultada = 2;
                    tipoareaService.getAll().then(
                         function (result) {
                             $scope.tipoarea = result.data;
                         },
                         function (err) {
                             toastr.error("No se han podido cargar la información registrada en el sistema");
                         }
                    );
                } else {
                    $scope.tipoCompetenciaConsultada = 0;
                    $scope.muestraListado = 0;
                    $scope.matriz = null;
                    $scope.registroCompetenciasTecnicas = null;
                }
            }
        }

        $scope.cargarFamilias = function () {




            familiapuestosService.getByPeriodo(1).then(
                function (result) {
                    $scope.familiasPuestos = result.data;
                   
                },
                function (err) {
                   
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
                  
                    $scope.familiasPuestosSind = null;
                }
            );


        }   

        $scope.cargarCategorias = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                function (result) {
                    $scope.categoriasFamilias = result.data;

                    $scope.muestraListado = 0;
                    $scope.matriz = null;
                    $scope.registroCompetenciasTecnicas = null;

                },
                function (err) {
                    toastr.error("No se han podido cargar las categorías registradas en el sistema");
                    $scope.categoriasFamilias = null;
                }
            );
        }

        $scope.cargarCategoriasSind = function () {
            familiacategoriasService.GetCategoriaFamiliaSind($scope.familiaId).then(
                function (result) {
                    $scope.categoriasFamiliasSind = result.data;

                    $scope.muestraListado = 0;
                    $scope.matriz = null;
                    $scope.registroCompetenciasTecnicas = null;
                },
                function (err) {
                    toastr.error("No se han podido cargar las categorías registradas en el sistema");
                    $scope.categoriasFamiliasSind = null;
                }
            );
        }

        $scope.cargarNivelesPorArea = function () {

            $scope.muestraListado = 0;
            $scope.matriz = null;
            $scope.registroCompetenciasTecnicas = null;

            var parametros = {
                'idnivel': 5,
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

        $scope.cargarMatriz = function () {
           
            if ($scope.categoriaId != null || $scope.categoriaId != undefined || $scope.categoriaId > 0) {
               
                matrizcompetenciasService.getMatriz($scope.categoriaId).then(
                  function (result) {

                      $scope.matriz = result.data;
                      $scope.muestraListado = 1;
                      $scope.loading = false;
                  },
                  function (err) {
                      toastr.error("No se han podido cargar la información solicitada");
                      $scope.muestraListado = 0;
                  }

              );
            }
        }

        $scope.cargarMatrizSind = function () {
            if ($scope.categoriaId != null || $scope.categoriaId != undefined || $scope.categoriaId > 0) {
                
                matrizcompetenciasService.getMatrizSind($scope.categoriaId).then(
                  function (result) {
                      $scope.muestraListado = 1;
                      $scope.tipoCompetenciaConsultada = 1;
                      $scope.FiltraCatalogoPorPersonal = "2";
                      $scope.matriz = result.data;
                      $scope.loading = false;
                  },
                  function (err) {
                      toastr.error("No se han podido cargar la información solicitada");
                      $scope.muestraListado = 0;
                  }
              );

            }
        }

        $scope.cargarCompetenciasTecnicas = function () {


            if ($scope.nivelId != null || $scope.nivelId != undefined || $scope.nivelId > 0) {


                var N = parseInt($scope.nivelId);


                if (N > 0) {
                    var parametros = {
                        "periodoId": 5,
                        "nivelId": $scope.nivelId,
                        "areaId": $scope.tipoAreaId

                    }

                    competenciatecnicaService.getByPeriodoArea(parametros).then(
                        function (result) {
                            $scope.registroCompetenciasTecnicas = result.data;
                            $scope.muestraListado = 1;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las competencias técnicas registrados en el sistema");
                            $scope.muestraListado = 0;
                        }
                    );
                } else {
                    toastr.error("Debe seleccionar un nivel de competencia");
                    $scope.muestraListado = 0;
                }
            }
        }
    
  
  
  
    }
})();