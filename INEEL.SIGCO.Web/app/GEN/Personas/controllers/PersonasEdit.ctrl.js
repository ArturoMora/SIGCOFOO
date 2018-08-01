/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("PersonasEditCtrl", ['$scope', 'personasService', 'globalGet', '$state', '$stateParams', PersonasEditCtrl]);

    function PersonasEditCtrl($scope, personasService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        personasService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.PersonasForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                personasService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("personas");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();