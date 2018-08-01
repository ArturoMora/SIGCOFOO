(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("carteraPropuestaEdit", ['AuthService', '$scope', '$rootScope', 'solicitudesGIService',
            'carteraPropuestaService', '$uibModal', '$timeout', 'correoNotificacionService', 'buscarPropuestaFactory',
            'bitacoraSolicitudService', 'MenuService', 'adjuntarArchivo', 'tipoAccesoService', 'buscarIdeaFactory',
            '$state', 'planNegocioService', carteraPropuestaEdit]);

    function carteraPropuestaEdit(AuthService, $scope, $rootScope, solicitudesGIService,
        carteraPropuestaService, $uibModal, $timeout, correoNotificacionService, buscarPropuestaFactory,
        bitacoraSolicitudService, MenuService, adjuntarArchivo, tipoAccesoService, buscarIdeaFactory,
        $state, planNegocioService) {
        $scope.rolId = MenuService.getRolId();
        window.scrollTo(0, 0);
        var id = $rootScope.getGlobalID();
        var contadorAutores = 0;
        var contadorAreas = 0;
        $scope.registroPlan = {};
        $scope.nombreCompleto = AuthService.authentication.userprofile.nombreCompleto;


        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        /////////////////////////////////////
        $scope.accion = '';
        $scope.autoresPNE = [];
        $scope.gerenciasAux = [];
        $scope.ArchivosAux = [];
        $scope.registroPlan = {};
        $scope.registroPlan.proyectoNombre = "";
        $scope.registroPlan.planNegocioEvolAutores = [];
        $scope.registroPlan.planNegocioEvolGerencias = [];
        $scope.registroPlan.planNegocioEvolArchivos = [];
        $scope.propuesta = {};
        $scope.tipoMensaje = "advertencia";  //para cambiar los estilos de las justificaciones dinamicamente
        ////////////////////////////////////

        $scope.fondos = [
            { "valor": 0, "descripcion": "Otro" }, { "valor": 1, "descripcion": "FICYDET" }];

        // $scope.retroAlimentacionGerencia = function () {
        //     bitacoraSolicitudService.GetJustificacionSolicitudAModificar($scope.registroPropuesta.id).then(
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


        function GetJustificacionSolicitudPlan(estadoFlujo, estadoSolicitud, tipoInformacion) {
            var solicitud = {
                "informacionId": $scope.registroPropuesta.id,
                "estadoOC": estadoSolicitud,
                "nombreOC": "Plan",
                "tipoInformacionOC": tipoInformacion,
                "EstadoFlujoId": estadoFlujo
            };
            bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                function (res) {
                    debugger;
                    $scope.evaluacionPlan = res.data;
                }, function (err) {
                    console.log(err);
                }
            );
        }

        $scope.verificaCompletesPlanNegocio = function () {
            $scope.planCompleto = true;
            //Archivos
            if ($scope.registroPlan.planNegocioEvolArchivos == undefined || $scope.registroPlan.planNegocioEvolArchivos.length == 0) {
                $scope.planCompleto = false;
            }
            //Gerencias
            if ($scope.registroPlan.planNegocioEvolGerencias == undefined || $scope.registroPlan.planNegocioEvolGerencias.length == 0) {
                $scope.planCompleto = false;
            }
            //Autores
            if ($scope.registroPlan.planNegocioEvolAutores == undefined || $scope.registroPlan.planNegocioEvolAutores.length == 0) {
                $scope.planCompleto = false;
            }
            //Oferta de valor
            if ($scope.registroPlan.ofertaDeValor == undefined || $scope.registroPlan.ofertaDeValor == null) {
                $scope.planCompleto = false;
            }
            //Tema
            if ($scope.registroPlan.tema == undefined || $scope.registroPlan.tema == null) {
                $scope.planCompleto = false;
            }

        }

        $scope.cargaPlanNegocioEvolutivo = function () {
            debugger;
            planNegocioService.getbyidPropuesta($scope.registroPropuesta.id).then(
                function (result) {
                    $scope.registroPlan = result.data;
                    contadorAutores = $scope.registroPlan.planNegocioEvolAutores.length;
                    contadorAreas = $scope.registroPlan.planNegocioEvolGerencias.length;

                    if ($scope.registroPlan.proyecto != null) { $scope.registroPlan.proyectoNombre = $scope.registroPlan.proyecto.nombre; }
                    if ($scope.registroPlan.propuesta != null) {
                        $scope.propuesta = $scope.registroPlan.propuesta;
                        $scope.propuesta.nombre = $scope.propuesta.nombreTecnico;
                        $scope.propuesta.propuestaClave = $scope.registroPlan.propuestaClave;
                    }


                    $scope.verificaCompletesPlanNegocio();
                    //Propuesta interna previamente validada 
                    debugger;
                    if ($scope.bitacoraPropuesta.length == 1) {  //Propuesta aprobada pero plan pendiete de aprobacion....
                        GetJustificacionSolicitudPlan(6, "modificación", 32);
                    }

                },
                function (error) {
                    toastr.error(error);
                    console.log(error);
                });
        }

        $scope.cargaRegistro = function () {

            carteraPropuestaService.getPropuestaConIdeaByIdIdentity(id).then(
                function (result) {
                    $scope.registroPropuesta = result.data;

                    carteraPropuestaService.Persona($scope.registroPropuesta.claveProponentePrincipal).then(
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

                    if ($scope.registroPropuesta.propuestaInterna == "true" || $scope.registroPropuesta.propuestaInterna == true) {
                        $scope.cargaPlanNegocioEvolutivo();
                    }

                    $scope.registroPropuesta.propuestaIdAux = $scope.registroPropuesta.propuestaId;
                    $scope.registroPropuesta.propuestaInterna = $scope.registroPropuesta.propuestaInterna + "";
                    if ($scope.registroPropuesta.ideaInnovadora != null || $scope.registroPropuesta.ideaInnovadora != undefined) {
                        $scope.itemIdea.nombreIdea = $scope.registroPropuesta.ideaInnovadora.nombreIdea;
                    }
                    if ($scope.registroPropuesta.adjuntoId == null) {
                        $scope.regFile = true;
                    } else {
                        $scope.regFile = false;
                    }

                    if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                        //Propuesta interna enviada a modificacion
                        if ($scope.registroPropuesta.estadoFlujoId == 1 && $scope.bitacoraPropuesta.length == 0) {  //Estado de edicion (en el registro)
                            GetJustificacionSolicitudPropuesta(6, "modificación", 32);
                        }


                        //Propuesta interna previamente validada 
                        if ($scope.bitacoraPropuesta.length == 1) {  //Propuesta aprobada pero plan pendiete de aprobacion....
                            GetJustificacionSolicitudPropuesta(10, "Aprobada", 32);
                            $scope.tipoMensaje = "informacion";
                        }
                    } else {
                        //Propuesta externa enviada a modificacion
                        if ($scope.registroPropuesta.estadoFlujoId == 1) {  //Estado de edicion (en el registro)
                            GetJustificacionSolicitudPropuesta(6, "modificación", 29);  //29 es solamente propuesta  <== estados de bitacora
                        }

                    }

                },
                function (error) {
                    toastr.error(error);
                    console.log(error);
                });
        }

        bitacoraSolicitudService.getbyidAprobadaAntes(29, id).then(   //En caso de que sea propuesta externa
            function (result) {
                $scope.bitacoraPropuesta = result.data;
                if ($scope.bitacoraPropuesta.length == 0) {
                    $scope.mostrar = true;
                    bitacoraSolicitudService.GetEstadoAprobadaByInfo(32, id).then(  //propuestas internas (con plan de negocio incluido)
                        function (result) {
                            if (result.data != null) {
                                $scope.bitacoraPropuesta.length = 1;
                                //Importante .... Si la propuesta ya fue validada entonces los atributos de ella deben de estar desactivados
                                $scope.mostrar = false;
                            }
                            $scope.cargaRegistro();

                        });
                }
                else {
                    //Importante .... Si la propuesta ya fue validada entonces los atributos de ella deben de estar desactivados
                    $scope.mostrar = false;
                    $scope.cargaRegistro();
                }


            });








        //actualizar
        $scope.submitForm = function (opt) {
            if (opt == "actualizar") {
                $scope.actualizar();
            } else if (opt == "validarAdmin") {
                $scope.validar();
            } else { alert("Opción incorrecta"); };
        }



        $scope.actualizar = function () {

            if ($scope.registroPropuesta.propuestaInterna == "true") {
                if ($scope.propuesta != null) {
                    $scope.registroPlan.propuestaClave = $scope.propuesta.propuestaClave;
                } else {
                    $scope.registroPlan.propuestaClave = null;
                }

                // for(var c=0;c<$scope.registroPlan.planNegocioEvolAutores.length;c++){
                //     if($scope.registroPlan.planNegocioEvolAutores[i].nombre = "eliminar";)
                // }


                if ($scope.registroPlan.planNegocioEvolAutores == undefined || $scope.registroPlan.planNegocioEvolAutores == null || $scope.registroPlan.planNegocioEvolAutores.length == 0 || contadorAutores == 0) {
                    toastr.error("Agregue al menos un autor del plan de negocio evolutivo");
                    return false;
                }
                if ($scope.registroPlan.planNegocioEvolGerencias == undefined || $scope.registroPlan.planNegocioEvolGerencias == null || $scope.registroPlan.planNegocioEvolGerencias == 0 || contadorAreas == 0) {
                    toastr.error("Agregue al menos una unidad organizacional del plan de negocio evolutivo");
                    return false;
                }
                if ($scope.registroPlan.planNegocioEvolArchivos == undefined || $scope.registroPlan.planNegocioEvolArchivos == null || $scope.registroPlan.planNegocioEvolArchivos == 0) {
                    toastr.error("Adjunte al menos una evidencia del plan de negocio evolutivo");
                    return false;
                }
                for (var i = 0; i < $scope.gerenciasAux.length; i++) {
                    $scope.registroPlan.planNegocioEvolGerencias.push($scope.gerenciasAux[i]);
                }

                for (var i = 0; i < $scope.ArchivosAux.length; i++) {
                    $scope.registroPlan.planNegocioEvolArchivos.push($scope.ArchivosAux[i]);
                }

            }

            if ($scope.registroPropuesta.propuestaInterna == false || $scope.registroPropuesta.propuestaInterna == "false") {
                //En caso de que hayamos creado una propuesta con un plan (propuesta interna), y posteriormente se cambie a propuesta externa
                if ($scope.registroPlan.planNegocioEvolutivoId != undefined) {
                    planNegocioService.delete($scope.registroPlan.planNegocioEvolutivoId).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {
                                    toastr.success("Registro actualizado");
                                    $state.reload();
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al actualizar");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                } else {
                    $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                    carteraPropuestaService.update($scope.registroPropuesta).then(
                        function (result) {
                            toastr.success("Registro actualizado");
                            $state.reload();
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al actualizar");
                            $state.reload();
                        });
                }
            } else {
                if ($scope.registroPlan.propuestaClave == undefined) {
                    $scope.registroPlan.propuestaClave = $scope.registroPropuesta.id;
                    planNegocioService.add($scope.registroPlan).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {
                                    toastr.success("Registro actualizado");
                                    $state.reload();
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al actualizar");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                } else {

                    planNegocioService.update($scope.registroPlan).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {
                                    toastr.success("Registro actualizado");
                                    $state.reload();
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al actualizar");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                }
            }

        }
        //var recargar=function(){ $state.reload();};


        // validar
        $scope.validar = function () {

            if ($scope.registroPropuesta.propuestaInterna == "true") {
                if ($scope.propuesta != null) {
                    $scope.registroPlan.propuestaClave = $scope.propuesta.propuestaClave;
                } else {
                    $scope.registroPlan.propuestaClave = null;
                }

                if ($scope.registroPlan.planNegocioEvolAutores == undefined || $scope.registroPlan.planNegocioEvolAutores == null || $scope.registroPlan.planNegocioEvolAutores.length == 0 || contadorAutores == 0) {
                    toastr.error("Agregue al menos un autor del plan de negocio evolutivo");
                    return false;
                }
                if ($scope.registroPlan.planNegocioEvolGerencias == undefined || $scope.registroPlan.planNegocioEvolGerencias == null || $scope.registroPlan.planNegocioEvolGerencias == 0 || contadorAreas == 0) {
                    toastr.error("Agregue al menos una unidad organizacional del plan de negocio evolutivo");
                    return false;
                }
                if ($scope.registroPlan.planNegocioEvolArchivos == undefined || $scope.registroPlan.planNegocioEvolArchivos == null || $scope.registroPlan.planNegocioEvolArchivos == 0) {
                    toastr.error("Adjunte al menos una evidencia del plan de negocio evolutivo");
                    return false;
                }
                for (var i = 0; i < $scope.gerenciasAux.length; i++) {
                    $scope.registroPlan.planNegocioEvolGerencias.push($scope.gerenciasAux[i]);
                }

                for (var i = 0; i < $scope.ArchivosAux.length; i++) {
                    $scope.registroPlan.planNegocioEvolArchivos.push($scope.ArchivosAux[i]);
                }

            }


            if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) && $scope.registroPropuesta.fondo == 0) {
                $scope.registroPropuesta.estadoFlujoId = 8;
            } else {
                $scope.registroPropuesta.estadoFlujoId = 14;
            }
            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;

            //PROPUESTAS EXTERNAS....
            if ($scope.registroPropuesta.propuestaInterna == false || $scope.registroPropuesta.propuestaInterna == "false") {
                if ($scope.registroPlan.planNegocioEvolutivoId != undefined) {
                    //Eliminamos el plan que se tenia...
                    planNegocioService.delete($scope.registroPlan.planNegocioEvolutivoId).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;

                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {

                                    var Solicitud = {
                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                        "TipoInformacionId": 29,
                                        "InformacionId": $scope.registroPropuesta.id,
                                        "FechaSolicitud": new Date(),
                                        "EstadoFlujoId": 14,
                                        "idRol": 1028,
                                        "ClaveUnidadAut": '',
                                        "tipoPersonal_Id": 'Sin Definir'
                                    }
                                    solicitudesGIService.AddSolicitud(Solicitud).then(
                                        function (result) {
                                            var Bitacora = {
                                                "SolicitudId": result.data,
                                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                "Descripcion": "Se envió la solicitud",
                                                "EstadoFlujoId": 1,
                                                "idRol": $scope.rolId
                                            }
                                            bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                            var Mail = {
                                                "Modulo": "Gestión de la Innovación",
                                                "Empleado": $scope.nombreCompleto,
                                                "Seccion": "Propuesta de Innovación",  //Encabezado del correo
                                                "TipoCorreo": "SolicitudAdminGI",
                                                "ClavePersona": $scope.registroPropuesta.clavePersona
                                            }
                                            correoNotificacionService.mailNotificacion(Mail);
                                            toastr.success("Solicitud Enviada!");
                                            $state.go("carteraPropuestas");
                                        })

                                },
                                function (err) {
                                    console.error(err);
                                });

                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                } else {
                    //aqui
                    $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                    carteraPropuestaService.update($scope.registroPropuesta).then(
                        function (result) {

                            var Solicitud = {
                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                "TipoInformacionId": 29,
                                "InformacionId": $scope.registroPropuesta.id,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 14,
                                "idRol": 1028,
                                "ClaveUnidadAut": '',
                                "tipoPersonal_Id": 'Sin Definir'
                            }
                            solicitudesGIService.AddSolicitud(Solicitud).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": result.data,
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                        "Descripcion": "Se envió la solicitud",
                                        "EstadoFlujoId": 1,
                                        "idRol": $scope.rolId
                                    }
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.nombreCompleto,
                                        "Seccion": "Propuesta de Innovación",
                                        "TipoCorreo": "SolicitudAdminGI",
                                        "ClavePersona": $scope.registroPropuesta.clavePersona
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
                                    toastr.success("Solicitud Enviada!");
                                    $state.go("carteraPropuestas");
                                })

                        },
                        function (err) {
                            console.error(err);
                        });

                }
            } else {

                //PROPUESTAS INTERNAS
                if ($scope.registroPlan.propuestaClave == undefined) {
                    $scope.registroPlan.propuestaClave = $scope.registroPropuesta.id;
                    planNegocioService.add($scope.registroPlan).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {
                                    carteraPropuestaService.update($scope.registroPropuesta).then(
                                        function (result) {

                                            var Solicitud;
                                            if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) && $scope.registroPropuesta.fondo == 0) {
                                                Solicitud = {
                                                    "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                    "TipoInformacionId": 32,
                                                    "InformacionId": $scope.registroPropuesta.id,
                                                    "FechaSolicitud": new Date(),
                                                    "EstadoFlujoId": 8,//////////////////////////////
                                                    "ClaveUnidadAut": $scope.registroPropuesta.unidadOrganizacionalId,
                                                    "tipoPersonal_Id": 'Sin Definir'
                                                }

                                            } else {
                                                var Solicitud = {
                                                    "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                    "TipoInformacionId": 29,
                                                    "InformacionId": $scope.registroPropuesta.id,
                                                    "FechaSolicitud": new Date(),
                                                    "EstadoFlujoId": 14,
                                                    "idRol": 1028,
                                                    "ClaveUnidadAut": '',
                                                    "tipoPersonal_Id": 'Sin Definir'
                                                }
                                            }
                                            solicitudesGIService.AddSolicitud(Solicitud).then(
                                                function (result) {
                                                    var Bitacora = {
                                                        "SolicitudId": result.data,
                                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                                        "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                        "Descripcion": "Se envió la solicitud",
                                                        "EstadoFlujoId": 1,
                                                        "idRol": $scope.rolId
                                                    }

                                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                                    var Mail;
                                                    Mail = {
                                                        "Modulo": "Gestión de la Innovación",
                                                        "Empleado": $scope.nombreCompleto,
                                                        // "Seccion": "Propuesta de Innovación",
                                                        "ClavePersona": $scope.registroPropuesta.clavePersona
                                                    };

                                                    //Definimos que tipo de correo es
                                                    if ($scope.registroPropuesta.estadoFlujoId == 8) {
                                                        Mail.TipoCorreo = "SolicitudGerente";
                                                    } else {
                                                        Mail.TipoCorreo = "SolicitudAdminGI";
                                                    }

                                                    //Definimos el encabezado del correo
                                                    if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                                                        Mail.Seccion = "Propuesta de Innovación / Plan de Negocio Evolutivo";
                                                    } else {
                                                        Mail.Seccion = "Propuesta de Innovación";
                                                    }


                                                    correoNotificacionService.mailNotificacion(Mail);
                                                    toastr.success("Solicitud Enviada!");
                                                    $state.go("carteraPropuestas");
                                                })

                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al actualizar");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                } else {

                    planNegocioService.update($scope.registroPlan).then(
                        function (result) {
                            $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                            carteraPropuestaService.update($scope.registroPropuesta).then(
                                function (result) {

                                    var Solicitud;
                                    if (($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) && $scope.registroPropuesta.fondo == 0) {
                                        Solicitud = {
                                            "ClavePersona": $scope.registroPropuesta.clavePersona,
                                            "TipoInformacionId": 32,
                                            "InformacionId": $scope.registroPropuesta.id,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 8,//////////////////////////////
                                            "ClaveUnidadAut": $scope.registroPropuesta.unidadOrganizacionalId,
                                            "tipoPersonal_Id": 'Sin Definir'
                                        }
                                    } else {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registroPropuesta.clavePersona,
                                            "TipoInformacionId": 32,
                                            "InformacionId": $scope.registroPropuesta.id,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 14,
                                            "idRol": 1028,
                                            "ClaveUnidadAut": '',
                                            "tipoPersonal_Id": 'Sin Definir'
                                        }
                                    }
                                    solicitudesGIService.AddSolicitud(Solicitud).then(
                                        function (result) {
                                            var Bitacora = {
                                                "SolicitudId": result.data,
                                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                                "ClavePersona": $scope.registroPropuesta.clavePersona,
                                                "Descripcion": "Se envió la solicitud",
                                                "EstadoFlujoId": 1,
                                                "idRol": $scope.rolId
                                            }
                                            bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                            var Mail;
                                            Mail = {
                                                "Modulo": "Gestión de la Innovación",
                                                "Empleado": $scope.nombreCompleto,
                                                // "Seccion": "Propuesta de Innovación",
                                                // "TipoCorreo": "SolicitudGerente",
                                                "ClavePersona": $scope.registroPropuesta.clavePersona
                                            };

                                            //Definimos que tipo de correo es
                                            if ($scope.registroPropuesta.estadoFlujoId == 8) {
                                                Mail.TipoCorreo = "SolicitudGerente";
                                            } else {
                                                Mail.TipoCorreo = "SolicitudAdminGI";
                                            }

                                            //Definimos el encabezado del correo
                                            if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                                                Mail.Seccion = "Propuesta de Innovación / Plan de Negocio Evolutivo";
                                            } else {
                                                Mail.Seccion = "Propuesta de Innovación";
                                            }


                                            correoNotificacionService.mailNotificacion(Mail);
                                            toastr.success("Solicitud Enviada!");
                                            $state.go("carteraPropuestas");
                                        })


                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al actualizar");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                }
            }

        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    $scope.registroPropuesta.adjunto = Adjunto;
                    $scope.registroPropuesta.adjuntoId = 0;
                    $scope.ValidForm1.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        carteraPropuestaService.getAllSegmentoMercado().then(
            function (result) {
                $scope.SegmentosMercado = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.deleteFile = function () {

            $scope.registroPropuesta.adjunto = null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm1.$setDirty();
        }

        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });


        $scope.itemIdea = {};
        $scope.buscarIdea = function () {
            buscarIdeaFactory.buscarIdea().then(
                function (result) {
                    $scope.itemIdea = result;
                    $scope.ideaSelect = true;
                    $scope.registroPropuesta.ideaInnovadoraId = $scope.itemIdea.ideaInnovadoraId;
                },
                function (error) { console.log(error); }
            );
        };


        $scope.propuestainternafunction = function () {
            if ($scope.registroPropuesta.propuestaInterna == 'false') {
                $scope.registroPropuesta.ideaInnovadoraId = null;
                $scope.itemIdea = null;
                $scope.ideaSelect = false;
            }
            if ($scope.registroPropuesta.propuestaInterna == 'true') {
                $scope.expression = 'col-md-6 col-sm-6 col-xs-6';
                $scope.requeridoPNE = true;
            } else {
                $scope.expression = 'col-md-12 col-sm-12 col-xs-12';
                $scope.requeridoPNE = false;
            }
        };

        $scope.buscarPropuesta = function () {
            buscarPropuestaFactory.buscarPropuesta().then(
                function (result) {

                    if (result.unidadOrganizacionalId == null) {
                        toastr.error("No se ecuentra la unidad organizacional asociada a esta propuesta", "Esta propuesta no se puede seleccionar");
                        return false;
                    }
                    //$scope.propuesta = true;
                    $scope.itemPropuesta = result;
                    $scope.registroPropuesta.nombreTecnico = $scope.itemPropuesta.titulo;
                    $scope.registroPropuesta.claveProponentePrincipal = $scope.itemPropuesta.claveEmpPropuesta;
                    $scope.registroPropuesta.empresaPromotorNombre = $scope.itemPropuesta.empresa;
                    $scope.registroPropuesta.empresaPromotorClave = $scope.itemPropuesta.empresaId;
                    $scope.registroPropuesta.unidadOrganizacionalId = $scope.itemPropuesta.unidadOrganizacionalId;
                    carteraPropuestaService.getUnidadOrganizacional($scope.registroPropuesta.unidadOrganizacionalId).then(
                        function (result) {

                            $scope.registroPropuesta.nombreUnidadOrganizacional = result.data.nombreUnidad;
                        }, function (error) { console.log(error); });

                    $scope.registroPropuesta.propuestaId = $scope.itemPropuesta.propuestaId;
                    $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                    $scope.registroPropuesta.estadoFlujoId = 1;
                    $scope.registroPropuesta.nombrePersona = $scope.itemPropuesta.nombrePersona;
                    $scope.ValidForm1.$setDirty();
                },
                function (error) { console.log(error); }
            );
        }




        ////Codigo de PNE
        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true; $scope.proyectoSelect = {}; var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html', controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; } }, scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                $scope.elemento = selectedItem;
                $scope.registroPlan.proyectoNombre = selectedItem.nombre;
                $scope.registroPlan.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm1.$setDirty();
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registroPlan.proyectoNombre = null;
            $scope.registroPlan.proyectoId = null;
            $scope.ValidForm1.$setDirty();
        }


        $scope.$watch("propuesta", function (newValue, oldValue) {

            try {
                $scope.registroPlan.propuestaClave = $scope.propuesta.propuestaClave;
            } catch (err) { }
        });
        $scope.$watch("auxUO", function (newValue, oldValue) {

            try {
                var uo = {
                    'claveUnidad': $scope.auxUO.claveUnidad,
                    'planNegocioEvolutivoId': $scope.registroPlan.planNegocioEvolutivoId,
                    'nombreUnidad': $scope.auxUO.nombreUnidad
                }
                $scope.registroPlan.planNegocioEvolGerencias.push(uo);
                contadorAreas++;
                $scope.auxUO = null;
            } catch (err) { }
        });

        $scope.quitarPropuesta = function () {
            $scope.registroPlan.propuestaClave = null;
            $scope.propuesta = null;
        }

        $scope.eliminararea = function (registroPlan) {
            var idx = ($scope.registroPlan.planNegocioEvolGerencias.indexOf(registroPlan));
            registroPlan.claveUnidad = "eliminar";
            $scope.gerenciasAux.push(registroPlan)
            $scope.registroPlan.planNegocioEvolGerencias.splice(idx, 1);
            contadorAreas--;
            $scope.ValidForm1.$setDirty();
        };

        $scope.eliminaradjunto = function (registroPlan) {
            var idx = ($scope.registroPlan.planNegocioEvolArchivos.indexOf(registroPlan));
            registroPlan.adjunto.nombre = "eliminar";
            $scope.ArchivosAux.push(registroPlan)
            $scope.registroPlan.planNegocioEvolArchivos.splice(idx, 1);
            $scope.ValidForm1.$setDirty();
        };

        $scope.eliminarautor = function (registroPlan) {

            var idx = ($scope.registroPlan.planNegocioEvolAutores.indexOf(registroPlan));
            for (var i = 0; i < $scope.registroPlan.planNegocioEvolAutores.length; i++) {
                if ($scope.registroPlan.planNegocioEvolAutores[i].id == registroPlan.id) {
                    $scope.registroPlan.planNegocioEvolAutores[i].nombre = "eliminar";
                    contadorAutores--;
                }
            }

            $scope.ValidForm1.$setDirty();
            //$scope.registroPlan.planNegocioEvolAutores.splice(idx, 1);
        };

        //adjunto
        $scope.getFileDetailsD = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    if ($scope.registroPlan.planNegocioEvolArchivos.length > 0) {
                        for (var i = 0; i < $scope.registroPlan.planNegocioEvolArchivos.length; i++) {
                            if (aux.adjunto.nombre == $scope.registroPlan.planNegocioEvolArchivos[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                //$(":file").filestyle('clear');
                                $("#filesGralD").filestyle('clear');
                                return false;
                            }
                        }
                    }
                    $scope.registroPlan.planNegocioEvolArchivos.push(aux);
                    //$(":file").filestyle('clear');
                    $scope.ValidForm1.$setDirty();
                    $("#filesGralD").filestyle('clear');
                },
                function (error) {
                    //$(":file").filestyle('clear');
                    $("#filesGralD").filestyle('clear');
                }
            );
        }


        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;

                //Verifica que no exista el autor dentro de la nueva lista
                if ($scope.registroPlan.planNegocioEvolAutores.length > 0) {
                    for (var c = 0; c < $scope.registroPlan.planNegocioEvolAutores.length; c++) {
                        if ($scope.registroPlan.planNegocioEvolAutores[c].clavePersona == $scope.PersonaSeleccionada.clavePersona) {
                            toastr.error("No se permiten duplicados");
                            return false;
                        }
                    }

                }
                // $scope.registroPlan.planNegocioEvolAutores.push($scope.PersonaSeleccionada);
                // contadorAutores++;
                // $scope.ValidForm1.$setDirty();


                var autor = {
                    'clavePersona': $scope.PersonaSeleccionada.clavePersona,
                    'nombre': $scope.PersonaSeleccionada.nombreCompleto,
                    'planNegocioEvolutivoId': $scope.registroPlan.planNegocioEvolutivoId
                };
                $scope.registroPlan.planNegocioEvolAutores.push(autor);
                contadorAutores++;
                $scope.ValidForm1.$setDirty();

            });
        }

    }
})();
