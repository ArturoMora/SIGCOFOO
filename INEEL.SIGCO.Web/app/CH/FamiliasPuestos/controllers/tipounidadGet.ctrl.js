(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipounidadCtrlGet", ['$rootScope', '$scope', 'unidadfamiliaService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', tipounidadCtrlGet]);

    function tipounidadCtrlGet($rootScope, $scope, unidadfamiliaService, periodoevaluacionService, globalGet, $state, $stateParams) {

        $scope.id;


        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {
                $scope.id = $rootScope.parametros.periodo;

                unidadfamiliaService.getByPeriodo($scope.id).then(
                    function (result) {

                        $scope.registro = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema para el periodo seleccionado");
                    }
                );
            }

        

        periodoevaluacionService.getAll().then(
           function (result) {
               $scope.periodos = result.data;
               $scope.periodo = $scope.id;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );

        $scope.cargarUnidades = function () {        
            unidadfamiliaService.getByPeriodo($scope.periodo).then(
                function (result) {

                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema para el periodo seleccionado");
                }
            );
        }


        $rootScope.parametros = {};
        $scope.parametrosfun = function (id, periodo, nombre, clave, puesto) {
            $rootScope.parametros.unidadfamiliaid = id;
            $rootScope.parametros.periodo = periodo;
            $rootScope.parametros.unidad = nombre;
            $rootScope.parametros.clave = clave;
            $rootScope.parametros.puesto = puesto;
          
          
            debugger;
          
        }


    }

})();