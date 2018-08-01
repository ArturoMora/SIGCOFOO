(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("clasificaareasCtrlAdd", ['$rootScope', '$scope', 'periodoevaluacionService', 'clasificaareasService', 'tipoareaService', 'globalGet', '$state', '$stateParams', "$uibModal", clasificaareasCtrlAdd]);

    function clasificaareasCtrlAdd($rootScope, $scope, periodoevaluacionService, clasificaareasService, tipoareaService, globalGet, $state, $stateParams, $uibModal) {
        var id = $stateParams.id;

        $scope.nombreUnidad = {};
        
        periodoevaluacionService.getById(id).then(
          function (result) {
              $scope.periodoEv = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );
                 
        tipoareaService.getAll().then(
            function (result) {
                $scope.areastipo = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );

        clasificaareasService.getByPeriodo($stateParams.id).then(
           function (result) {
               $scope.unidades = result.data;
               $scope.loading = false;
           },
           function (err) {
               toastr.error("No hay unidades registradas en el período seleccionado");
           }
        );

        //ELIMINAR UNIDADES 
        $scope.eliminaunidad = function (id) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.unidades.length; i++) {
                            if ($scope.unidades[i].id == id) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.unidades.splice($scope.indiceAEliminar, 1);

                        clasificaareasService.delete(id);
                        $uibModalInstance.dismiss('cancel');

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }// FIN DE FUNCION QUE ELIMINA UNIDAD 

        $scope.$watch('nombreUnidad', function () {
            $scope.save();
        });

        $scope.save = function () {

            var Registro = {
                "area": $scope.nombreUnidad.claveUnidad,
                "nombreArea": $scope.nombreUnidad.nombreUnidad,
                "periodoId": id,
                "tipoAreaId": $scope.tipoAreaId,
                "estado": 1
            }

            $scope.unidadYaRegistrada = 0;

            if ($scope.unidades.length > 0) {

                for (var i = 0; i < $scope.unidades.length; i++) {
                    if ($scope.unidades[i].unidad == $scope.nombreUnidad.claveUnidad) {
                        $scope.unidadYaRegistrada = 1;
                        break;
                    }
                }
            }

            if ($scope.unidadYaRegistrada == 0) {
                clasificaareasService.add(Registro).then(
                       function (result) {
                           toastr.success(result.data);

                           clasificaareasService.getByPeriodo($stateParams.id).then(
                                 function (result) {
                                     $scope.unidades = result.data;
                                     $scope.loading = false;
                                 },
                                 function (err) {
                                     toastr.error("No hay áreas registradas");
                                 }
                           );

                       },
                       function (err) {
                           console.error(err);
                       }
                );
            } else {
                toastr.error("El área seleccionada ya ha sido registrada");
            }
        }


    }

})();