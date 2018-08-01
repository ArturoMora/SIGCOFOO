/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";

     
    angular
      .module("ineelGEN")
      .controller("RolesAddCtrl", ['$scope', 'RolesService','globalGet', '$state', RolesAddCtrl]);

    function RolesAddCtrl($scope, RolesService, globalGet, $state) {
       
        
        //Variable API
        var API = globalGet.get("api");
       

        RolesService.getAll().then(
            function (result) {
                $scope.registrosRoles = result.data;           
            },
            function (err) {
                toastr.error("No se han podido cargar los roles registrados en el sistema");
            }
        );

        //Agregar rol
        $scope.save = function () {

            var bandera = "0";

            var destino = $scope.descripcion.trim();
            var origen = "";

            for (var i = 0; i < $scope.registrosRoles.length; i++) {
                var origen = $scope.registrosRoles[i].descripcion.trim();
               
                if ( origen.toUpperCase() === destino.toUpperCase() ) {
                    bandera = "1";                  
                }              
            }
            
            if (bandera === "0") {

                if ($scope.RolForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {

                    var Registro = {
                        "descripcion": $scope.descripcion,
                        "estado": 1
                    }

                    RolesService.Add(Registro).then(
                      function (result) {
                          toastr.success(result.data);
                          $state.go("roles");
                      },
                      function (err) {
                          console.error(err);
                      }
                    );
                }
            } else {
                toastr.error("El rol ya fue registrado previamente");
            }
        }
      

    }

})();