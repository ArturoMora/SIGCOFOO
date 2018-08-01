/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiapuestosCtrlGet", ['$scope', 'familiapuestosService', 'periodoevaluacionService', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", '$stateParams',  familiapuestosCtrlGet]);

    function familiapuestosCtrlGet($scope, familiapuestosService, periodoevaluacionService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $stateParams) {
      
        var id = $stateParams.id;
        $scope.id = $stateParams.id;
        $scope.HaSeleccionadoPeriodo = 0;

        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;


        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodos = result.data;
              $scope.periodoId = parseInt($scope.id);
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        
        var x = parseInt($stateParams.id)
        if (x > 0) {                 
            familiapuestosService.getByPeriodo($stateParams.id).then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        debugger;
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
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                    $scope.HaSeleccionadoPeriodo = 0;
                    $scope.registro = null;
                }
            );
        } else {
            $scope.HaSeleccionadoPeriodo = 0;
            $scope.registro = null;
        }
        
        $scope.cargarFamilias = function () {
           
            var x = parseInt($scope.periodoId)
            if (x > 0) {

                familiapuestosService.getByPeriodo($scope.periodoId).then(
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
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                        $scope.registro = null;
                        $scope.HaSeleccionadoPeriodo = 0;
                    }
                );
            } else {
                $scope.registro = null;
                $scope.HaSeleccionadoPeriodo = 0;
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

            debugger;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "familiaId": id,
                            "estado": _estado
                        };
                        familiapuestosService.updateEstado(registro);
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
                            if ($scope.registro[i].familiaId == id) {
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