(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("tipoPagoAgregar", ['AuthService', '$scope', 'TipoPagoService', 'globalGet', '$state', 'comunService', tipoPagoAgregar]);
    function tipoPagoAgregar(AuthService, $scope, TipoPagoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.registro.estado = true;
                TipoPagoService.create($scope.registro).then(
                    function (result) {
                        toastr.success("Registro creado!");
                        $state.go("tipoPago");
                    },
                    function (error) {
                        debugger;
                        toastr.error(error.data.message);
                    });
            }
        }
    }
})();