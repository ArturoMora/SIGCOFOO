/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("PersonasGetCtrl", ["$scope", "personasService", "unidadService", PersonasGetCtrl]);

    function PersonasGetCtrl($scope, personasService, unidadService) {

        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        //$scope.authentication = AuthService.authentication;
        //obtener registros


        $scope.myFunc = function (idClaveArea) {
             personasService.getByArea(idClaveArea).then(
                function (result) {
                    $scope.registro = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    debugger;
                    toastr.error("No se han podido cargar las funciones del sistema");
                }
            );
        };

        unidadService.getAll().then(
          function (result) {
            $scope.unidades = result.data;
          },
          function (err) {
             toastr.error("No se han podido cargar las unidades organizacionales");
          }
        );

        personasService.getAll().then(
            function (result) {
                $scope.registro = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar el personal ");
            }
            );

    }

})();