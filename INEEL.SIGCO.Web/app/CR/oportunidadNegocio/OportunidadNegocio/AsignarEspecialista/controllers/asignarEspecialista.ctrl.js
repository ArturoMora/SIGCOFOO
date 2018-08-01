/// <reference path="oportunidadNegocioAdd.ctrl.js" />
(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("AsignarEspecialistaCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "ContactosCRService",
        "OportunidadNegocioCRService",
         AsignarEspecialistaCtrl
    ]);

    function AsignarEspecialistaCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //$scope.fechaActual = new Date();
        var auxFecha = new Date();
        $scope.fechaActual = new Date(auxFecha.getFullYear().toString() + '-' + (auxFecha.getMonth() + 1).toString() + '-' + auxFecha.getDate().toString() + '-00:00:00');
        $scope.contactoInsert = {};
        
        $scope.oportunidadEspecialista = $scope.oportunidad;


        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual

        if ($scope.oportunidadEspecialista.fechaMaximaAtencion != null) {
            var fecha = new Date($scope.oportunidadEspecialista.fechaMaximaAtencion);
            $scope.oportunidadEspecialista.fechaMaximaAtencion = fecha;
        }

        OportunidadNegocioCRService.getPersonasByIdRolTrue().then(
               function (result) {
                   $scope.especialistas = result.data;
               },
               function (err) {
                   console.error(err);
               }
           );

        $scope.asignarOportunidad = function () {
            if ($scope.oportunidadEspecialista.persona == null ) {
                toastr.error("Debe seleccionar el especialista");
                return false;
            }
            debugger;
            if ($scope.oportunidadEspecialista.fechaMaximaAtencion < $scope.fechaActual) {
                toastr.error("La fecha no debe ser menor a la actual");
                return false;
            }
            var paterno, materno, nombre;

            paterno = $scope.oportunidad.persona.persona.apellidoPaterno;
            materno = $scope.oportunidad.persona.persona.apellidoMaterno;
            nombre = $scope.oportunidad.persona.persona.nombre;

            $scope.oportunidadEspecialista.especialista = $scope.oportunidad.persona.clavePersona;
            $scope.oportunidadEspecialista.nombreEspecialista = paterno +' '+ materno +' '+ nombre;
            $scope.oportunidadEspecialista.estadoFlujoONId = 12;
            OportunidadNegocioCRService.updateOportunidad($scope.oportunidadEspecialista).then(
                    function (result) {
                        toastr.success("Oportunidad asignada al especialista correctamente");

                        ContactosCRService.getContacto($scope.oportunidad.contactoId).then(
                        function (result) {
                            $scope.contactoInsert = result.data;
                            $scope.enviarCorreo();
                        },
                        function (err) {
                            toastr.error(data.InnerException.Message);
                        });

                        if ($scope.oportunidadEspecialista.notificar == true) {
                            $scope.notificarme();
                        }

                        
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargar();
                       
                    },
                    function (err) {
                        toastr.error(data.InnerException.Message);
                    });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.enviarCorreo = function () {
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
                "Descripcion8": $scope.oportunidad.fechaMaximaAtencion,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Nueva oportunidad de negocio asignada a usted",
                "ClavePersona": $scope.oportunidadEspecialista.especialista,
                "TipoCorreo": "OportunidadNegocioNotificarEspecialista"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarme = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2":  $scope.oportunidadEspecialista.nombreEspecialista,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": "- Oportunidad de negocio asignada a especialista",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarPorEspecialista"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();

