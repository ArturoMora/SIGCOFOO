/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("CategoriasGetCtrl", ["$scope", "categoriasService", "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", CategoriasGetCtrl]);

    function CategoriasGetCtrl($scope, categoriasService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion 
        //$scope.authentication = AuthService.authentication;
        //obtener registros
        categoriasService.getAll().then(
            function (result) {

                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }

                $scope.registro = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true);

            },
            function (err) {
                toastr.error("No se han podido cargar las categorías de empleado registradas en el sistema");
            }
            );


    }

})();