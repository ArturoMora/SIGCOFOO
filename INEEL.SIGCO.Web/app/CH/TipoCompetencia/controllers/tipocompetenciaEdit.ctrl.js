/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipocompetenciaCtrlEdit", ['$scope', 'tipocompetenciaService', 'globalGet', '$state', '$stateParams',  tipocompetenciaCtrlEdit]);

    function tipocompetenciaCtrlEdit($scope, tipocompetenciaService, globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;

        var tipo = "";
        var descripcion = "";
   
        tipocompetenciaService.getAll().then(
          function (result) {
              $scope.tipos = result.data;
              $scope.loading = false;
          },
          function (err) {
              toastr.error("No se han podido cargar los tipos de competencia registrados en el sistema");
          }
        );

        //Obtene ambito
        tipocompetenciaService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                tipo        = $scope.registro.nombreCompetencia.trim();
                descripcion = $scope.registro.descripcion.trim();
            },
            function (err) {
                console.error(err);
            }
        );
         
        //Guardar Cambios
        $scope.save = function () {
            var bandera = "0";
                   
            var tipoMod        = $scope.registro.nombreCompetencia.trim();
            var descripcionMod = $scope.registro.descripcion.trim();
            
            if (tipo.toUpperCase() == tipoMod.toUpperCase()) {
                if (descripcion.toUpperCase() != descripcionMod.toUpperCase()) {
                    bandera = "0";
                } else {
                    bandera = "1";
                }
            } else {

                for (var i = 0; i < $scope.tipos.length; i++) {
                    var tipoRegistrado = $scope.tipos[i].nombreCompetencia.trim();

                    if (tipoMod.toUpperCase() == tipoRegistrado.toUpperCase()) {
                        bandera = "1";
                    }
                }
            }

            
            if (bandera == "0") {

                if ($scope.TipoCompetenciaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    tipocompetenciaService.Update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("tipocompetencia");
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }

            } else {
                toastr.error("El tipo de competencia que desea actualizar ya fue registrado previamente");
            }

        }


    }

})();