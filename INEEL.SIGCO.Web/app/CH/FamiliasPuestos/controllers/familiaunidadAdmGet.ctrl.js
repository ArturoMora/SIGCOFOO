
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiaunidadadmCtrlGet", ['$rootScope', '$scope', 'unidadfamiliaService', 'periodoevaluacionService', 'familiapuestosService', 'globalGet', '$state', '$stateParams', familiaunidadadmCtrlGet]);

    function familiaunidadadmCtrlGet($rootScope, $scope, unidadfamiliaService, periodoevaluacionService, familiapuestosService, globalGet, $state, $stateParams) {
               

        $scope.nombreUnidad = {};
        $scope.nombreUnidadRegreso = "";
        

        if (typeof $rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined") {
        } else {
            if ($rootScope.parametros.periodo == null || typeof $rootScope.parametros.periodo == 'undefined' || $rootScope.parametros.periodo == undefined || $rootScope.parametros.periodo == "undefined") {
            }else{ 

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;
                $scope.nombreUnidadRegreso = $scope.nombreUnidad.nombreUnidad;

                var parametros = {
                    "periodo": $scope.periodo,
                    "claveUnidad": $scope.nombreUnidad.claveUnidad
                }

                unidadfamiliaService.getByUnidad(parametros).then(
                    function (result) {

                        $scope.registro = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema para el periodo seleccionado");
                    }
                );
            }
        }
        
        periodoevaluacionService.getAll().then(
           function (result) {
               $scope.periodos = result.data;            
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );
     
        $scope.cargarFamilias = function () {

            var parametros = {
                "periodo": $scope.periodo,
                "claveUnidad": $scope.nombreUnidad.claveUnidad
            }
                          
            unidadfamiliaService.getByUnidad(parametros).then(
                function (result) {
                   
                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema para el periodo seleccionado");
                }
            );
        }

        $scope.$watch('nombreUnidad', function () {
            if ($scope.nombreUnidadRegreso == "") {
                $scope.cargarFamilias();
            } else {

                if ($scope.nombreUnidadRegreso != $scope.nombreUnidad.nombreUnidad) {
                    $scope.cargarFamilias();
                }
            }
        });

        $rootScope.parametros = {};
        $scope.nose = function () {
            $rootScope.parametros.unidad = $scope.nombreUnidad;
            $rootScope.parametros.periodo = $scope.periodo; 
        }
        

    }
})();