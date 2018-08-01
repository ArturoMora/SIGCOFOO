/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciasCtrlGet", ['$scope', 'competenciasService', 'periodoevaluacionService', "$uibModal", '$stateParams', '$state', competenciasCtrlGet]);
                        
    function competenciasCtrlGet($scope, competenciasService, periodoevaluacionService, $uibModal, $stateParams, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };

        //Variables de carga
        $scope.loading = true;

        $scope.HaSeleccionadoPeriodo = 0;
       
        var id = $stateParams.id;
        $scope.id = $stateParams.id;
      
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;
              $scope.periodoId = parseInt($scope.id);
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );
               
        var x = parseInt($scope.id)

        if (x > 0) {                    
            competenciasService.getByPeriodo($stateParams.id).then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].estado == "1") {
                            result.data[i].estado = true;
                        } else {
                            result.data[i].estado = false;
                        }
                    }
                    $scope.HaSeleccionadoPeriodo = 1;

                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    $scope.HaSeleccionadoPeriodo = 0;
                    $scope.registro = null;
                    toastr.error("No se han podido cargar las competencias registradas en el sistema");
                }
            );
        } else {
            $scope.necesitaPeriodo = 1;
        }


        $scope.irAcomportamiento = function (idreg) {
            debugger;
            $state.go("competenciascomportamientoGet", { id: idreg });
        }

        $scope.cargarCompetencias = function () {
           var tempId = parseInt($scope.periodoId);
                                    
            if (tempId > 0) {
              
                competenciasService.getByPeriodo($scope.periodoId).then(
                    function (result) {
                        for (var i = 0; i < result.data.length; i++) {
                            if (result.data[i].estado == "1") {
                                result.data[i].estado = true;
                            } else {
                                result.data[i].estado = false;
                            }
                        }

                        $scope.HaSeleccionadoPeriodo = 1;

                        $scope.registro = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        $scope.HaSeleccionadoPeriodo = 0;
                        $scope.registro = null;
                        toastr.error("No se han podido cargar las competencias registradas en el sistema");
                    }
                );
            } else {
                $scope.HaSeleccionadoPeriodo = 0;
                $scope.registro = null;
            }
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
                        registro = {
                            "competenciaId": id,
                            "estado": _estado
                        };
                        competenciasService.updateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registro.length; i++) {
                            if ($scope.registro[i].competenciaId == id) {
                                $scope.registro[i].estado = estado;
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