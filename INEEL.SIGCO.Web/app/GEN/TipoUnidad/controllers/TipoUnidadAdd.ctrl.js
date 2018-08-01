/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("TipoUnidadAddCtrl", ['$scope', 'tunidadService', 'globalGet', '$state', TipoUnidadAddCtrl]);

    function TipoUnidadAddCtrl($scope, tunidadService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       
        //Agregar rol 
        $scope.save = function () {
            if ($scope.TUForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                    "fechaefectiva": new Date(),
                    "descripcion": $scope.registro.descripcion,
                    "estado": 1
                }

                tunidadService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipounidad");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
      

    }

})();