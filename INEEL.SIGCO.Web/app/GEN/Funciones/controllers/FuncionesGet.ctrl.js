/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("FuncionesGetCtrl", ['$location', '$scope', 'funcionesService', 'ModulosService', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", FuncionesGetCtrl]);

    function FuncionesGetCtrl($location, $scope, funcionesService, ModulosService, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        $scope.moduloid = $stateParams.id;
        $scope.moduloSeleccionado = 0;
      
        if ($scope.moduloid === "" || $scope.moduloid === undefined) {
            $scope.moduloid = "";
        } else {
            $scope.moduloSeleccionado = 1;
            funcionesService.getFunByModulo($scope.moduloid).then(
             function (result) {
                 for (var i = 0; i < result.data.length; i++) {
                     if (result.data[i].estado == "1") {
                         result.data[i].estado = true;
                     } else {
                         result.data[i].estado = false;
                     }
                 }
                 $scope.funcionescargadas = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No se han podido cargar las funciones del sistema");
             }
           );
        }
              
    
        ModulosService.getAll().then(
           function (result) {
               $scope.modulos = result.data;
           },
           function (err) {
               console.error(err);
           }
        );

       
        $scope.cargarfunciones = function () {
            $scope.moduloSeleccionado = 1;
            funcionesService.getFunByModulo($scope.moduloid).then(
                  function (result) {
                      for (var i = 0; i < result.data.length; i++) {
                          if (result.data[i].estado == "1") {
                              result.data[i].estado = true;
                          } else {
                              result.data[i].estado = false;
                          }
                      }
                      $scope.funcionescargadas = result.data;
                      $scope.loading = false;
                  },
                  function (err) {
                      toastr.error("No se han podido cargar las funciones del sistema");
                  }
                );
        }

        //Guardar estado
        $scope.saveEstado = function (id, estado, descripcion) {
                $scope.descripcionRow = descripcion;

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
                            registro = {
                                "funcionesId": id,
                                "estado": _estado
                            };
                            
                            funcionesService.UpdateEstado(registro);
                            $uibModalInstance.dismiss('cancel');
                                                     
                        };

                        $scope.cancel = function () {
                                                       
                            if (estado == true) {
                                estado = false;
                            } else {
                                estado = true;
                            }
                            for (var i = 0; i < $scope.funcionescargadas.length; i++) {
                                if ($scope.funcionescargadas[i].funcionesId == id) {
                                    $scope.funcionescargadas[i].estado = estado;
                                }
                            }
                                                      
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });
        }

       
       

    }

})();