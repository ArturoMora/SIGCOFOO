/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("UbicacionesEditCtrl", ['$scope', 'ubicacionService', 'globalGet', '$state', '$stateParams', UbicacionesEditCtrl]);

    function UbicacionesEditCtrl($scope, ubicacionService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        ubicacionService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.registro.fechaEfectiva = new Date(result.data.fechaEfectiva);
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.UbicacionesForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                ubicacionService.Update($scope.registro).then(
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