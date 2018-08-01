/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("PlazaAddCtrl", ['$scope', 'plazaService','globalGet', '$state', PlazaAddCtrl]);

    function PlazaAddCtrl($scope, plazaService, globalGet, $state) {
       
        
        //Variable API 
        var API = globalGet.get("api");
       
        //Agregar rol
        $scope.save = function () {
            if ($scope.PlazaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                  
                    "descripcion": $scope.registro.descripcion,
                    "estado": 1
                }

                plazaService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("plaza");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }      

    }

})();