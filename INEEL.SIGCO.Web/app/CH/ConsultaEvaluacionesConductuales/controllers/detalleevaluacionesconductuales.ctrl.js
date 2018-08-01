/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("detalleevaluacionesconductualesCtrlGet", ['$rootScope', '$scope', 'detalleevaluacionconductualService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', detalleevaluacionesconductualesCtrlGet]);

    function detalleevaluacionesconductualesCtrlGet($rootScope, $scope, detalleevaluacionconductualService, evaluacionconductualService, globalGet, $state, $stateParams) {
        var id = $stateParams.id;

        $scope.nombreUnidad = {};
        $scope.periodo = "";
           

        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {
                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;

                $scope.clave = $rootScope.parametros.clave;
                $scope.nombre = $rootScope.parametros.nombre;

                $scope.cateemp = $rootScope.parametros.cateemp;
                $scope.catcomp = $rootScope.parametros.catcomp;
                $scope.calificacion = $rootScope.parametros.calificacion;
                $scope.evaluacionid = $rootScope.parametros.evaluacionid;
                $scope.claveCateNom = $rootScope.parametros.idcategoriacompetencia;
                $scope.categoriaem = $rootScope.parametros.categoriaem;
                $scope.nombreFamilia = $rootScope.parametros.nombreFamilia;
               
                detalleevaluacionconductualService.getByClaveEvaluacion($scope.evaluacionid).then(
                    function (result) {
                        $scope.competenciasaevaluar = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                    }
                );

                evaluacionconductualService.getById(id).then(
                   function (result) {
                       $scope.datosevaluado = result.data;
                   },
                   function (err) {
                       toastr.error("No se han podido cargar la información registrada en el sistema");
                   }
                );

            }


       


    }

})();