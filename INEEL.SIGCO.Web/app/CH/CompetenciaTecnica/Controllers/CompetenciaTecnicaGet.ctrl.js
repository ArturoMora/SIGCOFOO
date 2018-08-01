/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("competenciatecnicaCtrlGet", ['$scope', 'competenciatecnicaService', 'periodoevaluacionService', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", '$stateParams', competenciatecnicaCtrlGet]);

    function competenciatecnicaCtrlGet($scope, competenciatecnicaService, periodoevaluacionService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $stateParams) {
       
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;

        $scope.HaSeleccionadoPeriodo = 0;

        $scope.nada = 0;

        var id = $stateParams.id;
        $scope.id = $stateParams.id;

        periodoevaluacionService.getAllTecnicas().then(
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
          
            var idPeriodoSeleccionadoUsr = parseInt($stateParams.id);

            if (idPeriodoSeleccionadoUsr > 0) {

               
                competenciatecnicaService.getByPeriodo($stateParams.id).then(
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

                        $scope.HaSeleccionadoPeriodo = 1;
                        
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las competencias técnicas registrados en el sistema");
                        $scope.registro = null;
                        $scope.HaSeleccionadoPeriodo = 0;
                    }
                );
            } else {
                $scope.registro = null;
              
                $scope.HaSeleccionadoPeriodo = 0;
            }



        } else {
            $scope.HaSeleccionadoPeriodo = 0;
            $scope.registro = null;
        }



        $scope.cargarCompetencias = function () {
          

            var idPeriodoSeleccionadoUsr = parseInt($scope.periodoId);

            if (idPeriodoSeleccionadoUsr > 0) {
              
                competenciatecnicaService.getByPeriodo($scope.periodoId).then(
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
                        $scope.HaSeleccionadoPeriodo = 1;
                       
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las competencias técnicas registrados en el sistema");
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
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "competenciaId": id,
                            "estado": _estado
                        };
                        competenciatecnicaService.updateEstado(registro);
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