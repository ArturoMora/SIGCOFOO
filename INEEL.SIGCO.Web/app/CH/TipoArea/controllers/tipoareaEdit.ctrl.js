/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipoareaCtrlEdit", ['$scope', 'tipoareaService',  'globalGet', '$state', '$stateParams',  tipoareaCtrlEdit]);

    function tipoareaCtrlEdit($scope, tipoareaService,  globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;
        var area = "";
        var descripcion = "";

        tipoareaService.getAll().then(
            function (result) {
                $scope.area = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );

        //Obtene ambito
        tipoareaService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                area = $scope.registro.area.trim();
                descripcion = $scope.registro.descripcion.trim();
            },
            function (err) {
                console.error(err);
            }
        );
              
        //Guardar Cambios
        $scope.save = function () {
            var bandera = "0";

            var areaMod = $scope.registro.area.trim();
            var descripcionMod = $scope.registro.descripcion.trim();
           
            if (area.toUpperCase() == areaMod.toUpperCase()) {
                if (descripcion.toUpperCase() != descripcionMod.toUpperCase()) {
                    bandera = "0";
                } else {
                    bandera = "1";
                }
            } else {

                for (var i = 0; i < $scope.area.length; i++) {
                    var areaRegistrada = $scope.area[i].area.trim();
                   
                    if (areaMod.toUpperCase() == areaRegistrada.toUpperCase()) {
                        bandera = "1";
                    }
                }
            }
            
            if (bandera === "0") {
                if ($scope.TipoAreaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    tipoareaService.update($scope.registro).then(
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
                toastr.error("El tipo de área que desea actualizar, ya se encuentra registrado");
            }
        }
       

    }

})();