/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("clasificacategoriastecnicasCtrlGet", ['$scope', 'clasificacategoriastecnicasService', 'periodoevaluacionService', 'tipoareaService', 'globalGet', '$state', '$stateParams', "$uibModal", clasificacategoriastecnicasCtrlGet]);

    function clasificacategoriastecnicasCtrlGet($scope, clasificacategoriastecnicasService, periodoevaluacionService, tipoareaService, globalGet, $state, $stateParams, $uibModal) {
       
        var id = $stateParams.id;
        $scope.id = $stateParams.id;

        $scope.haSeleccionadoPeriodo = 0;
        $scope.areaSeleccionada = "";

        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;
              $scope.periodoId = parseInt($scope.id);
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        tipoareaService.getAll().then(
            function (result) {
                $scope.areasev = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );
      
        $scope.cargarPorPeriodo = function () {
            $scope.haSeleccionadoPeriodo = 1;
            clasificacategoriastecnicasService.getByPeriodo($scope.periodoId).then(
               function (result) {
                   $scope.categorias = result.data;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No hay categorías registradas para este período");
               }
            );
        }


        $scope.cargarPorTipo = function () {
           
            var parametros = {
                "periodoId" :$scope.periodoId, 
                "areaId": $scope.areaId
            };
            
            clasificacategoriastecnicasService.getByTipo(parametros).then(
               function (result) {
                   $scope.categorias = result.data;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No hay categorías registradas para este período");
               }
            );
        }

       
        //ELIMINAR UNIDADES 
        $scope.eliminaunidad = function (id) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.categorias.length; i++) {
                            if ($scope.categorias[i].id === id) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.categorias.splice($scope.indiceAEliminar, 1);

                        clasificacategoriastecnicasService.delete(id);
                        $uibModalInstance.dismiss('cancel');

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }// FIN DE FUNCION QUE ELIMINA UNIDAD 
       
        $scope.open = function () {
            
            $scope.tipoAreaSeleccionada = 0;

            for (var i = 0; i < $scope.areasev.length; i++) {

                if ($scope.areasev[i].tipoAreaId === $scope.areaId) {
                    $scope.areaSeleccionada = $scope.areasev[i].area;
                    $scope.tipoAreaSeleccionada = 1;
                    break;
                }
            }

            if ($scope.periodoId === undefined || $scope.periodoId === null || isNaN($scope.periodoId)) {
                toastr.error("Seleccione un periodo de evaluación");
            } else {

                if ($scope.tipoAreaSeleccionada === 1) {
                    $scope.datoRegistado = {};
                    var modalInstance = $uibModal.open({
                        size: 'lg',
                        templateUrl: 'app/CH/CompetenciaTecnica/ClasificaCategoriasTecnicasAdd.html',
                        controller: 'clasificacategoriastecnicasCtrlAdd',
                        scope: $scope
                    });
                } else {
                    toastr.error("Debe seleccionar un tipo de área");
                }
            }
        }


        $scope.cargarregistros = function (id1, id2) {

            var parametros = {
                "periodoId": $scope.periodoId,
                "areaId": $scope.areaId
            };

            clasificacategoriastecnicasService.getByTipo(parametros).then(
               function (result) {
                   $scope.categorias = result.data;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No hay categorías registradas para este período");
               }
            );
        }


        $scope.mensajeDeResultadoCarga = function (resultadoRegistro) {
            $scope.mensaje = resultadoRegistro;
        }

    }
})();