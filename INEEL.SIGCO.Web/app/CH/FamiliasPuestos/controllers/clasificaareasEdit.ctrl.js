(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("clasificaareasCtrlEdit", ['$rootScope', '$scope', 'clasificaareasService', 'periodoevaluacionService', 'tipoareaService', 'globalGet', '$state', '$stateParams', clasificaareasCtrlEdit]);

    function clasificaareasCtrlEdit($rootScope, $scope, clasificaareasService, periodoevaluacionService, tipoareaService, globalGet, $state, $stateParams) {

      
        periodoevaluacionService.getAll().then(
           function (result) {
               $scope.periodos = result.data;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );

        tipoareaService.getAll().then(
            function (result) {
                $scope.areastipo = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );

        /*
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
        */

    }

})();