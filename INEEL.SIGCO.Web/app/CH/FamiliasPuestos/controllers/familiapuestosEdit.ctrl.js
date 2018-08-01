/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiapuestosCtrlEdit", ['$scope', 'familiapuestosService', 'globalGet', '$state', '$stateParams', familiapuestosCtrlEdit]);

    function familiapuestosCtrlEdit($scope, familiapuestosService, globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;
        var familia = "";
        var descripcion = "";
       
        //Obtene ambito
        familiapuestosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;

                familia     = $scope.registro.nombreFamilia.trim();
                descripcion = $scope.registro.descripcion.trim();

                familiapuestosService.getByPeriodo($scope.registro.periodoId).then(
                    function (result) {
                        $scope.familiasregistradas = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
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

            var familiaMod         = $scope.registro.nombreFamilia.trim();
            var descripcionMod     = $scope.registro.descripcion.trim();
            
            if (familia.toUpperCase() === familiaMod.toUpperCase()) {
                if (descripcionMod !== descripcion) {
                    bandera = "0";
                } else {
                    bandera = "1";
                }
            } else {

                for (var i = 0; i < $scope.familiasregistradas.length; i++) {
                    var familiaRegistrada = $scope.familiasregistradas[i].nombreFamilia.trim();
                   
                    if ((familiaMod.toUpperCase() === familiaRegistrada.toUpperCase())) {
                        bandera = "1";
                    }
                }
            }

            if (bandera === "0") {
                if ($scope.FamiliaPuestosForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    familiapuestosService.update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("familiapuestos", { id: $scope.registro.periodoId });

                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }
            } else {
                toastr.error("Los datos de la familia de puestos que desea actualizar, ya fueron registrados");
            }
        }

       
    }

})();