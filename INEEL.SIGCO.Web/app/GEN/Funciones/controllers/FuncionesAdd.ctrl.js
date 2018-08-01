/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("FuncionesAddCtrl", ['$location','$scope',
          'funcionesService',
          'ModulosService',
          'globalGet',
          '$state',
          '$stateParams',
           FuncionesAddCtrl]);

    function FuncionesAddCtrl($location,$scope, funcionesService, ModulosService,
        globalGet, $state, $stateParams) {
       
            $scope.click = false;
            $scope.nueva = false;
            $scope.f_state = 0;
          
            $scope.moduloPrevio = $stateParams.id;
          
            $scope.niveles = [
            { valor: "-1", descripcion: "Seleccione un nivel" },
            { valor: "0", descripcion: "Nivel 0" },
            { valor: "1", descripcion: "  Nivel 1" },
            { valor: "2", descripcion: "     Nivel 2" },
            { valor: "-1", descripcion: "Esta función no se muestra como parte del menú" }
            ];      
           

            ModulosService.getAll().then(
               function (result) {
                   $scope.modulos = result.data;
               },
               function (err) {
                   console.error(err);
               }
            );

            funcionesService.getFuncionPadre($stateParams.id).then(
               function (result) {
                 $scope.funcionesbase = result.data;
               },
               function (err) {
                  console.error(err);
               }
            );


            funcionesService.getFunByModulo($stateParams.id).then(
               function (result) {                 
                   $scope.funcionesRegistradasModulo = result.data.length + 1;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No se han podido cargar las funciones del sistema");
               }
             );


            var muestraCampoState = function () {
                if ($scope.registro.selectednivel === "0")
                    f_state = 1;
            }
                 
        
            $scope.save = function () {
                   var Registro = {

                        "descripcion": $scope.registro.descripcion,
                        "nombre": $scope.registro.funcion,
                        "url": $scope.registro.url,
                        "secuencia": $scope.registro.secuencia,
                        "nivel": $scope.registro.selectednivel,
                        "idpadre": $scope.registro.funcionpadre,
                        "idmodulo": $scope.registro.moduloselect,
                        "state" : $scope.registro.state,
                        "estado": 1
                   }
                 
                  
                    funcionesService.Add(Registro).then(
                                    function (result) {
                                        toastr.success(result.data);

                                     
                                        $state.go("funciones", { id: $scope.moduloPrevio });
                                      
                                    },
                                    function (err) {
                                        console.error(err);
                                       
                                    }
                    );
            }
                           
                          

        }

})();