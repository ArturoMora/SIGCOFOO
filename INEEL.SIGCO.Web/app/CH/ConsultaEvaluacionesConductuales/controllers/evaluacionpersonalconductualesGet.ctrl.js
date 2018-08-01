/*AYUDA:
FooEntitiesService nombre de factory en VistaEvaluacionConductual.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("evaluacionpersonalconductualesCtrlGet", ["AuthService", "MenuService", '$rootScope', '$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', evaluacionpersonalconductualesCtrlGet]);

    function evaluacionpersonalconductualesCtrlGet(AuthService, MenuService, $rootScope, $scope, periodoevaluacionService, evaluacionconductualService, globalGet, $state, $stateParams) {

        $scope.authentication = AuthService.authentication;
        $scope.informacion = {};
        $scope.count = "0";
        $scope.mensaje = 0;
        
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

        $scope.loading = true;


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

        var today = new Date();
        var yyyy = today.getFullYear();
        
               
        var parametros = {
            'periodo': yyyy,
            'claveUnidad':  $scope.authentication.userprofile.claveUnidad
        }

        evaluacionconductualService.getByUnidadPeriodo(parametros).then(
            function (result) {
              $scope.registro = result.data;
              $scope.personalArea = $scope.registro.length;
              $scope.loading = false;
            },
            function (err) {
                   toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
            }
        );


        if ($scope.personalArea > 0) {
            evaluacionconductualService.CompetenciasConductualesResultadosPeriodo(parametros).then(
            function (result) {
                $scope.datosgrafica = result.data;
            });
        }

        $rootScope.parametros = {};
        $scope.parametrosTransferencia = function (clave, nombre, categoriaEmp, categoriaCom, calificacion, claveevaluacion, idcategoriacompetencia, nombreFamilia, id) {
            $rootScope.parametros.clave = clave;
            $rootScope.parametros.nombre = nombre;
            $rootScope.parametros.cateemp = categoriaEmp;
            $rootScope.parametros.catcomp = categoriaCom;
            $rootScope.parametros.calificacion = calificacion;
            $rootScope.parametros.evaluacionId = claveevaluacion;
            $rootScope.parametros.periodo = yyyy;
            $rootScope.parametros.unidad = $scope.authentication.userprofile.claveUnidad;
            $rootScope.parametros.nombreunidad = $scope.authentication.userprofile.unidadOrganizacional.nombreUnidad;
            $rootScope.parametros.idcategoriacompetencia = idcategoriacompetencia;
            $rootScope.parametros.nombreFamilia = nombreFamilia;
           
        }


    }
})();