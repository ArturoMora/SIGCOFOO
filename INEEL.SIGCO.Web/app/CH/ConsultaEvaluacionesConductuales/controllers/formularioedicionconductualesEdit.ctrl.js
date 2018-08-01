/*AYUDA:
FooEntitiesService nombre de factory en formularioedicion.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formularioedicionconductualesCtrlEdit", ['$rootScope', '$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'familiapuestosService', 'familiacategoriasService', 'globalGet', '$state', '$stateParams', formularioedicionconductualesCtrlEdit]);

    function formularioedicionconductualesCtrlEdit($rootScope, $scope, periodoevaluacionService, evaluacionconductualService, familiapuestosService, familiacategoriasService, globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;

        $scope.nombreUnidad = {};
        $scope.nombreUnidadNueva = {};
        $scope.periodo = "";
        $scope.categoriaId = "";

        if (typeof $rootScope.parametros !== 'undefined') {
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;

                $scope.clave = $rootScope.parametros.clave;
                $scope.nombre = $rootScope.parametros.nombre;

                $scope.cateemp = $rootScope.parametros.cateemp;
                $scope.catcomp = $rootScope.parametros.catcomp;
                $scope.calificacion = $rootScope.parametros.calificacio;
                $scope.evaluacionid = $rootScope.parametros.evaluacionid;
                $scope.nombreFamilia = $rootScope.parametros.nombreFamilia
                $scope.idcategoriacompetencia = $rootScope.parametros.idcategoriacompetencia;

                periodoevaluacionService.getByDescripcion($scope.periodo).then(
                    function (result) {
                        $scope.periodoConsultado = result.data;
                       
                       
                        familiapuestosService.getByPeriodo($scope.periodoConsultado.periodoEvaluaionId).then(
                            function (result) {
                                $scope.familiasPuestos = result.data;
                                $scope.loading = false;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                            }
                        );
                    

                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                    }
                );
               
                $rootScope.parametros = {};
                $rootScope.parametros.clave = $scope.clave;
                $rootScope.parametros.nombre = $scope.nombre;
                $rootScope.parametros.cateemp = $scope.cateemp;
                $rootScope.parametros.catcomp = $scope.catcomp;
                $rootScope.parametros.calificacion = $scope.calificacion;
                $rootScope.parametros.evaluacionid = $scope.evaluacionid;
                $rootScope.parametros.periodo = $scope.periodo;
                $rootScope.parametros.unidad = $scope.nombreUnidad;
                $rootScope.parametros.idcategoriacompetencia = $scope.idcategoriacompetencia;
                $rootScope.parametros.nombreFamilia = $scope.nombreFamilia;
               

            }
        }

        evaluacionconductualService.getById(id).then(
           function (result) {
               $scope.datosevaluado = result.data;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
         );
                       
        $scope.cargarCategorias = function () {
            familiacategoriasService.GetCategoriaFamilia($scope.familiaId).then(
                function (result) {
                    $scope.categoriasFamilias = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
            );
        }

        //Guardar Cambios
        $scope.save = function () {

           
            if ($scope.categoriaId != "" )
                 $scope.datosevaluado.categoriaCompetenciasId = $scope.categoriaId;
            
            if (($scope.nombreUnidad.claveUnidad != $scope.nombreUnidadNueva.claveUnidad) && $scope.nombreUnidadNueva.claveUnidad != ""  && $scope.nombreUnidadNueva.claveUnidad != null) {
                $scope.datosevaluado.claveArea = $scope.nombreUnidadNueva.claveUnidad;
            }

            evaluacionconductualService.update($scope.datosevaluado).then(
                       function (result) {
                           toastr.success(result.data);
                           $state.go("administrapersonalconductuales");
                       },
                       function (err) {
                           console.error(err);
                       }
            );
        }

    }

})();