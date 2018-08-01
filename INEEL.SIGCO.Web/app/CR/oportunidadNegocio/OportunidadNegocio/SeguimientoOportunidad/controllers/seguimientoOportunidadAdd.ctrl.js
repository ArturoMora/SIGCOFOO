(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SeguimientoOportunidadAddCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "$uibModalInstance",
            "OportunidadNegocioCRService",
            SeguimientoOportunidadAddCtrl
        ]);

    function SeguimientoOportunidadAddCtrl(AuthService, $scope, $uibModal, $uibModalInstance, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.seguimiento = {};

        $scope.seguimiento.investigadorId = $scope.oportunidad.claveEmpleado;
        $scope.seguimiento.claveUnidad = $scope.oportunidad.claveUnidad;
        $scope.seguimiento.oportunidadNegocioId = $scope.oportunidad.oportunidadNegocioId;

        $scope.ok = function () {
            if ($scope.ActividadAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                OportunidadNegocioCRService.createSeguimiento($scope.seguimiento).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.cancel();
                        $scope.recargarActividades();
                        $scope.enviarCorreos();
                        $scope.limpiar();
                    },
                    function (err) {
                        toastr.error(data.InnerException.Message);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.limpiar = function () {
            $scope.seguimiento.actividad = "";
            $scope.seguimiento.fechaRegistro = "";
        }

        $scope.enviarCorreos = function () {
            //notificar Especialista
            debugger;
            var MailEspecialista = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": $scope.seguimiento.actividad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio nueva actividad agregada por investigador",
                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "SeguimientoNotificarEspecialista"
            }
            OportunidadNegocioCRService.mailNotificacion(MailEspecialista);

            //notificar al empleado
            debugger;
            if ($scope.oportunidad.notificar == true) {
                var MailEmpleado = {
                    "Modulo": "Capital Relacional",
                    "Empleado": $scope.oportunidad.autor,
                    "Descripcion1": $scope.oportunidad.nombreOportunidad,
                    "Descripcion2": $scope.nombreEmpleado,
                    "Descripcion3": $scope.seguimiento.actividad,
                    "Seccion": "Oportunidad de Negocios",
                    "tituloON": " - Oportunidad de Negocio nueva actividad agregada por investigador",
                    "ClavePersona": $scope.oportunidad.claveEmpleado,
                    "TipoCorreo": "SeguimientoNotificarEmpleado"
                }
                OportunidadNegocioCRService.mailNotificacion(MailEmpleado);
            }

            //notificar responsable de unidad
            var MailResponsable = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": $scope.seguimiento.actividad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio nueva actividad agregada por investigador",
                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "SeguimientoNotificarResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(MailResponsable);

            //notificar al administrador
            var MailAdministrador = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": $scope.seguimiento.actividad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio nueva actividad agregada por investigador",
                //"ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "SeguimientoNotificarAdministrador"
            }
            OportunidadNegocioCRService.mailNotificacion(MailAdministrador);
        }
    }
})();
