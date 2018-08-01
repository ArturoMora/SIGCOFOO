/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipoareaCtrlAdd", ['$scope', 'tipoareaService', 'globalGet', '$state', tipoareaCtrlAdd]);

    function tipoareaCtrlAdd($scope, tipoareaService, globalGet, $state) {
        
        tipoareaService.getAll().then(
            function (result) {
               
                $scope.area = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );

        $scope.save = function () {
            var bandera = "0";

            var destino = $scope.registro.area.trim();
            var destinodescripcion = $scope.registro.descripcion.trim();
            var origen = "";

            for (var i = 0; i < $scope.area.length; i++) {
                var origen = $scope.area[i].area.trim();
                var origendescripcion = $scope.area[i].descripcion.trim();
                if (origen.toUpperCase() === destino.toUpperCase()) {
                    bandera = "1";                  
                }              
            }
            
            if (bandera === "0") {

                if ($scope.TipoAreaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var Registro = {
                        "Area": $scope.registro.area,
                        "Descripcion": $scope.registro.descripcion,
                        "Estado": 1
                    }
                    tipoareaService.add(Registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("tipoarea");
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                }
            } else {
                toastr.error("Ya existe un tipo de área con el mismo nombre");
            }
        }

        

    }

})();