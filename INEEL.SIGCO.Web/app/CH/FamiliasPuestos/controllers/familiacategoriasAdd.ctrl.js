/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiacategoriasCtrlAdd", ['$scope', 'familiapuestosService', 'familiacategoriasService', 'globalGet', '$state', '$stateParams', familiacategoriasCtrlAdd]);

    function familiacategoriasCtrlAdd($scope, familiapuestosService, familiacategoriasService, globalGet, $state, $stateParams) {
     
        var id = $stateParams.id;
      
        //Obtene ambito
        familiapuestosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }
        );


        familiacategoriasService.GetCategoriaFamilia($stateParams.id).then(
             function (result) {
                 $scope.categoriasreg = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No se han podido cargar las categorías registradas en el sistema");
             }
         );
                 
        
        $scope.save = function () {

            var bandera = "0";

            var categoria = $scope.registro.nombreCategoria.trim();
          

            for (var i = 0; i < $scope.categoriasreg.length; i++) {
                var caregoriaRegistrada = $scope.categoriasreg[i].nombreCategoria.trim();
                if (categoria.toUpperCase() == caregoriaRegistrada.toUpperCase()) {
                    bandera = "1";                  
                }              
            }
            
            if (bandera == "0") {

                if ($scope.FamiliaCategoriaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var Registro = {
                        "nombreCategoria": $scope.registro.nombreCategoria,
                        "descripcion": $scope.registro.descripcioncategoria,
                        "periodo": $scope.registro.periodo.periodo,
                        "familiaId": $scope.registro.familiaId,
                        "estado": 1
                    }

                    familiacategoriasService.add(Registro).then(
                           function (result) {
                               toastr.success(result.data);

                               $state.go("familiacategorias", { id: $stateParams.id });

                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                }
            } else {
                toastr.error("Ya existe una categoría registrada con ese nombre");
            }

        }
     
    }
        
  
})();