/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("calificacioncompetenciasCtrlGet", ['$scope', 'calificacioncompetenciasService',  "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", '$stateParams', calificacioncompetenciasCtrlGet]);
                        
    function calificacioncompetenciasCtrlGet($scope, calificacioncompetenciasService,  $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $stateParams) {
       
       $scope.dtInstance = {};
       //Variables de carga
       $scope.loading = true;
                   
       calificacioncompetenciasService.getAll().then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].estado == "1") {
                            result.data[i].estado = true;
                        } else {
                            result.data[i].estado = false;
                        }
                    }

                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
       );
       

       
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
                            "calificacionId": id,
                            "estado": _estado
                        };
                        calificacioncompetenciasService.updateEstado(registro);
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
                            if ($scope.registro[i].calificacionId == id) {
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