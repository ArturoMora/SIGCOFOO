(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('configuracionPeriodoAdd', ['$scope', 'AuthService', 'MenuService', 'comunCountService',
            'ngFabForm', 'configuracionPeriodoService', '$state', '$uibModal', 'adjuntarArchivo','correoNotificacionService', configuracionPeriodoAdd]);

    function configuracionPeriodoAdd($scope, AuthService, MenuService, comunCountService,
        ngFabForm, configuracionPeriodoService, $state, $uibModal, adjuntarArchivo, correoNotificacionService) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registro = {};
        $scope.comunidad = {};

        configuracionPeriodoService.getExistActivo().then(
                    function (result) {
                        if (result.data == true) {
                            $state.go("configuracionPeriodo");
                        }
                    });

        //Agregar
        $scope.agregar = function () {
            debugger;
            if ($scope.registro.fechaTerminoPlaneada <= $scope.registro.fechaInicioPlaneada) {
                toastr.error("La fecha de término debe ser mayor a la de inicio");
                return false;
            }
            var anio = $scope.registro.fechaInicioPlaneada.getFullYear();
            var fecha = "31/12/" + anio;
            if ($scope.registro.fechaTerminoPlaneada.getFullYear() > anio) {
                toastr.error("La fecha de término debe estar comprendida hasta "+ fecha);
                return false;
            }

            $scope.registro.estado = true;
            configuracionPeriodoService.add($scope.registro).then(
                   function (result) {
                       var Mail = {
                           "Modulo": "Gestión de la Innovación",
                           "TipoCorreo": "GINotificacionPeriodoAbierto"
                       }
                       correoNotificacionService.mailNotificacion(Mail);
                       toastr.success(result.data);
                       $state.go("configuracionPeriodo");
                   },
                   function (error) {
                       debugger;
                       toastr.error(error.data.message);
                       $scope.desabilitar = false;
                   });
        }
    }
}());