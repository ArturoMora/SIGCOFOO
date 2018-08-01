(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("participacionCtrlDetailsGerente", ['AuthService', '$scope', 'ParticipacionService', "$stateParams", "globalGet","$rootScope","$state", participacionCtrlDetailsGerente]);

    function participacionCtrlDetailsGerente(AuthService, $scope, ParticipacionService, $stateParams, globalGet, $rootScope, $state) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        ParticipacionService.getbyid(id).then(
           function (result) {
               ParticipacionService.Persona(result.data.clavePersona).then(
               function (result) {
                   $scope.registro.nombrePersona = result.data.nombreCompleto;
               });
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

        $scope.save = function (opc) {
            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }
            var Mail = {
                "Modulo": "Capital Humano",
                "Empleado": $scope.registro.nombrePersona,
                "Seccion": "Participación en Proyecto",
                "TipoCorreo": "NotificacionesGerente",
                "ClavePersona": $scope.registro.clavePersona,
                "Descripcion1": "<b>Proyecto:</b> " + $scope.registro.proyectoId + "<br/>",
                "Descripcion2": "<b>Nombre de Proyecto:</b> " + $scope.registro.proyecto.nombre + "<br/>",
                "Descripcion3": "<b>Participación:</b> " + $scope.registro.participacion,
                "Descripcion4": "",
                "Justificacion": $scope.justificacion,
                "Estado": "",
                "UnidadOrganizacionalId": $scope.registro.proyecto.unidadOrganizacionalId
            }
            switch (opc) {
                case 1:
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 3
                    }
                    $scope.registro.estadoFlujoId = 3;
                    $scope.registro.fechaValidacion = new Date();
                    ParticipacionService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            ParticipacionService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": 8,
                                "idRol": 4
                            }
                            ParticipacionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            ParticipacionService.mailNotificacion(Mail);
                            $state.go("solicitudesrh");
                        })
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                    break;
                case 2:
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 1
                    }
                    $scope.registro.estadoFlujoId = 1
                    ParticipacionService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Rechazada!");
                            ParticipacionService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Rechazado: " + $scope.justificacion,
                                "EstadoFlujoId": 8,
                                "idRol": 4
                            }
                            ParticipacionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Rechazada"
                            ParticipacionService.mailNotificacion(Mail);
                            $state.go("solicitudesrh");
                        })
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                    break;
            }
        }
    }
})();