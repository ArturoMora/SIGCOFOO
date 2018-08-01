/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("promediocompetenciasCtrlGet", ["AuthService", "MenuService", '$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'familiapuestosService', 'familiacategoriasService', 'globalGet', '$state', '$stateParams', promediocompetenciasCtrlGet]);

    function promediocompetenciasCtrlGet(AuthService, MenuService, $scope, periodoevaluacionService, evaluacionconductualService, familiapuestosService, familiacategoriasService, globalGet, $state, $stateParams) {

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
                        labelString: 'Competencias'
                    },

                }]
            }
        };
       

        $scope.loading = true;
        $scope.nombreUnidad = {};

        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEV = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );              
       
        familiapuestosService.getByPeriodo(1).then(
                function (result) {
                    $scope.familiasPuestos = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
        );
        

        $scope.cargarCategorias = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                function (result) {
                    $scope.categoriasFamilias = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
            );
        }


        $scope.cargarGrafica = function () {

            var parametros = {
                "idcategoria": $scope.categoriaId,
                "periodo": $scope.periodo,
                "claveunidad" :$scope.nombreUnidad.claveUnidad
            };
                            
            evaluacionconductualService.getPromedioCompetencias(parametros).then(
              function (result) {
                  $scope.datosgrafica = result.data;
                 
              },
              function (err) {
                  
              }
            );
          
        }
      
        $scope.$watch('nombreUnidad', function () {
            $scope.cargarGrafica();
        });



    }

})();