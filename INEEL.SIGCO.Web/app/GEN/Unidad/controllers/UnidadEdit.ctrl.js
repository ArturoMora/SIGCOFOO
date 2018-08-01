/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("UnidadEditCtrl", ['$scope', 'unidadService', 'globalGet', '$state', '$stateParams', UnidadEditCtrl]);

    function UnidadEditCtrl($scope, unidadService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        unidadService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.UnidadesForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                funcionesService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("unidades");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();