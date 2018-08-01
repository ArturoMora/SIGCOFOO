/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipocompetenciaCtrlAdd", ['$scope', 'tipocompetenciaService', 'globalGet', '$state', tipocompetenciaCtrlAdd]);

    function tipocompetenciaCtrlAdd($scope, tipocompetenciaService, globalGet, $state) {
       
        tipocompetenciaService.getAll().then(
          function (result) {
              $scope.tipos = result.data;
              $scope.loading = false;
          },
          function (err) {
              toastr.error("No se han podido cargar los tipos de competencia registrados en el sistema");
          }
        );

     
        $scope.save = function () {
            var bandera = "0";

            var destino = $scope.registro.nombreCompetencia.trim();
            var descripciondestino = $scope.registro.descripcion.trim();
            var origen = "";

            for (var i = 0; i < $scope.tipos.length; i++) {

                var origen = $scope.tipos[i].nombreCompetencia.trim();
                var origendescripcion = $scope.tipos[i].descripcion.trim();
                if (origen.toUpperCase() === destino.toUpperCase()) {              
                    bandera = "1";                  
                }
            }
            
            if (bandera === "0") {
                if ($scope.TipoCompetenciaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var Registro = {
                        "nombreCompetencia": $scope.registro.nombreCompetencia,
                        "descripcion": $scope.registro.descripcion,
                        "estado": 1
                    }

                    tipocompetenciaService.Add(Registro).then(
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
                toastr.error("El nombre del tipo de competencia ya se ha registrado previamente");
            }
        }
        

    }

})();