(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("ponenciaCtrlDetailsGerente", ['AuthService', '$scope', '$rootScope', 'PonenciaService', "$stateParams", "globalGet", "$state", ponenciaCtrlDetailsGerente]);

    function ponenciaCtrlDetailsGerente(AuthService, $scope, $rootScope, PonenciaService, $stateParams, globalGet, $state) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";



        $scope.justificacion="";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        $scope.AutoresIIERegistrados = "";

        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        PonenciaService.getbyid(id).then(
            function (result) {
                PonenciaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                PonenciaService.getByPonencia(result.data.ponenciaId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                PonenciaService.getByPonenciaExt(result.data.ponenciaId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
            },
            function (error) {
                toastr.error(error);
            });


        PonenciaService.obtenAdminCh().then(
         function (result) {
             $scope.adminCH = result.data;
         },
         function (error) {
             toastr.error(error);
         });




        $scope.save = function (opc) {
            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }
            var clavesCorreo = "";
            if (opc == 1) {
                clavesCorreo = $scope.registro.clavePersona + "," + AuthService.authentication.userprofile.clavePersona + "," + $scope.adminCH.clavePersona;
            } else {
                clavesCorreo = $scope.registro.clavePersona + "," + AuthService.authentication.userprofile.clavePersona;
            }


            for (var i = 0; i < $scope.autoriie.length; i++) {
                $scope.AutoresIIERegistrados = $scope.AutoresIIERegistrados + $scope.autoriie[i].clavePersona + ",";
            }

                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombrePersona,
                    "Seccion": "Ponencia",
                    "TipoCorreo": "NotificacionesGerente",
                    "ClavePersona": clavesCorreo,
                    "Descripcion1": "<b>Congreso:</b> " + $scope.registro.congreso.nombreCongreso + "<br/>",
                    "Descripcion2": "<b>Titulo de ponencia:</b> " + $scope.registro.tituloPonencia + "<br/>",
                    "Descripcion3": "<b>Nivel de ponencia:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
                    "Descripcion4": "<b>Estado de ponencia:</b> " + $scope.registro.estadoPonencia.descripcion,
                    "Justificacion": $scope.justificacion,
                    "coautores": $scope.AutoresIIERegistrados,
                    "Estado": ""
                }

                //var MailGerente = {
                //    "Modulo": "Capital Humano",
                //    "Empleado": $scope.registro.nombrePersona,
                //    "Seccion": "Ponencia",
                //    "TipoCorreo": "NotificacionesGerente",
                //    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                //    "Descripcion1": "<b>Congreso:</b> " + $scope.registro.congreso.nombreCongreso + "<br/>",
                //    "Descripcion2": "<b>Titulo de ponencia:</b> " + $scope.registro.tituloPonencia + "<br/>",
                //    "Descripcion3": "<b>Nivel de ponencia:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
                //    "Descripcion4": "<b>Estado de ponencia:</b> " + $scope.registro.estadoPonencia.descripcion,
                //    "Justificacion": $scope.justificacion,
                //    "Estado": ""
                //}

                //var MailAdminCH = {
                //    "Modulo": "Capital Humano",
                //    "Empleado": $scope.registro.nombrePersona,
                //    "Seccion": "Ponencia",
                //    "TipoCorreo": "NotificacionesGerente",
                //    "ClavePersona": $scope.adminCH.clavePersona,
                //    "Descripcion1": "<b>Congreso:</b> " + $scope.registro.congreso.nombreCongreso + "<br/>",
                //    "Descripcion2": "<b>Titulo de ponencia:</b> " + $scope.registro.tituloPonencia + "<br/>",
                //    "Descripcion3": "<b>Nivel de ponencia:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
                //    "Descripcion4": "<b>Estado de ponencia:</b> " + $scope.registro.estadoPonencia.descripcion,
                //    "Justificacion": $scope.justificacion,
                //    "Estado": ""
                //}

                switch (opc) {
                    case 1:
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 2
                        }
                        $scope.registro.estadoFlujoId = 2;
                        PonenciaService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Aprobada!");
                                PonenciaService.updateSolicitud(registro).then(
                            function (result) {
                                var Bitacora = {
                                    "SolicitudId": registro.solicitudId,
                                    //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                    "FechaMovimiento": new Date(),
                                    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                    "Descripcion": "Aprobado: "+$scope.justificacion,
                                    "EstadoFlujoId": 8,
                                    "idRol": 4
                                }
                                PonenciaService.AddBitacoraSolicitud(Bitacora);
                                Mail.Estado = "Aprobada"

                                PonenciaService.mailNotificacionConCoautores(Mail);
                                //PonenciaService.mailNotificacion(MailGerente);
                                //PonenciaService.mailNotificacion(MailAdminCH);

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
                        PonenciaService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                PonenciaService.updateSolicitud(registro).then(
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
                                PonenciaService.AddBitacoraSolicitud(Bitacora);
                                Mail.Estado = "Rechazada"
                                PonenciaService.mailNotificacionConCoautores(Mail);
                                //PonenciaService.mailNotificacion(MailGerente);
                                //PonenciaService.mailNotificacion(MailAdminCH);
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