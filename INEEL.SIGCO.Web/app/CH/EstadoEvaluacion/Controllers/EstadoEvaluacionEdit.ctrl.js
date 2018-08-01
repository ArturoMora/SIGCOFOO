/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("estadoevaluacionCtrlEdit", ['$scope', 'estadoevaluacionService', 'globalGet', '$state', '$stateParams',  estadoevaluacionCtrlEdit]);

    function estadoevaluacionCtrlEdit($scope, estadoevaluacionService, globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;

        //Obtene ambito
        estadoevaluacionService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }
        );

        estadoevaluacionService.getAll().then(
            function (result) {
                $scope.estados = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los estado de evaluación registrados en el sistema");
            }
        );

        //Guardar Cambios
        $scope.save = function () {

            var bandera = "0";

            var destino = $scope.registro.descripcion.trim();
            var origen = "";

            for (var i = 0; i < $scope.estados.length; i++) {
                var origen = $scope.estados[i].descripcion.trim();             
                if (origen.toUpperCase() === destino.toUpperCase()) {               
                    bandera = "1";                  
                }              
            }
            
            if (bandera === "0") {
                if ($scope.EstadoEvaluacionForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    estadoevaluacionService.update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("estadoevaluacion");
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }
            } else {
                toastr.error("El estado de evaluación que desea actualizar, ya está registrado");
            }
        }


    }

})();