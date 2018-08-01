(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("mecConsultaTecnicaCtrlGet", ["AuthService", "$scope", "$rootScope", "MECService", "$uibModal", mecConsultaTecnicaCtrlGet]);

    function mecConsultaTecnicaCtrlGet(AuthService, $scope, $rootScope, MECService, $uibModal) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        $scope.numEmp = AuthService.authentication.userprofile.clavePersona;

        MECService.getAllTecnicaConsulta().then(
            function (result) {
                $scope.registrosTecnicos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Competencia Técnica");
            }
            );
        MECService.getAllConductualConsulta().then(
            function (result) {
                $scope.registrosConductual = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Competencia Conductual");
            }
            );
    }
})();