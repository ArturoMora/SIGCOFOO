/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("clasificacategoriasconductualesunidadCtrlAdd", ['$location', '$scope', 'clasificacategoriasconductualesService', 'periodoevaluacionService',
            'familiacategoriasService', 'familiapuestosService',
            'globalGet', '$state',
            '$stateParams', "$uibModalInstance",
            "DTOptionsBuilder", clasificacategoriasconductualesunidadCtrlAdd]);

    function clasificacategoriasconductualesunidadCtrlAdd($location, $scope, clasificacategoriasconductualesService, periodoevaluacionService,
        familiacategoriasService,familiapuestosService,
        globalGet, $state, $stateParams, $uibModalInstance, DTOptionsBuilder) {

        periodoevaluacionService.getById($scope.periodoSeleccionadoIDFam).then(
          function (result) {
              $scope.periodoEv = result.data;           
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        clasificacategoriasconductualesService.getCategorias().then(
           function (result) {
               $scope.nomina = result.data;
               $scope.loading = false;
           },
           function (err) {
               toastr.error("No hay unidades registradas en el período seleccionado");
           }
        );


       
            familiacategoriasService.GetCategoriaFamilia($scope.familiaseleccionada).then(
              function (result) {
                  $scope.categoriasFamiliasTecnicas = result.data;
                  $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar las categorias de la familia de puestos registrados en el sistema");
              }
            );
       

        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.save = function () {
            var descripcionNomina = "";
            var descripcionNivelTecnico = "";
            var descripcionNivelServicio = "";
             
          
            if ($scope.categoriaNominaId  === "" || $scope.categoriaNominaId === undefined || $scope.categoriaNominaId === null) {
                toastr.error("No ha seleccionado una categoría de nómina");
            } else {
              

                if ($scope.categoriaIdTecnica === "" || $scope.categoriaIdTecnica === undefined || $scope.categoriaIdTecnica === null) {
                    toastr.error("No ha seleccionado una categoría de competencias conductuales");
                } else {

                    for (var i = 0; i < $scope.nomina.length; i++) {
                        if ($scope.nomina[i].categoriaId === $scope.categoriaNominaId) {
                            descripcionNomina = $scope.nomina[i].descripcion;
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.categoriasFamiliasTecnicas.length; i++) {
                        if ($scope.categoriasFamiliasTecnicas[i].categoriaId === $scope.categoriaIdTecnica) {
                            descripcionNivelTecnico = $scope.categoriasFamiliasTecnicas[i].descripcion;
                        }
                    }

                    var Registro = {
                        "claveCategoria": $scope.categoriaNominaId,
                        "categoriaEmpleado": descripcionNomina,
                        "periodoId": $scope.periodoEv.periodoEvaluaionId,
                        "categoriaCompetencia": $scope.categoriaIdTecnica,
                        "categoriaServicio": 80,
                        "nombreCategoriaServicio": "",
                        "familiaId": $scope.familiaseleccionada,
                        "estado": 1
                    }

                    var bandera = 0;

                    for (var i = 0; i < $scope.categorias.length; i++) {

                        if ($scope.categorias[i].claveCategoria === $scope.categoriaNominaId) {
                            bandera = 1;
                            break;
                        }
                    }

                    if (bandera === 0) {
                        clasificacategoriasconductualesService.add(Registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $uibModalInstance.dismiss('cancel');
                               $scope.cargarregistros($scope.familiaseleccionada)
                               $scope.mensajeDeResultadoCarga($scope.mse);
                           },
                           function (err) {
                               console.error(err);
                               $uibModalInstance.dismiss('cancel');

                               toastr.error("Error al guardar la clasificación seleccionada, debido a que no selecciono la categoría de competencias conductuales correspondiente a la categoría de nómina seleccionado");
                               $scope.mensajeDeResul

                           }
                        );
                    } else {
                        toastr.error("La categoría de empleado que ha seleccionado ya tiene asignadas sus categorias de evaluación de competencias conductuales");
                    }
                }
            }
        }



    }
})();