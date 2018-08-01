/// <reference path="oportunidadNegocioAdd.ctrl.js" />
(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("SeguimientoOportunidadEditCtrl", [
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
         SeguimientoOportunidadEditCtrl
    ]);

    function SeguimientoOportunidadEditCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.fechaActual = new Date();

        $scope.seguimiento;
        $scope.seguimiento.fechaRegistro = new Date($scope.seguimiento.fechaRegistro);

        $scope.ok = function () {
            if ($scope.ActividadEditForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                debugger;
                OportunidadNegocioCRService.updateSeguimiento($scope.seguimiento).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.cancel();
                    $scope.limpiar();
                    $scope.recargarActividades();
                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.recargarActividades();
        };

        $scope.limpiar = function () {
            $scope.seguimiento.actividad = "";
            $scope.seguimiento.fechaRegistro = "";
        }

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
