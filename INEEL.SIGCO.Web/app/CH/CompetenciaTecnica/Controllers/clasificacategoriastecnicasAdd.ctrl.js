/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("clasificacategoriastecnicasCtrlAdd", ['$location', '$scope', 'clasificacategoriastecnicasService', 'periodoevaluacionService',
            'nivelcompetenciatecnicaService',
            'globalGet', '$state',
            '$stateParams', "$uibModalInstance",
            "DTOptionsBuilder" , clasificacategoriastecnicasCtrlAdd]);

    function clasificacategoriastecnicasCtrlAdd($location, $scope, clasificacategoriastecnicasService, periodoevaluacionService,
        nivelcompetenciatecnicaService,
        globalGet, $state, $stateParams, $uibModalInstance, DTOptionsBuilder) {

       
        periodoevaluacionService.getById($scope.periodoId).then(
          function (result) {
              $scope.periodoEv = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );


        var parametros1 = {
            "idNivel": $scope.periodoId,
            "idCategoria": $scope.areaId
        };

        nivelcompetenciatecnicaService.getByPeriodoAndArea(parametros1).then(
            function (result) {
                $scope.niveles = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los niveles de competencia registrados en el sistema");
            }
        );
         
        clasificacategoriastecnicasService.getCategorias().then(
           function (result) {
               $scope.nomina = result.data;
               $scope.loading = false;
           },
           function (err) {
               toastr.error("No hay unidades registradas en el período seleccionado");
           }
        );

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
                  
            for (var i = 0; i < $scope.niveles.length; i++) {
                if ($scope.niveles[i].nivelCompetenciaId === $scope.nivelId) {
                    descripcionNivelTecnico = $scope.niveles[i].descripcion;
                }
            }

            var Registro = {
                    "claveCategoria": $scope.categoriaNominaId,
                    "categoriaEmpleado": descripcionNomina,
                    "periodoId": $scope.periodoEv.periodoEvaluaionId,
                    "nivelId": $scope.nivelId,
                    "areaId": $scope.areaId,                 
                    "estado": 1
            }

            var bandera = 0;

            for (var i = 0; i < $scope.categorias.length; i++) {

                if ($scope.categorias[i].claveCategoria === $scope.categoriaNominaId && $scope.categorias[i].niveltecnica.nivelCompetenciaId === $scope.nivelId) {
                    bandera = 1;
                    break;
                }
            }

            if (bandera === 0) {
                clasificacategoriastecnicasService.add(Registro).then(
                   function (result) {
                       toastr.success(result.data);
                       $uibModalInstance.dismiss('cancel');
                       $scope.cargarregistros($scope.periodoId, $scope.areaId)
                       $scope.mensajeDeResultadoCarga($scope.mse);
                   },
                   function (err) {
                       console.error(err);
                       $uibModalInstance.dismiss('cancel');
                       $scope.mensajeDeResul
                   }
                );
            } else {
                toastr.error("La categoría de empleado que ha seleccionado ya tiene asignadas sus categorias de evaluación de competencias técnicas");
            }
           
            
        }



    }
})();