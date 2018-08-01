/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("RolFuncionesEditCtrl", ['$scope', 'rolfuncionesService', 'funcionesService', 'globalGet', '$state', '$stateParams', RolFuncionesEditCtrl]);

    function RolFuncionesEditCtrl($scope, rolfuncionesService, funcionesService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        funcionesService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.RolFuncionesForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                rolfuncionesService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("rolfunciones");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();