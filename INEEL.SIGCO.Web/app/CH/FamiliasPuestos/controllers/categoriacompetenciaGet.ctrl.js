/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("categoriacompetenciaCtrlGet", ['$rootScope', '$scope', 'periodoevaluacionService', 'familiapuestosService', 'familiacategoriasService', 'matrizcompetenciasService', 'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", categoriacompetenciaCtrlGet]);

    function categoriacompetenciaCtrlGet($rootScope, $scope, periodoevaluacionService, familiapuestosService, familiacategoriasService, matrizcompetenciasService, globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
               
        $scope.HaSeleccionadoPeriodo = 0;


        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined") {
        } else {
          

            if ($rootScope.parametros.periodo == null || $rootScope.parametros.periodo == 'undefined' || $rootScope.parametros.periodo == undefined || $rootScope.parametros.periodo == "undefined") {
            } else {
               

                $scope.periodoId = parseInt($rootScope.parametros.periodo);
                $scope.familiaId = parseInt($rootScope.parametros.familia);
                $scope.categoriaId = parseInt($rootScope.parametros.categoria);

                if ($scope.familiaId == null || $scope.familiaId == undefined || $scope.familiaId == 'undefined') {

                } else {
                    $scope.HaSeleccionadoPeriodo = 1;

                    familiapuestosService.getByPeriodo($scope.periodoId).then(
                        function (result) {
                            $scope.familiasPuestos = result.data;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                        }
                    );

                    familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                        function (result) {
                            $scope.categoriasFamilias = result.data;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las categorias de la familia de puestos registrados en el sistema");
                        }
                    );

                    matrizcompetenciasService.getMatriz($scope.categoriaId).then(
                      function (result) {

                          for (var i = 0; i < result.data.length; i++) {
                              if (result.data[i].estado == "1") {
                                  result.data[i].estado = true;
                              } else {
                                  result.data[i].estado = false;
                              }
                          }

                          $scope.matriz = result.data;
                          $scope.loading = false;
                      },
                      function (err) {
                          toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                      }
                  );
                }
            }
        }
                
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEv = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar los períodos de evaluación");
          }
        );
     
        $scope.cargarFamilias = function () {
           
            var x = parseInt($scope.periodoId)
            if (x > 0) {


                familiapuestosService.getByPeriodo($scope.periodoId).then(
                    function (result) {
                        $scope.familiasPuestos = result.data;
                        $scope.loading = false;
                        $scope.HaSeleccionadoPeriodo = 1;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                        $scope.HaSeleccionadoPeriodo = 0;
                    }
                );
            } else {
                $scope.HaSeleccionadoPeriodo = 0;
            }
        }

        $scope.cargarCategorias = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                function (result) {
                    $scope.categoriasFamilias = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las categorías registradas");
                }
            );
        }

        $scope.cargarMatriz = function () {           
            matrizcompetenciasService.getMatriz($scope.categoriaId).then(
              function (result) {

                  for (var i = 0; i < result.data.length; i++) {
                      if (result.data[i].estado == "1") {
                          result.data[i].estado = true;
                      } else {
                          result.data[i].estado = false;
                      }
                  }
                  $scope.matriz = result.data;
                  $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
              }
          ); 
        }

        $rootScope.parametros = {};
        $scope.nose = function () {
            $rootScope.parametros.familia = $scope.familiaId;
            $rootScope.parametros.periodo = $scope.periodoId;
            $rootScope.parametros.categoria = $scope.categoriaId;
        }
    
        //Guardar estado
        $scope.saveEstado = function (id, estado) {

            var pagina;
            var _estado;
            var registro;

            if (estado == true) {
                pagina = "Active";
                _estado = 1;
            } else {
                pagina = "Delete";
                _estado = 0;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        debugger;
                        registro = {
                            "matrizId": id,
                            "estado": _estado
                        };
                        matrizcompetenciasService.updateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.matriz.length; i++) {
                            if ($scope.matriz[i].matrizId == id) {
                                $scope.matriz[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        //eliminar usuario
        $scope.eliminaNivel = function (idmat) {

            var pagina;
            var _estado;
            var registro;

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {

                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.matriz.length; i++) {
                            if ($scope.matriz[i].matrizId == idmat) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.matriz.splice($scope.indiceAEliminar, 1);

                        matrizcompetenciasService.delete(idmat);
                        $uibModalInstance.dismiss('cancel');

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }// FIN DE FUNCION QUE GUARDA ESTADO 

  
    }
})();