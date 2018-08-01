/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN") 
      .controller("RolesEditCtrl", ['$scope', 'RolesService', 'globalGet', '$state', '$stateParams', RolesEditCtrl]);

    function RolesEditCtrl($scope, RolesService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        RolesService.getById(id).then(
            function (result) {
                $scope.rol = result.data;
               
            },
            function (err) {
                console.error(err);
            }
        );

        RolesService.getAll().then(
            function (result) {
                $scope.registrosRoles = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los roles registrados en el sistema");
            }
        );

        //Guardar Cambios
        $scope.save = function () {

            var bandera = "0";

            var destino = $scope.rol.descripcion.trim();
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
                    RolesService.Update($scope.rol).then(
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
                toastr.error("Los datos del rol que desea actualizar, ya fueron registrados previamente");
            }
        }

    }

})();