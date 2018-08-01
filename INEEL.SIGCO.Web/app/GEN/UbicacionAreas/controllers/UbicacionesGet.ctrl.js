/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("UbicacionesGetCtrl", ["$scope", "ubicacionService", UbicacionesGetCtrl]);

    function UbicacionesGetCtrl($scope, ubicacionService) {

        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        //$scope.authentication = AuthService.authentication;
        //obtener registros
        ubicacionService.getAll().then(
            function (result) {
                $scope.registro = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar las ubicaciones de las unidades organizacionales");
            }
            );

    }

})();