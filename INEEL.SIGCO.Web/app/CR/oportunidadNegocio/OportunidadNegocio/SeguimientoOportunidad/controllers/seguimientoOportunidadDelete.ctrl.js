/// <reference path="oportunidadNegocioAdd.ctrl.js" />
(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("SeguimientoOportunidadDeleteCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "MenuService",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "ContactosCRService",
        "OportunidadNegocioCRService",
         SeguimientoOportunidadDeleteCtrl
    ]);

    function SeguimientoOportunidadDeleteCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.fechaActual = new Date();

        $scope.ok = function () {
            OportunidadNegocioCRService.deleteSeguimiento($scope.id).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.cancel();
                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.recargarActividades();
        };

        $scope.enviarCorreo = function () {
            $scope.oportunidad.fecha = new Date($scope.oportunidad.fecha);
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.fecha,
                "Descripcion3": $scope.contactoInsert.nombreCompleto,
                "Descripcion4": $scope.contactoInsert.empresa.nombreEmpresa,
                "Descripcion5": $scope.contactoInsert.telefono,
                "Descripcion6": $scope.contactoInsert.correo,
                "Descripcion7": $scope.oportunidad.descripcion,
                "tituloON": "- Nueva oportunidad de negocio registrada",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "Seccion": "Oportunidad",
                "TipoCorreo": "OportunidadNegocioCreate"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();
