(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("EncargadoDespachoCtrlGet", ["AuthService", "$scope", "EncargadoDespachoService", "DTOptionsBuilder", "$rootScope", EncargadoDespachoCtrlGet]);
    function EncargadoDespachoCtrlGet(AuthService, $scope, EncargadoDespachoService, DTOptionsBuilder, $rootScope) {
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $rootScope.idG = "";
        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }
        //obtener registros
        EncargadoDespachoService.getAll().then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Asistente");
            }
            );
    }
})();