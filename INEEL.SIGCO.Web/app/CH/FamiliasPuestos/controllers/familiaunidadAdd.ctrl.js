
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiaunidadCtrlAdd",[ '$scope', 'familiapuestosService', 'unidadfamiliaService', 'globalGet', '$state', '$stateParams', "$uibModal", familiaunidadCtrlAdd]);

    function familiaunidadCtrlAdd($scope, familiapuestosService, unidadfamiliaService, globalGet, $state, $stateParams, $uibModal) {
        var id = $stateParams.id;
        
        $scope.nombreUnidad = {};
                
        //Obtene ambito
        familiapuestosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }
        );
       
        unidadfamiliaService.getByFamilia($stateParams.id).then(
             function (result) {
                 $scope.unidades = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No hay unidades asignadas a la familia de puestos");
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
                            if ($scope.unidades[i].familiaUnidadId == id) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.unidades.splice($scope.indiceAEliminar, 1);

                        unidadfamiliaService.delete(id);
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
                "unidad": $scope.nombreUnidad.claveUnidad,
                "nomUnidad": $scope.nombreUnidad.nombreUnidad,
                "familiaPuestosId": id,
                "periodo": $scope.registro.periodo.periodo,
                "tipoAreaId" : null,
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
                unidadfamiliaService.add(Registro).then(
                       function (result) {
                           toastr.success(result.data);

                           unidadfamiliaService.getByFamilia($stateParams.id).then(
                                 function (result) {
                                     $scope.unidades = result.data;
                                     $scope.loading = false;
                                 },
                                 function (err) {
                                     toastr.error("No hay unidades asignadas a la familia de puestos");
                                 }
                           );
                                                      
                       },
                       function (err) {
                           console.error(err);
                       }
                );
            } else {
                toastr.error("La unidad ya ha sido asignada a esta familia de puestos");
            }
        }

    }

})();