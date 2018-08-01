/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("TipoPersonalAddCtrl", ['$scope', 'tipopersonaService', 'globalGet', '$state', TipoPersonalAddCtrl]);

    function TipoPersonalAddCtrl($scope, tipopersonaService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       
        //Agregar rol
        $scope.save = function () {
            if ($scope.TipoPersonaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                   
                    "descripcion": $scope.registro.descripcion,
                    "tipoPersonaId": $scope.registro.tipoPersonaId,
                    "estado": 1,
                    "fechaEfectiva": new Date()

                }


                tipopersonaService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipopersonal");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
      

    }

})();