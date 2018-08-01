/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("UnidadAddCtrl", ['$scope', 'unidadService', 'tunidadService', 'ubicacionService', 'globalGet', '$state', UnidadAddCtrl]);

    function UnidadAddCtrl($scope, unidadService, tunidadService, ubicacionService,  globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       
        tunidadService.getAll().then(
           function (result) {
                $scope.tipounidad = result.data;
           },
            function (err) {
              console.error(err);
        });


        ubicacionService.getAll().then(
           function (result) {
              $scope.ubicacion = result.data;
           },
               function (err) {
                   console.error(err);
        });


        $scope.save = function () {
            if ($scope.UnidadForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var Registro = {
                   
                    "ClaveUnidad": $scope.registro.claveunidad,
                    "NombreUnidad": $scope.registro.nombreunidad,
                    "tipoO": $scope.registro.tipounidadselect,
                    "idUbicacion": $scope.registro.ubicacionselect,
                    "ClaveResponsable": $scope.registro.claveresponsable,
                   "padre": $scope.registro.padre,
                    "estado": 1
                }

                unidadService.Add(Registro).then(
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