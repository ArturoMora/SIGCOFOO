/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("PlazaEditCtrl", ['$scope', 'plazaService', 'globalGet', '$state', '$stateParams', PlazaEditCtrl]);

    function PlazaEditCtrl($scope, plazaService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api"); 
        
        var id = $stateParams.id;

        //Obtene ambito
        plazaService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.PlazaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                plazaService.Update($scope.registro).then(
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