/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("clasificacategoriasconductualesCtrlGet", ['$scope', 'clasificacategoriasconductualesService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', "$uibModal", clasificacategoriasconductualesCtrlGet]);

    function clasificacategoriasconductualesCtrlGet($scope, clasificacategoriasconductualesService, periodoevaluacionService, globalGet, $state, $stateParams, $uibModal) {
       
        var id = $stateParams.id;
        $scope.id = $stateParams.id;
        $scope.haSeleccionadoPeriodo = 0;
       
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;
              $scope.periodoId = parseInt($scope.id);
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );
      
        $scope.cargarPorPeriodo = function () {
            $scope.haSeleccionadoPeriodo = 1;
            clasificacategoriasconductualesService.getByPeriodo($scope.periodoId).then(
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

                        clasificacategoriasconductualesService.delete(id);
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

            if ($scope.periodoId === undefined || $scope.periodoId === null || isNaN($scope.periodoId)) {
                toastr.error("Seleccione un periodo de evaluación");
            } else {
                $scope.datoRegistado = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/CH/Competencias/ClasificaCategoriasConductualesAdd.html',
                    controller: 'clasificacategoriasconductualesCtrlAdd',
                    scope: $scope
                });
            }
        }

        $scope.cargarregistros = function (id) {
            clasificacategoriasconductualesService.getByPeriodo($scope.periodoId).then(
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