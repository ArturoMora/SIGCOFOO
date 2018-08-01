/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("clasificacategoriasconductualesCtrlAdd", ['$location', '$scope', 'clasificacategoriasconductualesService', 'periodoevaluacionService',
            'familiacategoriasService', 'familiapuestosService',
            'globalGet', '$state',
            '$stateParams', "$uibModalInstance",
            "DTOptionsBuilder", clasificacategoriasconductualesCtrlAdd]);

    function clasificacategoriasconductualesCtrlAdd($location, $scope, clasificacategoriasconductualesService, periodoevaluacionService,
        familiacategoriasService,familiapuestosService,
        globalGet, $state, $stateParams, $uibModalInstance, DTOptionsBuilder) {

         periodoevaluacionService.getById($scope.periodoId).then(
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


        familiapuestosService.getByPeriodo($scope.periodoId).then(
            function (result) {
                $scope.familiasPuestosServicios = result.data;
                $scope.familiasPuestosTecnicas = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
            }
        );


        $scope.cargaCategoriasServicio = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaIdServicio).then(
              function (result) {
                 $scope.categoriasFamiliasServicio = result.data;
                 $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar las categorias de la familia de puestos registrados en el sistema");
              }
            );
        }

        $scope.cargaCategoriasTecnicas = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaIdTecnica).then(
              function (result) {
                  $scope.categoriasFamiliasTecnicas = result.data;
                  $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar las categorias de la familia de puestos registrados en el sistema");
              }
            );
        }

        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.save = function () {
            var descripcionNomina = "";
            var descripcionNivelTecnico = "";
            var descripcionNivelServicio = "";
                     
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


            for (var i = 0; i < $scope.categoriasFamiliasServicio.length; i++) {
                if ($scope.categoriasFamiliasServicio[i].categoriaId === $scope.categoriaIdServicio) {
                    descripcionNivelServicio = $scope.categoriasFamiliasServicio[i].descripcion;
                }
            }

            var Registro = {
                    "claveCategoria": $scope.categoriaNominaId,
                    "categoriaEmpleado": descripcionNomina,
                    "periodoId": $scope.periodoEv.periodoEvaluaionId,
                    "categoriaCompetencia": $scope.categoriaIdTecnica,
                    "categoriaServicio": $scope.categoriaIdServicio,
                    "nombreCategoriaServicio": descripcionNivelServicio,                
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
                       $scope.cargarregistros($scope.periodoId)
                       $scope.mensajeDeResultadoCarga($scope.mse);
                   },
                   function (err) {
                       console.error(err);
                       $uibModalInstance.dismiss('cancel');
                       $scope.mensajeDeResul
                   }
                );
            } else {
                toastr.error("La categoría de empleado que ha seleccionado ya tiene asignadas sus categorias de evaluacuón de competencias técnicas");
            }
           
            
        }



    }
})();