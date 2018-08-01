(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SeguimientoOportunidadGetCtrl", [
            "AuthService",
            "$scope",
            "DTOptionsBuilder",
            "OportunidadNegocioCRService",
            SeguimientoOportunidadGetCtrl
        ]);

    function SeguimientoOportunidadGetCtrl(AuthService, $scope, DTOptionsBuilder, OportunidadNegocioCRService) {

        $scope.authentication = AuthService.authentication;
        $scope.oportunidadesEnSeguimiento = [];

        var Id = $scope.datosUsuarioAux = AuthService.authentication.userprofile.clavePersona;

        OportunidadNegocioCRService.getBySeguimiento(Id).then(
            function (result) {
                $scope.oportunidadesEnSeguimiento = result.data;
                $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', false);
            },
            function (err) {
                toastr.error(err);
            }
        );
    }
})();
