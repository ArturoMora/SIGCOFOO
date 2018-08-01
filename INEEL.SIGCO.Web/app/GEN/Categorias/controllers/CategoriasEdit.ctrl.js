/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("CategoriasEditCtrl", ['$scope', 'categoriasService', 'globalGet', '$state', '$stateParams', CategoriasEditCtrl]);

    function CategoriasEditCtrl($scope, categoriasService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api"); 
        
        var id = $stateParams.id;

        //Obtene ambito
        categoriasService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.CategoriaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                categoriasService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("categorias");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();