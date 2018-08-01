
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiaunidadCtrlGet", ['$rootScope', '$scope', 'unidadfamiliaService', 'periodoevaluacionService', 'familiapuestosService', 'globalGet', '$state', '$stateParams', familiaunidadCtrlGet]);

    function familiaunidadCtrlGet($rootScope, $scope, unidadfamiliaService, periodoevaluacionService, familiapuestosService, globalGet, $state, $stateParams) {
               

        $scope.nombreUnidad = {};
        $scope.nombreUnidadRegreso = "";


        $scope.muestraDatos = 0;
        

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
                        $scope.muestraDatos = 1;
                        $scope.registro = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        $scope.muestraDatos = 0;
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
                 
            if ($scope.periodo == 'undefined' || $scope.periodo == undefined || $scope.periodo == null || $scope.periodo == "undefined" || $scope.periodo == "") {
            } else {

                if ($scope.nombreUnidad.claveUnidad == 'undefined' || $scope.nombreUnidad.claveUnidad == undefined || $scope.nombreUnidad.claveUnidad == null || $scope.nombreUnidad.claveUnidad == "undefined" || $scope.nombreUnidad.claveUnidad == "") {

                } else {
                    $scope.muestraDatos = 1;

                    unidadfamiliaService.getByUnidad(parametros).then(
                        function (result) {
                            $scope.muestraListado = 1;
                            $scope.registro = result.data;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las familias de puestos registrados en el sistema para el periodo seleccionado");
                        }
                    );

                }
            }

        }





        $scope.$watch('nombreUnidad', function () {
            $scope.muestraListado = 1;
            
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