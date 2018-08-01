/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciasCtrlEdit", ['$scope', 'competenciasService',  'globalGet', '$state', '$stateParams', competenciasCtrlEdit]);

    function competenciasCtrlEdit($scope, competenciasService,  globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;


        //Obtene ambito
        competenciasService.getById(id).then(
            function (result) {
                $scope.registro = result.data;

                competenciasService.getByPeriodo($scope.registro.periodoId).then(
                    function (result) {
                        $scope.competencias = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las competencias registradas en el sistema");
                    }
                );

            },
            function (err) {
                console.error(err);
            }
        );


        //Guardar Cambios
        $scope.save = function () {
             var bandera = "0";

            var destino = $scope.registro.competencia.trim();
            var destinodescripcion = $scope.registro.descripcion.trim();
            var origen = "";

            for (var i = 0; i < $scope.competencias.length; i++) {
                var origen = $scope.competencias[i].competencia.trim();
                var origendescripcion = $scope.competencias[i].descripcion.trim();
                if (origen.toUpperCase() === destino.toUpperCase() && (origendescripcion.toUpperCase() === destinodescripcion.toUpperCase()))  {
                    bandera = "1";
                }
            }

            if (bandera === "0") {
                if ($scope.CompetenciasForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {

                    competenciasService.update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("competencias", { id: $scope.registro.periodoId });
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }
            } else {
                toastr.error("Los datos de la competencia que desea actualizar, ya fueron registrados");
            }
        }


    }

})();