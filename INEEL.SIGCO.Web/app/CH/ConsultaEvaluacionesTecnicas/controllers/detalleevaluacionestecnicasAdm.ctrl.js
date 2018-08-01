/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("detalleevaluacionestecnicasAdmCtrlGet", ['$rootScope', '$scope', 'detalletecnicaService', 'globalGet', '$state', '$stateParams', detalleevaluacionestecnicasAdmCtrlGet]);

    function detalleevaluacionestecnicasAdmCtrlGet($rootScope, $scope, detalletecnicaService, globalGet, $state, $stateParams) {
        
        $scope.nombreUnidad = {};
       

        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.periodo      = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;

                $scope.clave =        $rootScope.parametros.clave;
                $scope.nombre =       $rootScope.parametros.nombre;
                $scope.nivel =        $rootScope.parametros.nivel;
                $scope.calificacion = $rootScope.parametros.calificacion;
                $scope.brecha = $rootScope.parametros.brecha;
                $scope.nomina = $rootScope.parametros.nomina;
               
              
                var parametros = {
                    'periodo': $scope.periodo,
                    'claveEmpleado': $scope.clave
                }

                detalletecnicaService.getByEmpleado(parametros).then(
                    function (result) {
                        $scope.registro = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                    }
                );

            }


       


    }

})();