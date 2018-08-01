/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultaevaluacionesalcanzadasCtrlGet", ["AuthService", "MenuService", '$rootScope', '$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', consultaevaluacionesalcanzadasCtrlGet]);

    function consultaevaluacionesalcanzadasCtrlGet(AuthService, MenuService, $rootScope, $scope, periodoevaluacionService, evaluacionconductualService, globalGet, $state, $stateParams) {
      

        $scope.authentication = AuthService.authentication;
        $scope.informacion = {};
        $scope.count = "0";

        $scope.nombreUnidad = {};
        $scope.nombreUnidadRegreso = "";
        $scope.mensaje = 0;

        $scope.muestraDatos = 0;
      

        //obtener clave de usuario
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;
        //Saber con que rol inicio session
        $scope.idRol = MenuService.getRolId();
        if ($scope.idRol === 8) {
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
                    }
                 
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


        if ($rootScope.parametros === 'undefined' || $rootScope.parametros === null || $rootScope.parametros === undefined || $rootScope.parametros === "undefined") {
        } else {
            if ($rootScope.parametros.periodo === null || $rootScope.parametros.periodo === 'undefined' || $rootScope.parametros.periodo === undefined || $rootScope.parametros.periodo === "undefined"){
            } else {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;
                $scope.nombreUnidadRegreso = $scope.nombreUnidad.nombreUnidad;

                $scope.unidadresponsable = 0;

                if ($scope.idRol == 4) {
                    $scope.unidadresponsable = $scope.authentication.userprofile.claveUnidad;
                } else {

                    $scope.unidadresponsable = $scope.nombreUnidad.claveUnidad;
                }

                var parametros = {
                    'periodo': $scope.periodo,
                    'claveUnidad': $scope.unidadresponsable
                }

                evaluacionconductualService.getByUnidadPeriodo(parametros).then(
                     function (result) {
                         $scope.registro = result.data;
                         $scope.loading = false;
                     },
                     function (err) {
                         toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
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
            $scope.unidadresponsable = 0;
          

            if ($scope.idRol == 4) {
                $scope.unidadresponsable = $scope.authentication.userprofile.claveUnidad;
            } else {

                $scope.unidadresponsable = $scope.nombreUnidad.claveUnidad;
            }

            var parametros = {
                'periodo': $scope.periodo,
                'claveUnidad': $scope.unidadresponsable
            }

            if ($scope.periodo === 'undefined' || $scope.periodo === undefined || $scope.periodo === null || $scope.periodo === "undefined" || $scope.periodo === "") {
            } else {

                if ($scope.unidadresponsable === 'undefined' || $scope.unidadresponsable === undefined || $scope.unidadresponsable === null || $scope.unidadresponsable === "undefined" || $scope.unidadresponsable === "") {

                } else {

                    $scope.muestraDatos = 1;
                    evaluacionconductualService.getByUnidadPeriodo(parametros).then(
                        function (result) {
                            $scope.registro = result.data;

                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                        }
                    );

                    evaluacionconductualService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                    function (result) {
                        $scope.datosgrafica = result.data;
                    });
                }
            }
        }

        $scope.$watch('nombreUnidad', function () {
            if ($scope.nombreUnidadRegreso === "") {
                $scope.cargarEvaluaciones();
            } else {

                if ($scope.nombreUnidadRegreso !== $scope.nombreUnidad.nombreUnidad) {
                    $scope.cargarEvaluaciones();
                }
            }
        });

     

  

    }

})();