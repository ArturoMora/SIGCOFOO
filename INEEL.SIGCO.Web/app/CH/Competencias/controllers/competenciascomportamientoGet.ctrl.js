/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciascomportamientoCtrlGet", ['$scope', 'competenciasService', 'nivelcompetenciaService', 'descripcioncomportamiento', 'descripcionnivel', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", '$stateParams', competenciascomportamientoCtrlGet]);
                        
    function competenciascomportamientoCtrlGet($scope, competenciasService, nivelcompetenciaService, descripcioncomportamiento, descripcionnivel, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $stateParams) {
       
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
                     
        var id = $stateParams.id;
        
        competenciasService.getById($stateParams.id).then(
                function (result) {
                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las competencias registrados en el sistema");
                }
        );
                             
        nivelcompetenciaService.getAll().then(
           function (result) {
               $scope.nivel = result.data;
               $scope.loading = false;
           },
           function (err) {
               toastr.error("No se han podido cargar la información registrada en el sistema");
           }
        );
                   
        $scope.cargarDescripciones = function () {

            $scope.nivelDesc = "";
            $scope.comportamiento = "";

            var parametros = {
                'idNivel': $scope.nivelCompetenciaId,
                'idCompetencia': $stateParams.id,
                'periodo': $scope.registro.periodo.periodo
            }
            
            descripcionnivel.getByNivel(parametros).then(
                function (result) {                
                    $scope.nivelDesc = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar la descripción del nivel de la competencia seleccionado");
                }
            );

        }
      
        //Agregar rol
        $scope.save = function () {

            if ($scope.ComportamientosForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                 if ($scope.nivelDesc.competenciaID === $scope.registro.competenciaId && $scope.nivelDesc.nivelId === $scope.nivelCompetenciaId) {

                    descripcionnivel.update($scope.nivelDesc).then(
                           function (result) {
                               toastr.success(result.data);
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                     /*
                    descripcioncomportamiento.update($scope.comportamiento).then(
                           function (result) {
                               toastr.success(result.data);
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                    */
                } else {

                    var Nivel = {
                        "descripcion": $scope.nivelDesc.descripcion,
                        "periodo": $scope.registro.periodo.periodo,
                        "comportamiento": $scope.nivelDesc.comportamiento,
                        "competenciaID": $scope.registro.competenciaId,
                        "nivelId": $scope.nivelCompetenciaId,
                        "estado": 1
                    }
                     /*
                    var Descripcion = {
                        "descripcion": $scope.comportamiento.descripcion,
                        "periodo": $scope.registro.periodo.periodo,
                        "competenciaID": $scope.registro.competenciaId,
                        "nivelId": $scope.nivelCompetenciaId,
                        "estado": 1
                    }
                    */

                    descripcionnivel.add(Nivel).then(
                           function (result) {
                               toastr.success(result.data);
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                     /*
                    descripcioncomportamiento.add(Descripcion).then(
                           function (result) {
                               toastr.success(result.data);
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                    */
                }
            }
        }

      
    }

})();