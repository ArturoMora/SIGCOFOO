(function () {
    "use strict";

    var app = angular.module("ineel.controllers");
    app.controller("estadoLicenciamientoEdit", ['AuthService', '$scope', 'EstadoLicenciamientoService', 'globalGet', '$state', '$stateParams', 'comunService', '$rootScope', estadoLicenciamientoEdit]);
    function estadoLicenciamientoEdit(AuthService, $scope, EstadoLicenciamientoService, globalGet, $state, $stateParams, comunService, $rootScope) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $rootScope.getGlobalID();

        //Obtene ambito
        EstadoLicenciamientoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                EstadoLicenciamientoService.update($scope.registro).then(
                function (result) {
                    toastr.success("Registro actualizado!");
                    $state.go("estadoLicenciamiento");
                },
               function (error) {
                   debugger;
                   toastr.error(error.data.message);
               });
            }
        }
    }
})();