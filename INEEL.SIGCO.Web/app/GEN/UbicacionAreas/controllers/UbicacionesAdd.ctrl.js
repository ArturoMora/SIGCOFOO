/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("UbicacionesAddCtrl", ['$scope', 'ubicacionService', 'globalGet', '$state', UbicacionesAddCtrl]);

    function UbicacionesAddCtrl($scope, ubicacionService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       
        //Agregar rol
        $scope.save = function () {
            if ($scope.UbicacionesForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                    "fechaEfectiva": new Date(),
                    "noedificio": $scope.registro.noedificio,
                    "nopiso": $scope.registro.nopiso,
                    "estado": 1

                }


                ubicacionService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("ubicaciones");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
      

    }

})();