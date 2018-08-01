/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiacategoriasCtrlEdit", ['$scope',  'familiapuestosService', 'familiacategoriasService', 'globalGet', '$state', '$stateParams', familiacategoriasCtrlEdit]);

    function familiacategoriasCtrlEdit($scope,  familiapuestosService,  familiacategoriasService, globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;
        var categoria = "";
        var descripcion = "";
        
        //Obtene ambito
        familiacategoriasService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                categoria       = $scope.registro.nombreCategoria
                descripcion     = $scope.registro.descripcion


                familiacategoriasService.GetCategoriaFamilia($scope.registro.familiaId).then(
                     function (result) {
                         $scope.categoriasreg = result.data;
                         $scope.loading = false;
                     },
                     function (err) {
                         toastr.error("No se han podido cargar las categorías registradas en el sistema");
                     }
                 );


            },
            function (err) {
                console.error(err);
            }        
        );

        //Guardar Cambios
        $scope.save = function () {
            var bandera = "0";

            
            var categoriaMod     = $scope.registro.nombreCategoria;
            var descripcionMod   = $scope.registro.descripcion;

            if (categoriaMod.toUpperCase() == categoria.toUpperCase()) {
               
                if (descripcion.toUpperCase() != descripcionMod.toUpperCase()) {
                    bandera = "0";
                } else {
                    bandera = "1";
                }

                             
            } else {
               
                for (var i = 0; i < $scope.categoriasreg.length; i++) {
                    var caregoriaRegistrada = $scope.categoriasreg[i].nombreCategoria.trim();
                    if (categoriaMod.toUpperCase() === caregoriaRegistrada.toUpperCase()) {
                        bandera = "1";
                    }
                }
            }

            if (bandera == "0") {
                if ($scope.FamiliaCategoriaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    familiacategoriasService.update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("familiacategorias", { id: $scope.registro.familiaId });
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }
            } else {
                toastr.error("La categoría que desea actualizar ya fue registrada previamente");
            }
        }

       
    }

})();