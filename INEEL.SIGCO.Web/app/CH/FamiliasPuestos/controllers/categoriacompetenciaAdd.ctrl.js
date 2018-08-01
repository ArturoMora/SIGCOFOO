/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/
       
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("categoriacompetenciaCtrlAdd", ['$rootScope','$scope', 'familiacategoriasService', 'competenciasService', 'nivelcompetenciaService', 'descripcioncomportamiento', 'descripcionnivel', 'matrizcompetenciasService', 'globalGet', '$state', '$stateParams', categoriacompetenciaCtrlAdd]);

    function categoriacompetenciaCtrlAdd($rootScope, $scope, familiacategoriasService, competenciasService, nivelcompetenciaService, descripcioncomportamiento, descripcionnivel, matrizcompetenciasService, globalGet, $state, $stateParams) {
     
        var id = $stateParams.id;

        $scope.idRadio;
        $scope.nivelYaAsignado;
        

        if ($stateParams.id == "" || $stateParams.id == undefined || $stateParams.id == null || isNaN($stateParams.id)) {
            toastr.error("Tiene que seleccionar un periodo y una familia de puestos para poder asignar un nuevo nivel de competencia a la categoría seleccionada");
        } else {

            familiacategoriasService.getById(id).then(
                function (result) {

                    $scope.categoriaSeleccionada = result.data;
                    $scope.periodofamilia = $scope.categoriaSeleccionada.familiaPuestos.periodo.periodo;

                    competenciasService.getByPeriodo($scope.categoriaSeleccionada.familiaPuestos.periodoId).then(
                        function (result) {
                            $scope.catalogoCompetencias = result.data;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las competencias registrados en el sistema");
                        }
                    );

                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
                }
            );

            $scope.cargarNieles = function () {

                var parametros = {
                    'idNivel': 0,
                    'idCompetencia': $scope.competenciaId,
                    'periodo': $scope.periodofamilia
                }

                var busqueda = {
                    'idCompetencia': $scope.competenciaId,
                    'idCategoria': $scope.categoriaSeleccionada.categoriaId,
                    'periodo': $scope.periodofamilia
                }

                descripcionnivel.getByCompetencia(parametros).then(
                    function (result) {
                        $scope.nivelesCompetencias = result.data;
                        $scope.loading = false;

                        matrizcompetenciasService.getNivelSeleccionado(busqueda).then(
                           function (result1) {

                               $scope.nivelasignado = result1.data;
                               $scope.loading = false;
                               $scope.nivelYaAsignado = $scope.nivelasignado.nivelId;
                           },
                           function (err) {
                               toastr.error("No se han podido cargar la descripción del nivel de la competencia seleccionado");
                           }
                        );
                    },
                    function (err) {
                        toastr.error("No se han podido cargar la descripción del nivel de la competencia seleccionado");
                    }
                );
            }

            $scope.save = function () {
                var Registro = {
                    "categoriaId": id,
                    "nivelId": $scope.idRadio,
                    "competenciaId": $scope.competenciaId,
                    "periodo": $scope.periodofamilia,
                    "estado": 1
                }

                if ($scope.nivelasignado != null) {
                    if (parseInt($scope.nivelYaAsignado) == 0) {

                        matrizcompetenciasService.add(Registro).then(
                               function (result) {
                                   toastr.success(result.data);
                                   $state.go("categoriacompetenciaGet");
                               },
                               function (err) {
                                   console.error(err);
                               }
                        );
                    } else {
                        toastr.error("Ya cuenta con un nivel de competencia asignado");
                    }
                } else {

                    toastr.error("Ya cuenta con un nivel de competencia asignado");

                }
            }
        }




    }
})();