(function () {
    "use strict";

    var app = angular.module("ineel.controllers");
    app.controller("tipoAccesoEdit", ['AuthService', '$scope', 'TipoAccesoService', 'globalGet', '$state', '$stateParams', 'comunService', '$rootScope', tipoAccesoEdit]);
    function tipoAccesoEdit(AuthService, $scope, TipoAccesoService, globalGet, $state, $stateParams, comunService, $rootScope) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $rootScope.getGlobalID();

        //Obtene ambito
        TipoAccesoService.getbyid(id).then(
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
                TipoAccesoService.update($scope.registro).then(
                function (result) {
                    toastr.success("Registro actualizado!");
                    $state.go("tipoAcceso");
                },
                function (error) {
                    debugger;
                    toastr.error(error.data.message);
                });
            }
        }
    }
})();