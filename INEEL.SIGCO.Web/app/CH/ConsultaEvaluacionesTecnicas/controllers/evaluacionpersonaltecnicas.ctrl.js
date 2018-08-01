/*AYUDA:
FooEntitiesService nombre de factory en vistaevaluaciontecnica.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("evaluacionpersonaltecnicasCtrlGet", ["AuthService", "MenuService",'$rootScope', '$scope', 'periodoevaluacionService', 'evaluaciontecnicaService', 'globalGet', '$state', '$stateParams', "$uibModal", evaluacionpersonaltecnicasCtrlGet]);

    function evaluacionpersonaltecnicasCtrlGet(AuthService, MenuService, $rootScope, $scope, periodoevaluacionService, evaluaciontecnicaService, globalGet, $state, $stateParams, $uibModal) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };


        $scope.authentication = AuthService.authentication;
        $scope.informacion = {};
        $scope.count = "0";
        $scope.mensaje = 0;

        $scope.personalArea = 0;
            
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


        var today = new Date();
        var yyyy = today.getFullYear();
        
        
            var parametros = {
                'periodo': yyyy,
                'claveUnidad': $scope.authentication.userprofile.claveUnidad
            }

            evaluaciontecnicaService.getByUnidadPeriodo(parametros).then(
                 function (result) {
                     $scope.registro = result.data;
                     $scope.personalArea = $scope.registro.length;
                     $scope.loading = false;
                 },
                 function (err) {
                     toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                 }
            );
          
           
                evaluaciontecnicaService.CompetenciasConductualesResultadosPeriodo(parametros).then(
                function (result) {
                    $scope.datosgrafica = result.data;
                });
         
        
                  
        $scope.parametrosTransferencia = function (clave, nombre, nivel, calificacion, brecha, nomina, idReg) {
            $rootScope.parametros = {};
   
            $rootScope.parametros.clave = clave;
            $rootScope.parametros.nombre = nombre;
            $rootScope.parametros.nivel = nivel;
            $rootScope.parametros.calificacion = calificacion;
            $rootScope.parametros.brecha = brecha;
            $rootScope.parametros.periodo = yyyy;
            $rootScope.parametros.unidad = $scope.authentication.userprofile.claveUnidad;
            $rootScope.parametros.nombreunidad = $scope.authentication.userprofile.unidadOrganizacional.nombreUnidad;
            $rootScope.parametros.claveCategoria = nomina;
            $state.go("formularioevaluaciontecnicas", { id: idReg });
        }
        

    }

})();