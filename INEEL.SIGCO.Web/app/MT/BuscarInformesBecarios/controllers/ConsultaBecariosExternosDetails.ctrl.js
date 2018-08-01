(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ConsultaBecariosExternosDetailsCtrl", [
            "AuthService",
            "$scope",
            "$stateParams",
            "IndicadoresMTService",
            "buscarInformesBecariosService",
            ConsultaBecariosExternosDetailsCtrl
        ]);

    function ConsultaBecariosExternosDetailsCtrl(AuthService, $scope, $stateParams, IndicadoresMTService, buscarInformesBecariosService ) {
        $scope.authentication = AuthService.authentication;

        buscarInformesBecariosService.getBecario($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                toastr.error(err.data.message);
                console.error(err);
            });


        /**
         * Para lo de indicadores de acceso en MT
         */

        var datos = {
            "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
            "fecha": new Date(),
            "modulo": "MT",
            "ocID": "BEC"
        };

        IndicadoresMTService.AddAccesoModulosOC(datos).then(
            function (result) {
                //$scope.soliResult = result.data;
            },
            function (error) {
                toastr.error(error);
                console.log(error);
            });




    }

})();