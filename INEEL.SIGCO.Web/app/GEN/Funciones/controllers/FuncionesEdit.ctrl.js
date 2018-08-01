/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("FuncionesEditCtrl", ['$scope', 'funcionesService', 'ModulosService', 'globalGet', '$state', '$stateParams', FuncionesEditCtrl]);

    function FuncionesEditCtrl($scope, funcionesService, ModulosService, globalGet, $state, $stateParams) {
               
        var id = $stateParams.id;


        $scope.niveles = [
            { nivel: "-1", descripcion: "Esta función no se muestra como parte del menú" },
            { nivel: "0", descripcion: "Nivel 0" },
            { nivel: "1", descripcion: "  Nivel 1" },
            { nivel: "2", descripcion: "     Nivel 2" }
        ];

        
        //Obtene ambito
        funcionesService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.cargaDependencias($scope.registro.idModulo);
                $scope.nivelSeleccionado = $scope.registro.nivel;
            },
            function (err) {
                console.error(err);
        });

        
        ModulosService.getAll().then(
           function (result) {
               $scope.modulos = result.data;
           },
           function (err) {
               console.error(err);
        });

        
        $scope.cargaDependencias = function (idModuloPrevio) {
            funcionesService.getFuncionPadre(idModuloPrevio).then(
               function (result) {
                   $scope.funcionespadre = result.data;
               },
               function (err) {
                   console.error(err);
               }
            );
        }

        //Guardar Cambios
        $scope.save = function () {
                funcionesService.Update($scope.registro).then(
                     function (result) {
                         toastr.success(result.data);
                        
                         $state.go("funciones", { id: $scope.registro.idModulo });
                      },
                      function (err) {
                        console.error(err);
                });
           
        }

    }

})();