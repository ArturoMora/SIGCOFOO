/*AYUDA:
FooEntitiesService nombre de factory en rolpersonas.service.js
*/

(function () {
    "use strict";

    var app = angular.module("ineelGEN");
    app.controller("RolPersonaGetCtrl", ["$scope", "RolPersonaService", "RolesService", RolPersonaGetCtrl]);


    function RolPersonaGetCtrl($scope, RolPersonaService, RolesService) {

        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        //$scope.authentication = AuthService.authentication;
        //obtener registros
        RolesService.getAll().then(
            function (result) {
                $scope.registrosRoles = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los roles registrados en el sistema");
            }
        );





    }


})();