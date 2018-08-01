/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("nivelcompetenciatecnicaCtrlGet", ['$scope', 'nivelcompetenciatecnicaService', 'periodoevaluacionService', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", '$stateParams', nivelcompetenciatecnicaCtrlGet]);

    function nivelcompetenciatecnicaCtrlGet($scope, nivelcompetenciatecnicaService, periodoevaluacionService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $stateParams) {
       
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
       

        $scope.HaSeleccionadoPeriodo = 0;
      
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


        var x = parseInt($stateParams.id)
        if (x > 0) {
           
            nivelcompetenciatecnicaService.getByPeriodo($stateParams.id).then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].estado == "1") {
                            result.data[i].estado = true;
                        } else {
                            result.data[i].estado = false;
                        }

                        var val1 = convierteNumAletra(result.data[i].categoraMax);
                        result.data[i].categoraMax = val1;

                        var val2 = convierteNumAletra(result.data[i].categoriaMin);
                        result.data[i].categoriaMin = val2;

                    }

                    $scope.registro = result.data;
                    $scope.loading = false;
                    $scope.HaSeleccionadoPeriodo = 1;
                },
                function (err) {
                    toastr.error("No se han podido cargar los niveles de competencias técnicas");
                    $scope.HaSeleccionadoPeriodo = 0;
                    $scope.registro = null;
                }
            );
        }

        function convierteNumAletra(val) {
            
            switch(parseInt(val)) {
                case 1:
                    return "A";
                    break;
                case 2:
                    return "B";
                    break;
                case 3:
                    return "C";
                    break;
                case 4:
                    return "D";
                    break;
                case 5:
                    return "E";
                    break;
                case 6:
                    return "F";
                    break;
                case 7:
                    return "G";
                    break;
                case 8:
                    return "H";
                    break;
                case 9:
                    return "I";
                    break;
                case 10:
                    return "J";
                    break;
                case 11:
                    return "K";
                    break;
                case 12:
                    return  "L";
                    break;
                case 13:
                    return "M";
                    break;
                case 14:
                    return "N";
                    break;
                case 15:
                    return "O";
                    break;
                case 16:
                    return "P";
                    break;
                case 17:
                    return "Q";
                    break;
                case 18:
                    return "R";
                    break;
                case 19:
                    return "S";
                    break;
                case 20:
                    return "T";
                    break;
                case 21:
                    return "U"
                    break;
                case 22:
                    return  "V"
                    break;
                case 23:
                    return "W"
                    break;
                case 24:
                    return "X"
                    break;
                case 25:
                    return "Y"
                    break;
                case 26:
                    return "Z"
                    break;
                default:
                    break;
            }
       }


        $scope.cargarNiveles = function () {

           

            var x = parseInt($scope.periodoId);

            if (x > 0) {

                nivelcompetenciatecnicaService.getByPeriodo($scope.periodoId).then(
                    function (result) {
                        for (var i = 0; i < result.data.length; i++) {
                            if (result.data[i].estado == "1") {
                                result.data[i].estado = true;
                            } else {
                                result.data[i].estado = false;
                            }

                            var val1 = convierteNumAletra(result.data[i].categoraMax);
                            result.data[i].categoraMax = val1;

                            var val2 = convierteNumAletra(result.data[i].categoriaMin);
                            result.data[i].categoriaMin = val2;


                        }

                        $scope.registro = result.data;
                        $scope.loading = false;

                        $scope.HaSeleccionadoPeriodo = 1;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los niveles de competencias técnicas registrados en el sistema");
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
                            "nivelCompetenciaId": id,
                            "estado": _estado
                        };
                        nivelcompetenciatecnicaService.updateEstado(registro);
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
                            if ($scope.registro[i].nivelCompetenciaId == id) {
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