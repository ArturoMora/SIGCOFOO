(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("AsistenteCtrlGet", ["AuthService", "$scope", "AsistenteService","DTOptionsBuilder", AsistenteCtrlGet]);
    function AsistenteCtrlGet(AuthService, $scope, AsistenteService, DTOptionsBuilder) {
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        AsistenteService.getAll().then(
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