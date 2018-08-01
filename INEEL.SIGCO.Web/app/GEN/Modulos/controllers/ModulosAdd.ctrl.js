/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("ModulosAddCtrl", ['$scope', 'ModulosService', 'globalGet', '$state', ModulosAddCtrl]);

    function ModulosAddCtrl($scope, ModulosService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       
        //Agregar rol
        $scope.save = function () {
            if ($scope.ModuloForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                    
                    "descripcion": $scope.rol.descripcion,
                    "estado": 1
                }


                ModulosService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("modulos");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
      

    }

})();