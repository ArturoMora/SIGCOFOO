/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {


    angular
      .module("ineelGEN")
      .controller("CategoriasAddCtrl", ['$scope', 'categoriasService','globalGet', '$state', CategoriasAddCtrl]);

    function CategoriasAddCtrl($scope, categoriasService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
        
        //Agregar rol
        $scope.save = function () {
            if ($scope.CategoriaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                  
                    "descripcion": $scope.registro.descripcion,
                    "categoriaid": $scope.registro.categoriaId,
                    "estado": 1

                }

                debugger

                categoriasService.Add(Registro).then(
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