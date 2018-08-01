/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("ModulosEditCtrl", ['$scope', 'ModulosService', 'globalGet', '$state', '$stateParams', ModulosEditCtrl]);

    function ModulosEditCtrl($scope, ModulosService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        ModulosService.getById(id).then(
            function (result) {
                $scope.modulo = result.data;
              
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ModulosForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                ModulosService.Update($scope.modulo).then(
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