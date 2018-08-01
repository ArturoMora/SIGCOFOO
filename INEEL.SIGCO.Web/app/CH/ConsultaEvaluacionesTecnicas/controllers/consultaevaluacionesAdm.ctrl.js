/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultaevaluacionesAdmCtrlGet", ["AuthService", "MenuService",
            '$rootScope', '$scope', 'periodoevaluacionService',
            'evaluaciontecnicaService', 'globalGet', '$state', "DTOptionsBuilder",
            '$stateParams', consultaevaluacionesAdmCtrlGet]);

    function consultaevaluacionesAdmCtrlGet(AuthService, MenuService, $rootScope, $scope,
        periodoevaluacionService, evaluaciontecnicaService,
        globalGet, $state, DTOptionsBuilder, $stateParams) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };



        $scope.nombreUnidad = {};
        $scope.nombreUnidadRegreso = "";
        $scope.mensaje = 0;
        $scope.loading = true;
        $scope.paramsDT = {};

        $scope.paramsDT = JSON.parse(localStorage.getItem('CHConsultaEvaluacionesTecnicasAdmGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }
        
        $scope.options = {

            animation: {
                onComplete: function () {
                    var chartInstance = this.chart;
                    var ctx = this.chart.ctx;
                    ctx.font = this.font;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        ctx.fillStyle = dataset.backgroundColor;
                        Chart.helpers.each(meta.data.forEach(function (bar, index) {
                            if (!meta.hidden) {
                                ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 6);
                            }
                        }), this)
                    }), this);
                }
            },
            tooltips: { enabled: true },
            legend: {
                display: true, position: 'bottom',
                //  reverse: true,
                labels: {
                    // boxWidth: 60,

                }
            }, scales: {
                xAxes: [{
                    gridLines:
                        {
                            display: false
                        },
                    scaleLabel: {
                        display: true,
                        labelString: 'Año'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Número de investigadores'
                    },

                }]
            }
        };
        $scope.colors = ["#F0AD4E", "#26B99A", "#03586A", "#73879C"];
        $scope.colors = [{
            backgroundColor: 'rgba(240,173,78,1)',
        }, {
            backgroundColor: 'rgba(38,185,154,1)',
        }, {
            backgroundColor: 'rgba(3,88,106,1)',
        }, {
            backgroundColor: 'rgba(115,135,156,1)',
        }];


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withDOM('lftrip');

        function stateSaveCallback(settings, data) {
            var stado = $('#CHConsultaEvaluacionesTecnicasAdmGet').DataTable().state();
            localStorage.setItem('CHConsultaEvaluacionesTecnicasAdmGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHConsultaEvaluacionesTecnicasAdmGet' + window.location.pathname))
            }

        }

        



        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined"){
          
        } else {

            if ($rootScope.parametros.periodo == null || $rootScope.parametros.periodo == 'undefined' || $rootScope.parametros.periodo == undefined || $rootScope.parametros.periodo == "undefined"){
               
            } else {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;
                $scope.nombreUnidadRegreso = $scope.nombreUnidad.nombreUnidad
              
                $scope.unidadresponsable = $scope.nombreUnidad.claveUnidad;           
                
                var parametros = {
                    'periodo': $scope.periodo,
                    'claveUnidad': $scope.unidadresponsable
                }

                evaluaciontecnicaService.getByUnidadPeriodo(parametros).then(
                     function (result) {
                         $scope.registro = result.data;
                         $scope.loading = false;
                         $scope.NoMuestraGrafica = 1;
                     },
                     function (err) {
                         toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                         $scope.NoMuestraGrafica = 0;
                     }
                );

                evaluaciontecnicaService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                function (result) {
                    $scope.datosgrafica = result.data;
                });
            }     
        }
                        
        periodoevaluacionService.getAllTecnicas().then(
          function (result) {
             $scope.periodosEV = result.data;
          },
          function (err) {
             toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        $scope.cargarEvaluaciones = function () {
           
            $scope.unidadresponsable = $scope.nombreUnidad.claveUnidad;
            $scope.paramsDT = {};
            var parametros = {
                'periodo': $scope.periodo,
                'claveUnidad': $scope.unidadresponsable
            }
            
            var periodoS = parseInt($scope.periodo);
            var unidadS = parseInt($scope.unidadresponsable);

            if (periodoS > 0 && unidadS > 0) {
                $scope.NoMuestraGrafica = 1;

                if ($scope.periodo == 'undefined' || $scope.periodo == undefined || $scope.periodo == null || $scope.periodo == "undefined" || $scope.periodo == "" || isNaN($scope.periodo)) {
                    $scope.registro = null;
                    $scope.datosgrafica = null;
                } else {
                    evaluaciontecnicaService.getByUnidadPeriodo(parametros).then(
                        function (result) {
                            $scope.registro = result.data;

                            $scope.loading = false;
                           
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las evaluaciones del período y unidad seleccionados");
                           
                        }
                    );
                    if ($scope.nombreUnidad.claveUnidad === "70" || $scope.nombreUnidad.claveUnidad === "73") {
                        $scope.NoMuestraGrafica = 0;
                        $scope.registro = null;
                        $scope.datosgrafica = null;
                    } else {
                                                     
                        evaluaciontecnicaService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                        function (result) {
                            $scope.datosgrafica = result.data;
                            if ($scope.datosgrafica.series.length > 0)
                                $scope.NoMuestraGrafica = 1;
                        });
                    }
                }
            } else {
                $scope.NoMuestraGrafica = 0;
            }
        }

        $scope.$watch('nombreUnidad', function () {
            if ($scope.nombreUnidadRegreso == "") {
                $scope.cargarEvaluaciones();
            } else {

                if ($scope.nombreUnidadRegreso != $scope.nombreUnidad.nombreUnidad) {
                    $scope.cargarEvaluaciones();
                }
            }
        });

        
        $rootScope.parametros = {};
        $scope.parametrosTransferencia = function (clave, nombre, nivel, calificacion, brecha, nomina, idReg) {
            $rootScope.parametros.clave =  clave;
            $rootScope.parametros.nombre = nombre;
            $rootScope.parametros.nivel =  nivel;
            $rootScope.parametros.calificacion = calificacion;
            $rootScope.parametros.brecha = brecha;
            $rootScope.parametros.periodo = $scope.periodo;
            $rootScope.parametros.unidad = $scope.nombreUnidad;
            $rootScope.parametros.nomina = nomina;
            
            $state.go("detalleevaluacionestecnicashistorialAdm", { id: idReg });
        }
  

    }

})();