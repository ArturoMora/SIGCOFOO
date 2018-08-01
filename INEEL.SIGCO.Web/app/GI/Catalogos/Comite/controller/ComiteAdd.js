(function () {
    "use strict";

    var app = angular.module("ineel.controllers");
    app.controller("comiteAdd", ['AuthService', '$scope', 'ComiteService', 'globalGet', '$state', '$stateParams', 'comunService', '$rootScope', comiteAdd]);
    function comiteAdd(AuthService, $scope, ComiteService, globalGet, $state) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        

        //Guardar Cambios
        $scope.addComite = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                ComiteService.create($scope.registro).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("comite");
                },
                function (error) {
                    toastr.error(error.data.message);
                    console.log(error);
                });
            }
        }
    }
})();