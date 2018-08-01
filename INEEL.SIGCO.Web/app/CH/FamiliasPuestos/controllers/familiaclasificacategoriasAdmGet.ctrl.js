/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiaclasificacategoriasAdmCtrlGet", ['$rootScope', '$scope', 'familiapuestosService', 'familiacategoriasService', 'clasificacategoriasconductualesService', 'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", familiaclasificacategoriasAdmCtrlGet]);

    function familiaclasificacategoriasAdmCtrlGet($rootScope, $scope, familiapuestosService, familiacategoriasService, clasificacategoriasconductualesService, globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
       
        var id = $stateParams.id;

        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
                       
        $scope.nombreUnidad = $rootScope.parametros.unidad.nombreUnidad;

        $scope.familiaseleccionada = $stateParams.id;
               
        //Obtene ambito
        familiapuestosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.periodoSeleccionadoIDFam = $scope.registro.periodo.periodoEvaluaionId;
                $scope.periodoSeleccionadoFam = $scope.registro.periodo.periodo;
                $scope.nombrefamiliaseleccionada = $scope.registro.nombreFamilia;
            },
            function (err) {
                console.error(err);
            }        
        );
        
        if (id !== undefined || id !== "" || id !== NaN) {
            clasificacategoriasconductualesService.getByFamilia(id).then(
               function (result) {
                   $scope.categorias = result.data;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No hay categorías registradas para este período");
               }
            );
        }
                      
        $scope.open = function () {
            $scope.datoRegistado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CH/FamiliasPuestos/ClasificaCategoriasConductualesUnidadAdd.html',
                controller: 'clasificacategoriasconductualesunidadCtrlAdd',
                scope: $scope
            });
        }
              
        $scope.cargarregistros = function (id) {
            clasificacategoriasconductualesService.getByFamilia(id).then(
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


        $scope.eliminaCategoria = function (id) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.categorias.length; i++) {
                            if ($scope.categorias[i].relacionId === id) {
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

       
    }
})();