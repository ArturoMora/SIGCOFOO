(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ConsultaBecariosInternosDetailsCtrl", ['AuthService', '$scope', 'buscarInformesBecariosService', "$stateParams", "IndicadoresMTService", ConsultaBecariosInternosDetailsCtrl]);

    function ConsultaBecariosInternosDetailsCtrl(AuthService, $scope, buscarInformesBecariosService, $stateParams, IndicadoresMTService) {
        var id = $stateParams.id;
        
        //obtener el registro a mostrar
        buscarInformesBecariosService.getBecarioInternoById(id).then(
            function (result) {

                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
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