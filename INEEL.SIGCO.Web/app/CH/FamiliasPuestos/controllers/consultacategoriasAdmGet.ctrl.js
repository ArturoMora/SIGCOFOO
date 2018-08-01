/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("consultacategoriasAdmCtrlGet", ['$rootScope', '$scope', 'familiapuestosService', 'familiacategoriasService', 'matrizcompetenciasService', 'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", consultacategoriasAdmCtrlGet]);

    function consultacategoriasAdmCtrlGet($rootScope, $scope, familiapuestosService, familiacategoriasService, matrizcompetenciasService, globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
       
        var id = $stateParams.id;

        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
                       
        $scope.nombreUnidad = $rootScope.parametros.unidad.nombreUnidad;

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
                
                 $scope.categoriasfam = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
             }
         );
      
        $scope.cargarMatriz = function () {

           
            matrizcompetenciasService.getMatriz($scope.categoriaId).then(
              function (result) {
                  $scope.matriz = result.data;
                  $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar las familias de puestos registrados en el sistema");
              }
          );

        }

       
    }

})();