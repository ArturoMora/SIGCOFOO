/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultaevaluacionesconductualesAdmCtrlGet",
        ["AuthService", "MenuService", '$rootScope',
            '$scope', 'periodoevaluacionService',
            'evaluacionconductualService', 'globalGet', '$state',
            '$stateParams', 'DTOptionsBuilder',
            consultaevaluacionesconductualesAdmCtrlGet]);

    function consultaevaluacionesconductualesAdmCtrlGet(AuthService, MenuService, $rootScope,
        $scope, periodoevaluacionService,
        evaluacionconductualService, globalGet, $state,
        $stateParams, DTOptionsBuilder) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        

        $scope.nombreUnidad = {};
        $scope.nombreUnidadRegreso = "";
        $scope.mensaje = 0;
        $scope.NoMuestraGrafica = 0;

        $scope.paramsDT = JSON.parse(localStorage.getItem('CHConsultaEvaluacionesConductualesAdmGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
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

        $scope.loading = true;


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withDOM('lftrpi');


        function stateSaveCallback(settings, data) {
            var stado = $('#CHConsultaEvaluacionesConductualesAdmGet').DataTable().state();
            localStorage.setItem('CHConsultaEvaluacionesConductualesAdmGet' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CHConsultaEvaluacionesConductualesAdmGet' + window.location.pathname))
            }

        }


        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined"){
            
        } else {
            if ($rootScope.parametros.periodo == null || $rootScope.parametros.periodo == 'undefined' || $rootScope.parametros.periodo == undefined || $rootScope.parametros.periodo == "undefined"){
               
            } else {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;
                $scope.nombreUnidadRegreso = $scope.nombreUnidad.nombreUnidad;
                $scope.unidadresponsable = $scope.nombreUnidad.claveUnidad;
              
                var parametros = {
                    'periodo': $scope.periodo,
                    'claveUnidad': $scope.unidadresponsable
                }

                evaluacionconductualService.getByUnidadPeriodo(parametros).then(
                     function (result) {
                         $scope.registro = result.data;
                                              
                         $scope.loading = false;
                         $scope.NoMuestraGrafica = 1;
                     },
                     function (err) {
                         toastr.error("No se han podido cargar las evaluaciones del período y unidad seleccionados");
                         $scope.NoMuestraGrafica = 0;
                     }
                );

                evaluacionconductualService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                           function (result) {
                    $scope.datosgrafica = result.data;
                 });

            }
           
        }


        periodoevaluacionService.getAll().then(
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
                  
                } else {
                    evaluacionconductualService.getByUnidadPeriodo(parametros).then(
                        function (result) {
                            $scope.registro = result.data;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                        }
                    );                              

                    if ($scope.nombreUnidad.claveUnidad === "70" || $scope.nombreUnidad.claveUnidad === "73") {
                        $scope.NoMuestraGrafica = 0;
                        $scope.registro = null;
                        $scope.datosgrafica = null;
                    } else {
                       
                        evaluacionconductualService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                       function (result) {
                           $scope.datosgrafica = result.data;
                           if($scope.datosgrafica.series.length > 0)
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
        $scope.parametrosTransferencia = function (clave, nombre, categoriaEmp, categoriaCom, calificacion, claveevaluacion, idcategoriacompetencia, nombreFamilia, idReg) {
            $rootScope.parametros.clave = clave;
            $rootScope.parametros.nombre = nombre;
            $rootScope.parametros.cateemp = categoriaEmp;
            $rootScope.parametros.catcomp = categoriaCom;
            $rootScope.parametros.calificacion = calificacion;
            $rootScope.parametros.evaluacionid = claveevaluacion;
            $rootScope.parametros.periodo = $scope.periodo;
            $rootScope.parametros.unidad = $scope.nombreUnidad;
            $rootScope.parametros.idcategoriacompetencia = idcategoriacompetencia;
            $rootScope.parametros.nombreFamilia = nombreFamilia;
            $state.go("detalleevaluacionconductualesAdm", { id: idReg });

        }

  

        $scope.imprimirReporte = function () {

            var today = new Date();
            var yyyy = today.getFullYear();
            var mmmm = today.getMonth();
            var dddd = today.getDate();

            // var canvas = document.getElementById("myChart");
            //var img = canvas.toDataURL("image/png");
            var doc = new jsPDF('l', 'pt');

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
                var str = "Página " + data.pageCount;
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            };

            var options = {
                afterPageContent: footer,
                margin: { top: 50 },
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { fontSize: 8, halign: 'center', valign: 'middle' },
                bodyStyles: { fontSize: 6, valign: 'middle', halign: 'left' },
                columnStyles: {
                    0: { halign: 'left', columnWidth: 50 }
                }
            };

          
            var res = doc.autoTableHtmlToJson(document.getElementById("personal"));
            doc.setFontSize(12);
            doc.text('Evaluado', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });

          


            doc.save('reporte.pdf');

        }




    }

})();