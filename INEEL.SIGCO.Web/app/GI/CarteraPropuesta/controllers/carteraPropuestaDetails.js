(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("carteraPropuestaDetail", ['AuthService', '$scope', 'carteraPropuestaService', "globalGet", "$rootScope", "MenuService", "solicitudesGIService", "bitacoraSolicitudService", "correoNotificacionService", "$state", "planNegocioService", "miembrosGEService", carteraPropuestaDetail]);

    function carteraPropuestaDetail(AuthService, $scope, carteraPropuestaService, globalGet, $rootScope, MenuService, solicitudesGIService, bitacoraSolicitudService, correoNotificacionService, $state, planNegocioService, miembrosGEService) {
        window.scrollTo(0, 0);
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        var id = $rootScope.getGlobalID();

        //Verificamos si la propuesta fue aprobada previamente...
        bitacoraSolicitudService.getbyidAprobadaAntes(29, id).then(  //Propuestas externas (sin plan de negocio)
            function (result) {
                $scope.bitacoraPropuesta = result.data;
                debugger;
                if (result.data.length == 0) {
                    bitacoraSolicitudService.GetEstadoAprobadaByInfo(32, id).then(  //propuestas internas
                        function (result) {
                            if (result.data != null) {
                                $scope.bitacoraPropuesta.length = 1;
                            }
                            $scope.cargaRegistro();
                        });

                } else {
                    $scope.cargaRegistro();
                }

            });

        $scope.id2 = $rootScope.getGlobalID2();
        //var id = $stateParams.id; //id no de la propuesta si no de la Idea, asumiendo que es una idea por propuesta
        //$scope.id2 = $stateParams.id2;
        $scope.registroPropuesta = {};
        $scope.registroPlan = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        // $scope.GetJustificacionSolicitudRechazada = function () {
        //     bitacoraSolicitudService.GetJustificacionSolicitudRechazada($scope.registroPropuesta.id).then(
        //         function (res) {
        //             $scope.evaluacionPropuesta = res.data;
        //         }, function (err) {
        //             console.log(err);
        //         }
        //     );
        // }

        // $scope.GetJustificacionSolicitudAceptada = function () {
        //     bitacoraSolicitudService.GetJustificacionSolicitudAceptada($scope.registroPropuesta.id).then(
        //         function (res) {
        //             $scope.evaluacionPropuesta = res.data;
        //         }, function (err) {
        //             console.log(err);
        //         }
        //     );
        // }

        function GetJustificacionSolicitudPropuesta(estadoFlujo, estadoSolicitud, tipoInformacion) {
            var solicitud = {
                "informacionId": $scope.registroPropuesta.id,
                "estadoOC": estadoSolicitud,
                "nombreOC": "Propuesta",
                "tipoInformacionOC": tipoInformacion,
                "EstadoFlujoId": estadoFlujo
            };
            bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                function (res) {
                    $scope.evaluacionPropuesta = res.data;
                }, function (err) {
                    console.log(err);
                }
            );
        }

        function justificacionSolicitudPlan(estadoFlujo, estadoSolicitud) {
            var solicitud = {
                "informacionId": $scope.registroPlan.planNegocioEvolutivoId,
                "estadoOC": estadoSolicitud,
                "nombreOC": "Plan de Negocio Evolutivo",
                "tipoInformacionOC": 31,
                "EstadoFlujoId": estadoFlujo
            };

            //En caso de que a un plan aprobado se le hayan hecho actualizaciones (el plan nace junto con la propuesta, y posteriormente el plan puede seguir actualizandose)
            bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                function (res) {
                    $scope.evaluacionPlan = res.data;
                    //si no existe ninguna justificacion actual quiere decir que el plan no ha sufrido actualizaciones, por lo que ahora se tiene que obtener la justificacion que salio con la propuesta
                    if ($scope.evaluacionPlan == null) {
                        solicitud.tipoInformacionOC = 32;  //es el paquete de propuesta con plan de negocio juntos
                        solicitud.informacionId = $scope.registroPropuesta.id; //En caso de que no haya sufrido actualizaciones el plan
                        bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                            function (res) {
                                $scope.evaluacionPlan = res.data;
                            }, function (err) {
                                console.log(err);
                            }
                        );
                    }
                }, function (err) {
                    console.log(err);
                }
            );

        }

        //obtener el registro a mostrar
        $scope.cargaRegistro = function () {
            carteraPropuestaService.getPropuestaConIdeaByIdIdentity(id).then(
                function (result) {

                    $scope.registroPropuesta = result.data;
                    carteraPropuestaService.Persona(result.data.clavePersona).then(
                        function (result) {
                            $scope.registroPropuesta.nombrePersona = result.data.nombreCompleto;
                            if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                                $scope.expression = 'col-md-6 col-sm-6 col-xs-6';
                                $scope.requeridoPNE = true;
                            } else {
                                $scope.expression = 'col-md-12 col-sm-12 col-xs-12';
                                $scope.requeridoPNE = false;
                            }
                        });

                    if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                        //Obtener plan de negocio evolutivo
                        planNegocioService.getbyidPropuesta($scope.registroPropuesta.id).then(
                            function (result) {
                                debugger;
                                $scope.registroPlan = result.data;
                                //Para la justificacion del plan de negocio
                                if ($scope.registroPlan.estadoFlujoId == 10) {
                                    justificacionSolicitudPlan(10, "Aprobado");
                                }

                                if ($scope.registroPlan.estadoFlujoId == 15) {
                                    justificacionSolicitudPlan(15, "Rechazado");
                                }
                                if ($scope.registroPlan.adjunto == null) {
                                    $scope.regFile = true;
                                } else {
                                    $scope.regFile = false;
                                    $scope.archivos = 1;
                                }
                            },
                            function (error) {
                                toastr.error(error);
                                console.log(error);
                            });
                    }



                    //Justificacion de propuesta de innovacion
                    debugger;
                    if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                        if ($scope.registroPropuesta.estadoFlujoId == 15 && $scope.bitacoraPropuesta.length == 0) {
                            GetJustificacionSolicitudPropuesta(15, "Rechazado", 32);  //32 es la union de plan con propuesta 
                        }


                        if ($scope.registroPropuesta.estadoFlujoId == 15 && $scope.bitacoraPropuesta.length == 1) {
                            GetJustificacionSolicitudPropuesta(10, "Aprobada", 32);
                        }

                        if ($scope.registroPropuesta.estadoFlujoId == 10) {
                            GetJustificacionSolicitudPropuesta(10, "Aprobada", 32);
                        }
                    }
                    else {

                        //$scope.bitacoraPropuesta.length
                        if ($scope.registroPropuesta.estadoFlujoId == 15) {
                            GetJustificacionSolicitudPropuesta(15, "Rechazado", 29);  //29 es solamente propuesta
                        }


                        if ($scope.registroPropuesta.estadoFlujoId == 10) {
                            GetJustificacionSolicitudPropuesta(10, "Aprobada", 29);

                        }
                    }

                },
                function (error) {
                    toastr.error("Error al intentar cargar el registro");
                    console.log(error);
                });
        }




        $scope.Acciones = function (accion, nombreOC) {
            // valores de accion
            //1: rechazar
            //2: modificar
            //3: aprobar


            //Validaciones
            if ($scope.bitacoraPropuesta.length == 0) {
                if (($scope.justificacion == null || $scope.justificacion == undefined)) {
                    toastr.error("Agrega una justificación a la propuesta");
                    return false;
                }
            } else {
                if (($scope.justificacionPlan == null || $scope.justificacionPlan == undefined)) {
                    toastr.error("Agrega una justificación al plan de negocio evolutivo");
                    return false;
                }
            }
            $scope.principalProponente = $scope.registroPropuesta.claveProponentePrincipal;


            var seccionOC = "Propuesta de Innovación";
            if (nombreOC == "plan") {
                seccionOC = "Plan de Negocio Evolutivo"
            }

            

            switch (accion) {

                case 1:
                    var registro = {
                        "solicitudId": $scope.id2,
                        "estadoFlujoId": 15
                    }

                    $scope.registroPropuesta.estadoFlujoId = 15;
                    //Si es una propuesta interna entonces en automatico se cambia el estado del plan de negocio evolutivo
                    if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true)) {
                        $scope.registroPlan.estadoFlujoId = 15;
                        planNegocioService.updateEstado($scope.registroPlan);
                    }

                    //Si la propuesta ya fue validada entonces se toma la justificacion del plan para agregarlo a la solicitud
                    var justiF = "";
                    if ($scope.bitacoraPropuesta.length == 1) {
                        justiF = $scope.justificacionPlan;
                    } else {
                        justiF = $scope.justificacion;
                    }

                    carteraPropuestaService.updateEstado($scope.registroPropuesta).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": $scope.id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Rechazado " + seccionOC,  //cambiar por el tipo de rechazo del oc
                                "EstadoFlujoId": 15,  //rechazado
                                "Justificacion": justiF
                            }
                            solicitudesGIService.updateSolicitud(registro).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true)) {
                                        seccionOC="Propuesta de Innovación / Plan de Negocio Evolutivo"
                                    }
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registroPropuesta.nombrePersona,
                                        "Seccion": seccionOC, //"Propuesta de Innovación",
                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                        "Estado": "rechazada",
                                        "Descripcion1": $scope.principalProponente,
                                        "Descripcion2": justiF
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);

                                    toastr.success("Solicitud rechazada!");
                                    $state.go("solicitudesGI");
                                })
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al rechazar");
                            $state.reload();
                        });
                    break;
                case 2:
                    var registro = {
                        "solicitudId": $scope.id2,
                        "estadoFlujoId": 1
                    }

                    //Si la propuesta ya fue aprobada entonces se toma la justificacion del plan para agregarlo a la solicitud
                    var justiF = "";
                    if ($scope.bitacoraPropuesta.length == 1) {
                        justiF = $scope.justificacionPlan;
                    } else {
                        justiF = $scope.justificacion;
                    }



                    $scope.registroPropuesta.EstadoFlujoId = 1;
                    carteraPropuestaService.updateEstado($scope.registroPropuesta).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": $scope.id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Se envió a modificación " + seccionOC,
                                "EstadoFlujoId": 6,  //modificacion
                                "Justificacion": justiF
                            }
                            solicitudesGIService.updateSolicitud(registro).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true)) {
                                        seccionOC="Propuesta de Innovación / Plan de Negocio Evolutivo"
                                    }
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registroPropuesta.nombrePersona,
                                        "Seccion": seccionOC, //"Propuesta de Innovación",  //Este es el oc que va a cambiar dependiendo de lo que se haya validado
                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                        "Estado": "enviada a modificación",  //Accion que toma la solicitud
                                        "Descripcion1": $scope.principalProponente,
                                        "Descripcion2": justiF  //justificacion del admin
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
                                    toastr.success("Solicitud actualizada!");
                                    $state.go("solicitudesGI");
                                })
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al rechazar");
                            $state.reload();
                        });
                    break;
                case 3:


                    //CASO 1: PROPUESTA INTERNA CON FONDO FYCIDET (para este caso primero se valida la propuesta y despues el plan, ver caso 3)
                    if ($scope.bitacoraPropuesta.length == 0 && ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) && $scope.registroPropuesta.fondo == 1) {
                        //Cuando nunca se a aprobado la cartera de propuesta
                        var Bitacora = {
                            "SolicitudId": $scope.id2,
                            "FechaMovimiento": new Date('dd/MM/yyyy'),
                            "ClavePersona": $scope.ClavePersonaLogin,
                            "Descripcion": "Aprobada " + seccionOC,
                            "EstadoFlujoId": 10,
                            "Justificacion": $scope.justificacion
                        }
                        bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora).then(
                            function (result) {
                                $state.reload();
                            });
                    }
                    else {
                        //CASO 2: PROPUESTA EXTERNA
                        if ($scope.registroPropuesta.propuestaInterna == 'false' || $scope.registroPropuesta.propuestaInterna == false) {
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 10
                            }
                            $scope.registroPropuesta.estadoFlujoId = 10;
                            carteraPropuestaService.updateEstado($scope.registroPropuesta).then(
                                function (result) {
                                    solicitudesGIService.updateSolicitud(registro).then(
                                        function (result) {
                                            toastr.success("Solicitud aprobada!");
                                            $state.go("solicitudesGI");
                                        });
                                });
                            var Bitacora = {
                                "SolicitudId": $scope.id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Aprobada " + seccionOC,
                                "EstadoFlujoId": 10,
                                "Justificacion": $scope.justificacion,
                            }
                            bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                // function (result) {
                                //     $state.reload();
                                // });
                                var Mail = {
                                    "Modulo": "Gestión de la Innovación",
                                    "Empleado": $scope.registroPropuesta.nombrePersona,
                                    "Seccion": "Propuesta de Innovación",  //Quizas cambie el nombre de la seccion
                                    "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                    "ClavePersona": $scope.registroPropuesta.clavePersona,
                                    "Estado": "aprobada",
                                    "Descripcion1": $scope.principalProponente,
                                    "Descripcion2": $scope.justificacion
                                }
                                correoNotificacionService.mailNotificacion(Mail);

                        }
                        else {
                            //CASO 3: ESTO APLICA PARA 2 SITUACIONES, CUANDO YA FUE APROBADA LA PROPUESTA INTERNA (con fycidet) Y PARA PROPUESTAS INTERNAS CON OTRO FONDO
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 10
                            }

                            var justi = "";
                            if ($scope.bitacoraPropuesta.length == 0 && ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) && $scope.registroPropuesta.fondo == 0) {
                                justi = $scope.justificacion;
                            } else {
                                justi = $scope.justificacionPlan;
                            }

                            $scope.registroPropuesta.estadoFlujoId = 10;
                            $scope.registroPlan.estadoFlujoId = 10;
                            carteraPropuestaService.updateEstado($scope.registroPropuesta).then(
                                function (result) {
                                    planNegocioService.updateEstado($scope.registroPlan).then(
                                        function (result) {

                                            //Si la propuesta ya fue validada el mensaje se debe de cambiar, esto se va a guardar en la bitacora de solicitudes 
                                            var mensaje = "";
                                            if ($scope.bitacoraPropuesta.length == 0) {
                                                mensaje = "Aprobada " + seccionOC;
                                            } else {
                                                mensaje = "Aprobado " + seccionOC;
                                            }

                                            var Bitacora = {
                                                "SolicitudId": $scope.id2,
                                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                                "ClavePersona": $scope.ClavePersonaLogin,
                                                "Descripcion": mensaje,
                                                "EstadoFlujoId": 10,
                                                "Justificacion": justi
                                            }
                                            solicitudesGIService.updateSolicitud(registro).then(
                                                function (result) {
                                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                                    if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true)) {
                                                        seccionOC="Propuesta de Innovación / Plan de Negocio Evolutivo"
                                                    }
                                                    var Mail = {
                                                        "Modulo": "Gestión de la Innovación",
                                                        "Empleado": $scope.registroPropuesta.nombrePersona,
                                                        "Seccion": seccionOC,  //Quizas cambie el nombre de la seccion
                                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                        "Estado": "aprobada",
                                                        "Descripcion1": $scope.principalProponente,
                                                        "Descripcion2": justi
                                                    }
                                                    correoNotificacionService.mailNotificacion(Mail);
                                                    toastr.success("Solicitud aprobada!");
                                                    $state.go("solicitudesGI");
                                                })
                                        });
                                });
                        }
                    }


                    break;
            }

        }


        $scope.NotificarGrupo = function (opc) {

            var autores = [];
            var gerencias = [];
            if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {

                for (var o = 0; o < $scope.registroPlan.planNegocioEvolAutores.length; o++) {
                    autores.push($scope.registroPlan.planNegocioEvolAutores[o].nombre);
                }
                $scope.autoresFinalPNE = autores.join(',');


                for (var p = 0; p < $scope.registroPlan.planNegocioEvolGerencias.length; p++) {
                    gerencias.push($scope.registroPlan.planNegocioEvolGerencias[p].nombreUnidad);
                }

                $scope.gerenciasFinalPNE = gerencias.join(',');

                $scope.pnePintada = "<b>Plan de negocio evolutivo:</b>" + $scope.registroPlan.titulo + "<br /><b>Oferta de valor:</b>" + $scope.registroPlan.ofertaDeValor + "<br /><b>Tipo de acceso:</b>" + $scope.registroPlan.tipoAccesoGI.nombre + "<br /><b>Propuesta:</b>" + $scope.registroPlan.propuesta.nombreTecnico + "<br /><b>Autores:</b>" + $scope.autoresFinalPNE + "<br /><b>Gerencias:</b>" + $scope.gerenciasFinalPNE;
            }

            //1) Notificar al grupo evaluador ext
            //2) Notificar al grupo evaluador otro fondo
            //3) Notificar al grupo evaluador ficydet
            //4) Plan de negocio evolutivo
            var propuesta = "";
            var fondo = "";
            var idea = "";
            if ($scope.registroPropuesta.propuestaInterna == true) {
                propuesta = "Interna";
            } else {
                propuesta = "Externa";
            }

            if ($scope.registroPropuesta.fondo == 0) {
                fondo = "Otro";
            }
            if ($scope.registroPropuesta.fondo == 1) {
                fondo = "FICYDET";
            }
            if ($scope.registroPropuesta.fondo == 1) {
                idea = $scope.registroPropuesta.ideaInnovadora.nombreIdea;
            }

            $scope.propuestaPintada = "<b>Propuesta:</b>" + $scope.registroPropuesta.nombreTecnico + " ( " + $scope.registroPropuesta.propuestaId + " ) <br /><b>Proponente principal:</b>" + $scope.registroPropuesta.nombreProponentePrincipal + "<br /><b>Tipo de propuesta:</b>" + propuesta + "<br /><b>Fondo:</b>" + fondo + "<br /><b>Gerencia que lidera la propuesta:</b>" + $scope.registroPropuesta.nombreUnidadOrganizacional + "<br /><b>Empresa que promueve la propuesta (Instituto/Cliente):</b> " + $scope.registroPropuesta.empresaPromotorNombre + "<br /><b>Idea innovadora:</b>" + idea + " <br /><b>Segmento de mercado al que va dirigido:</b>" + $scope.registroPropuesta.segmentoMercadoNombre + "<br /><b>Tipo de acceso:</b>" + $scope.registroPropuesta.tipoAccesoGI.nombre;



            var correos = "";
            var seccion = "";
            var ruta = "";
            switch (opc) {
                case 1:
                    miembrosGEService.getCorreos(3).then(
                        function (result) {

                            correos = result.data;
                            seccion = "Propuesta de Innovación";
                            ruta = $scope.registroPropuesta.adjunto.rutaCompleta;
                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.registroPropuesta.nombrePersona,
                                "Seccion": seccion,
                                "TipoCorreo": "NotificarEvaluadores",
                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                "Estado": "aprobada",
                                "Descripcion1": correos,
                                "pathToAttachment": ruta,
                                "Descripcion2": $scope.propuestaPintada,
                                "Descripcion3": " Administrador de Gestión de la Innovación"

                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            toastr.success("Notificación enviada");
                        }, function (error) {
                            toastr.error(error);
                        });
                    break;
                case 2:
                    miembrosGEService.getCorreos(4).then(
                        function (result) {

                            correos = result.data;
                            seccion = "Propuesta de Innovación";
                            ruta = $scope.registroPropuesta.adjunto.rutaCompleta;
                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.registroPropuesta.nombrePersona,
                                "Seccion": seccion,
                                "TipoCorreo": "NotificarEvaluadores",
                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                "Estado": "aprobada",
                                "Descripcion1": correos,
                                "pathToAttachment": ruta,
                                "Descripcion2": $scope.propuestaPintada,
                                "Descripcion3": " Gerente de la propuesta innovadora"
                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            toastr.success("Notificación enviada");
                        }, function (error) {
                            toastr.error(error);
                        });
                    break;
                case 3:
                    miembrosGEService.getCorreos(5).then(
                        function (result) {

                            correos = result.data;
                            seccion = "Propuesta de Innovación";
                            ruta = $scope.registroPropuesta.adjunto.rutaCompleta;
                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.registroPropuesta.nombrePersona,
                                "Seccion": seccion,
                                "TipoCorreo": "NotificarEvaluadores",
                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                "Estado": "aprobada",
                                "Descripcion1": correos,
                                "pathToAttachment": ruta,
                                "Descripcion2": $scope.propuestaPintada,
                                "Descripcion3": " Administrador de Gestión de la Innovación"
                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            toastr.success("Notificación enviada");
                        }, function (error) {
                            toastr.error(error);
                        });
                    break;
                case 4:
                    miembrosGEService.getCorreos(6).then(
                        function (result) {

                            correos = result.data;
                            seccion = "Plan de Negocio Evolutivo";
                            var p = [];
                            for (var i = 0; i < $scope.registroPlan.planNegocioEvolArchivos.length; i++) {
                                p.push($scope.registroPlan.planNegocioEvolArchivos[i].adjunto.rutaCompleta);
                            }
                            ruta = p.join('$');

                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.registroPropuesta.nombrePersona,
                                "Seccion": seccion,
                                "TipoCorreo": "NotificarEvaluadores",
                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                "Estado": "aprobada",
                                "Descripcion1": correos,
                                "pathToAttachment": ruta,
                                "Descripcion2": $scope.pnePintada,
                                "Descripcion3": " Administrador de Gestión de la Innovación"
                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            toastr.success("Notificación enviada");
                        }, function (error) {
                            toastr.error(error);
                        });
                    break;

            }


        }

    }
})();