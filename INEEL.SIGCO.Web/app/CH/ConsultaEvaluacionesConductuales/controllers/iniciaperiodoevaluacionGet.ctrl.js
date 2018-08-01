/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("iniciaperiodoevaluacionCtrlGet", ['$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', iniciaperiodoevaluacionCtrlGet]);

    function iniciaperiodoevaluacionCtrlGet($scope, periodoevaluacionService, evaluacionconductualService, globalGet, $state, $stateParams) {
      
        $scope.nuevo = 0;
        $scope.InterfazNuevoPeriodo = 0;
        $scope.InterfazPeriodoRegistrado = 0;

        $scope.CerrarEvaluacion = 0;
        $scope.MigrarDatos = 0;
        $scope.ReporteAvance = 0;
        $scope.ReactivarEvaluacion = 0;
        $scope.EliminarImportacion = 0;

        var anio = "";
        
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEV = result.data;
              $scope.periodosEV.push({ periodoEvaluaionId:-1, periodo: 'Agregar', estado:1 });
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );

        $scope.nuevoPeriodo = function () {
            
            var today = new Date();
            var yyyy = today.getFullYear();
                      

            debugger;
            if ($scope.periodo === "Agregar") {
                $scope.nuevo = 1;
                $scope.InterfazPeriodoRegistrado = 0;
                $scope.InterfazNuevoPeriodo = 0;
            }else{ 
            if (parseInt($scope.periodo) === parseInt(yyyy)) {
                $scope.InterfazNuevoPeriodo = 1;
                $scope.nuevo = 0;

                for (var i = 0; i < $scope.periodosEV.length; i++) {
                    if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {

                        if ($scope.periodosEV[i].personalMigrado === 0) {
                            $scope.MigrarDatos = 1;
                            $scope.EliminarImportacion = 0;
                        } else {
                            $scope.MigrarDatos = 0;
                            $scope.EliminarImportacion = 1;
                        }

                        if ($scope.periodosEV[i].evaluacionFinalizada === 1) {

                            $scope.ReporteAvance = 1;
                            $scope.CerrarEvaluacion = 0;
                            $scope.ReactivarEvaluacion = 1;
                        } else {
                            $scope.ReporteAvance = 0;
                            $scope.CerrarEvaluacion = 0;
                            $scope.ReactivarEvaluacion = 0;
                        }

                        break;
                    }
                }

                            
            } else {

                $scope.nuevo = 0;
                if (parseInt($scope.periodo) < parseInt(yyyy)) {
                    $scope.InterfazPeriodoRegistrado = 1;

                    for (var i = 0; i < $scope.periodosEV.length  ; i++) {
                        if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {

                            if ($scope.periodosEV[i].personalMigrado === 0) {
                                $scope.MigrarDatos = 1;
                            } else {
                                $scope.MigrarDatos = 0;
                            }

                            if ($scope.periodosEV[i].evaluacionFinalizada === 1) {

                                $scope.ReporteAvance = 1;
                                $scope.CerrarEvaluacion = 0;
                                $scope.ReactivarEvaluacion = 1;
                            } else {
                                $scope.ReporteAvance = 0;
                                $scope.CerrarEvaluacion = 0;
                                $scope.ReactivarEvaluacion = 0;
                            }

                            break;
                        }
                    }
                  }
                }
            }
        }
        

        $scope.mostrarReportes = function () {

        }

        $scope.reactivarEvaluacion = function () {

            for (var i = 0; i < $scope.periodosEV.length; i++) {
                if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {
                    $scope.periodosEV[i].evaluacionFinalizada = 0;
                    $scope.MigrarDatos = 0;
                    $scope.EliminarImportacion = 1;
                    $scope.ReporteAvance = 1;
                    $scope.CerrarEvaluacion = 1;
                    $scope.ReactivarEvaluacion = 0;
                    break;
                }
            }
        }

        $scope.eliminar = function () {
            for (var i = 0; i < $scope.periodosEV.length; i++) {
                if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {
                    $scope.periodosEV[i].personalMigrado = 0;
                    $scope.periodosEV[i].evaluacionFinalizada = 0;
                    $scope.MigrarDatos = 1;
                    $scope.EliminarImportacion = 0;
                    $scope.ReporteAvance = 0;
                    $scope.CerrarEvaluacion = 0;
                    $scope.ReactivarEvaluacion = 0;
                    break;
                }
            }
        }

        $scope.finalizarEvaluacion = function(){
        
            for (var i = 0; i < $scope.periodosEV.length; i++) {
                if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {
                    $scope.periodosEV[i].personalMigrado = 1;
                    $scope.periodosEV[i].evaluacionFinalizada = 1;
                    $scope.MigrarDatos = 0;
                    $scope.EliminarImportacion = 1;
                    $scope.ReporteAvance = 1;
                    $scope.CerrarEvaluacion = 0;
                    $scope.ReactivarEvaluacion = 1;                    
                    break;
                }
            }

        }

        $scope.cargarEmpleados = function () {

            for (var i = 0; i < $scope.periodosEV.length; i++) {
                if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.periodo)) {
                    $scope.periodosEV[i].personalMigrado = 1;
                    $scope.periodosEV[i].evaluacionFinalizada = 0;

                    $scope.MigrarDatos = 0;
                    $scope.EliminarImportacion = 1;
                    $scope.ReporteAvance = 1;
                    $scope.CerrarEvaluacion = 1;
                    $scope.ReactivarEvaluacion = 0;
                    
                    break;
                }
            }


            /*
            evaluacionconductualService.cargarEmpleadosPeriodo($scope.periodo).then(
                    function (result) {
                        $scope.registro = result.data;
                    },
                    function (err) {
                        toastr.error("No se actualizaron las competencias para el presente periodo");
                    }
            );
            */
        }
              
        $scope.save = function () {

            var bandera = "0";

            var today = new Date();
            var yyyy = today.getFullYear();

            if (parseInt($scope.registro.periodo) <= parseInt(yyyy)) {

                for (var i = 0; i < $scope.periodosEV.length  ; i++) {
                    if (parseInt($scope.periodosEV[i].periodo) === parseInt($scope.registro.periodo)) {
                        bandera = "1";
                        break;
                    }
                }

                if (bandera === "0") {
                    if ($scope.PeriodoEvaluacionForm.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        var Registro = {
                            "Periodo": $scope.registro.periodo,
                            "evaluacionFinalizada": 0,
                            "personalMigrado" : 0,
                            "estado": 1
                        }

                        anio = $scope.registro.periodo;
                        periodoevaluacionService.Add(Registro).then(
                               function (result) {
                                   toastr.success(result.data);

                                   /*
                                   periodoevaluacionService.getAll().then(
                                       function (result) {
                                           $scope.periodosEV = result.data;
                                           $scope.periodo = parseInt(anio);
                                           $scope.periodosEV.push({ periodoEvaluaionId: -1, periodo: 'Agregar', estado: 1 });
                                       },
                                       function (err) {
                                       }    
                                   );    
                                   */
                                   
                               
                                   $scope.periodosEV.push({ periodoEvaluaionId: -1, periodo: anio, estado: 1, evaluacionFinalizada: 0, personalMigrado: 0 });
                                 
                                  
                                  
                                   $scope.periodo = anio;

                                   $scope.nuevoPeriodo();
                               },
                               function (err) {
                                   console.error(err);
                               }
                        );
                    }
                } else {
                    toastr.error("El período a ingresar ya fue registrado previamente");
                }
            } else {
                toastr.error("El período a ingresar no debe ser mayor al actual");
            }
        }
  

    }
})();