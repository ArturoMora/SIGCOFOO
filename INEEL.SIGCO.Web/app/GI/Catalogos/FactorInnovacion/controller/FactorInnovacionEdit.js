(function () {
    "use strict";

    var app = angular.module("ineel.controllers");
    app.controller("factorInnovacionEdit", ['AuthService', '$scope', 'FactorInnovacionService', 'globalGet', '$state', '$stateParams', 'comunService', '$rootScope', factorInnovacionEdit]);
    function factorInnovacionEdit(AuthService, $scope, FactorInnovacionService, globalGet, $state, $stateParams, comunService, $rootScope) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $rootScope.getGlobalID();

        //Obtene ambito
        FactorInnovacionService.getbyid(id).then(
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
                FactorInnovacionService.update($scope.registro).then(
                function (result) {
                    toastr.success("Registro actualizado!");
                    $state.go("factorInnovacion");
                },
               function (error) {
                   debugger;
                   toastr.error(error.data.message);
               });
            }
        }
    }
})();