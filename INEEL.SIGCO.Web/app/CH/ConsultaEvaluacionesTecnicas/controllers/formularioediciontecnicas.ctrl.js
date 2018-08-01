/*AYUDA:
FooEntitiesService nombre de factory en formularioediciontecnica.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formularioediciontecnicasCtrlGet", ['$rootScope', '$scope', 'periodoevaluacionService', 'evaluaciontecnicaService', 'tipoareaService', 'nivelcompetenciatecnicaService', 'globalGet', '$state', '$stateParams', formularioediciontecnicasCtrlGet]);

    function formularioediciontecnicasCtrlGet($rootScope, $scope, periodoevaluacionService, evaluaciontecnicaService, tipoareaService, nivelcompetenciatecnicaService, globalGet, $state, $stateParams) {
        var id = $stateParams.id;

        $scope.areaId = "";
        $scope.nivelId = "";
        $scope.nombreUnidad = {};
        $scope.nuevaUnidad = {};
        $scope.loading = true;

        if (typeof $rootScope.parametros !== 'undefined') {
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;

                $scope.clave = $rootScope.parametros.clave;
                $scope.nombre = $rootScope.parametros.nombre;
                $scope.nivel = $rootScope.parametros.nivel;
                $scope.categoriaem = $rootScope.parametros.categoriaem;
                
                periodoevaluacionService.getByDescripcion($scope.periodo).then(
                    function (result) {
                        $scope.periodoConsultado = result.data;
                        
                        nivelcompetenciatecnicaService.getByPeriodo($scope.periodoConsultado.periodoEvaluaionId).then(
                            function (result) {
                                $scope.niveles = result.data;
                                $scope.loading = false;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los niveles de competencia registrados en el sistema");
                            }
                        );
                    },
                    function (err) {
                        toastr.error("Error al cargar la información solicitada");
                    }
                );
                
                $rootScope.parametros.clave = $scope.clave;
                $rootScope.parametros.nombre = $scope.nombre;
                $rootScope.parametros.periodo = $scope.periodo;
                $rootScope.parametros.unidad = $scope.nombreUnidad;
            }
        }


        $scope.cargarNivelesPorArea = function () {
            var parametros = {
                'idnivel' : $scope.periodoConsultado.periodoEvaluaionId,
                'idcategoria': $scope.areaId

            }

            nivelcompetenciatecnicaService.getByPeriodoAndArea(parametros).then(
                function (result) {
                    $scope.niveles = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las niveles asociados al área seleccionada");
                }
            );
        }

        tipoareaService.getAll().then(
            function (result) {
                $scope.areas = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );

        evaluaciontecnicaService.getById(id).then(
           function (result) {
               $scope.datosevaluado = result.data;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );

        $scope.save = function () {

            if ($scope.areaId != "")
                $scope.datosevaluado.tipoArea = $scope.areaId;

            if ($scope.nivelId != "")
                $scope.datosevaluado.nivelCompetencia = $scope.nivelId;

            if (($scope.nombreUnidad.claveUnidad != $scope.nuevaUnidad.claveUnidad) && $scope.nuevaUnidad.claveUnidad != "" && $scope.nuevaUnidad.claveUnidad != null) {
                $scope.datosevaluado.claveArea = $scope.nuevaUnidad.claveUnidad;
            }

            evaluaciontecnicaService.update($scope.datosevaluado).then(
                       function (result) {
                           toastr.success(result.data);
                           $state.go("administrapersonaltecnicas");
                       },
                       function (err) {
                           console.error(err);
                       }
            );
        }


    }
})();