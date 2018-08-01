/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("estadoevaluacionCtrlAdd", ['$scope', 'estadoevaluacionService', 'globalGet', '$state', estadoevaluacionCtrlAdd]);

    function estadoevaluacionCtrlAdd($scope, estadoevaluacionService, globalGet, $state) {
       

        estadoevaluacionService.getAll().then(
            function (result) {
                
                $scope.estados = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los estado de evaluación registrados en el sistema");
            }
        );

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
                    var Registro = {
                        "descripcion": $scope.registro.descripcion,
                        "estado": 1
                    }
                    estadoevaluacionService.add(Registro).then(
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
                toastr.error("El nuevo estado de evaluación que desea ingresar, ya fue registrado");
            }
        }
                              

    }

})();