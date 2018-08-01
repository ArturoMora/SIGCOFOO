(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("BuscarCursosDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "buscarCursosService",
        "globalGet",
        "$uibModal",
        "MenuService",
        "comunService",
        "$rootScope",
        "IndicadoresMTService",
        BuscarCursosDetailsCtrl
    ]);

    function BuscarCursosDetailsCtrl(AuthService, $scope, $state, $stateParams, buscarCursosService, globalGet, $uibModal, MenuService, comunService, $rootScope, IndicadoresMTService) {

        var API = globalGet.get("api");
                                   
        $scope.urlDescarga = API.concat("Descarga/GetFileCurso");
        $scope.authentication = AuthService.authentication;
        var roles = AuthService.authentication.userprofile.roles;


        $scope.claveSolicitante = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreSolicitante = AuthService.authentication.userprofile.nombreCompleto;

        $scope.rolCP = 19; //Rol del Centro de posgrado
        $scope.registro_id = $stateParams.id;


        $scope.justifica = {};
        $scope.ver = $stateParams;
        $scope.Proyecto = "";

        $scope.aux = $scope.registro_id;
        $scope.justificacion = "";


        $scope.Acceso = "False";
        $scope.Descarga = "False";
        $scope.desactivarApr = false;
        $scope.desactivarRec = false;
        $scope.Presentar = "True";

        $scope.autorizar = false;
       
        $scope.solicitudExistente = false;



        if ($scope.ver.id2 == "AutorizarDenegar") {
            $scope.Acceso = "True";
        }


      

        if ($rootScope.parametrosCursosMT == 'undefined' || $rootScope.parametrosCursosMT == null || $rootScope.parametrosCursosMT == undefined || $rootScope.parametrosCursosMT == "undefined") {

        } else {
            $rootScope.parametrosCursosMT.busqueda = $rootScope.parametrosCursosMT.busqueda;
        }
        
        $scope.busquedasCursos = function () {

            buscarCursosService.getbyid($scope.registro_id).then(
              function (result) {

                buscarCursosService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.persona = result.data;
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                    if ($scope.registro.proyecto != null) {
                        buscarCursosService.GetUO($scope.registro.proyecto.unidadOrganizacionalId).then(
                        function (result) {
                            $scope.UO = result.data;
                        },
                       function (error) {
                           toastr.error(error);
                       });
                    }
                });

                $scope.registro = result.data;

                buscarCursosService.getByObj(result.data.cursoInternoId).then(
                    function (result) {
                        $scope.autoriie = result.data;
                    });

                buscarCursosService.getExt(result.data.cursoInternoId).then(
                    function (result) {
                        $scope.autorext = result.data;
                    });


                if ($scope.registro.clavePersona == AuthService.authentication.userprofile.clavePersona) {
                    $scope.Descarga = "True";
                }

                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }


                if ($scope.registro.fechaCurso != null) {
                    $scope.registro.fechaCurso = new Date($scope.registro.fechaCurso);
                }

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }


                buscarCursosService.getByObj($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.AutoresIIE = result.data;
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        $scope.contador = $scope.contador + $scope.AutoresIIE[i].contribucion;
                        //Si es de los coautores
                    }
                    if ($scope.Descarga == "False") {
                        for (var cont = 0; cont < $scope.AutoresIIE.length; cont++) {
                            if ($scope.AutoresIIE[cont].clavePersona == $scope.authentication.userprofile.clavePersona) {
                                $scope.Descarga = "True";
                            }
                        }
                    }
                });

                buscarCursosService.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.archivosAdjuntos = result.data;
                    if ($scope.registro.privadoPublico == 1) {//Es privado
                        ////Si el es el que lo agrego
                        if ($scope.registro.clavePersona == $scope.authentication.userprofile.clavePersona) {
                            $scope.Descarga = "True";
                        }
                        //Si es jefe de proyecto
                        if ($scope.Descarga == "False") {
                            if ($scope.registro.proyecto != null && $scope.registro.proyecto.numjefeProyecto == $scope.authentication.userprofile.clavePersona) {
                                $scope.Descarga = "True";
                            }
                        }
                        //Si es admin de MT con el rol que accedio
                        if ($scope.Descarga == "False") {
                            var rol = MenuService.getRolId();
                            if (rol == 2) {
                                $scope.Descarga = "True";
                            }
                        }
                        
                        //Si tiene permiso
                        if ($scope.Descarga == "False") {
                            $scope.BuscarAutorizacion();
                        }
                        //Si es jefe
                        if ($scope.Descarga == "False") {
                            var persona = $scope.authentication.userprofile.clavePersona;
                            var proyecto = null;
                            if ($scope.registro.proyecto != null) {
                                proyecto = $scope.registro.proyecto.proyectoId;
                            }
                            $scope.BuscarJefe({ JefeHiperonimo: persona, ProyectoId: proyecto });
                        }
                    }
                    else {
                        $scope.Descarga = "True";
                        $scope.Presentar = "False";
                    }
                });

                comunService.existeSolicitudByPersonaInformOCIdANDestadoFlujo($scope.claveSolicitante, $scope.registro_id, 11).then(
                    function (result) {
                        $scope.solicitudExistente = result.data;
                        if ($scope.solicitudExistente == false) {
                            comunService.existeSolicitudByPersonaInformOCIdANDestadoFlujo($scope.claveSolicitante, $scope.registro_id, 10).then(
                            function (result) {
                                if (result.data == false) {
                                    $scope.solicitudExistente = false;
                                } else {
                                    $scope.Descarga = "True";
                                    $scope.solicitudExistente = true;
                                }
                            },
                            function (error) { }
                        );
                        } else {
                            $scope.solicitudExistente = true;
                        }
                    },
                    function (error) { }
                );

            },
          function (error) {
            toastr.error(error);
          });
        }

        $scope.busquedasCursos();


        $scope.EnviarCorreo = function (justificacion, TipoCorreo, TextoCorreo, estado) {
            var texto = TextoCorreo.concat($scope.Proyecto.concat(".</b> Su justificación es: <b>".concat(justificacion)));
            var UnOr
            if ($scope.registro.proyecto != null) {
                UnOr = $scope.registro.proyecto.unidadOrganizacionalId;
            } else {
                UnOr = $scope.persona.claveUnidad;
            }

            //Si no es del centro de posgrado
            if ($scope.registro.perteneceCP == false) {
                buscarCursosService.GetResponsableByUnOr(UnOr).then(
                function (result) {
                    var responsable = result.data.nombreCompleto;
                    var cveresponsable = result.data.clavePersona;
                    var Mail = {
                        "Modulo": "Memoria Tecnológica",
                        "Empleado": $scope.authentication.userprofile.nombreCompleto,
                        "Seccion": texto,
                        "TipoCorreo": TipoCorreo,
                        "ClavePersona": cveresponsable
                    };
                    buscarCursosService.mailNotificacion(Mail);
                    toastr.success("¡Solicitud Enviada!");
                    var Almacenar = {
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "TipoInformacionId": "17", //Curso interno 
                        "FechaSolicitud": new Date(),
                        "InformacionId": $scope.registro.cursoInternoId,
                        "EstadoFlujoId": estado,
                        "ClavePersonaAut": cveresponsable
                    };
                    if (estado == 11) {
                        buscarCursosService.AddSolicitud(Almacenar).then(
                        function (result) {
                            toastr.success(result.data);
                            var num = result.data;
                            var intini = num.indexOf(",");
                            var numero = num.substring(intini + 1);
                            var Almacenar = {
                                "ClavePersona": $scope.authentication.userprofile.clavePersona,
                                "SolicitudId": numero,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "Descripcion": "Se envió solicitud de descarga de cursos",
                                "EstadoFlujoId": estado,
                                "IdRol": 19
                            };
                            buscarCursosService.AddBitacora(Almacenar).then(
                            function (result) {
                                //if (result.data != null) {
                                //    
                                //    toastr.success(result.data);
                                //}
                            },
                            function (err) {
                                console.error(err);
                            });
                        },
                        function (err) {
                            console.error(err);
                        });
                    }
                },
                function (err) {
                    console.error(err);
                });
            } else {
                buscarCursosService.GetByRol($scope.rolCP).then(
                function (result) {
                    var responsable = result.data.nombreCompleto;
                    var cveresponsable = result.data.clavePersona;
                    var Mail = {
                        "Modulo": "Memoria Tecnológica",
                        "Empleado": $scope.authentication.userprofile.nombreCompleto,
                        "Seccion": texto,
                        "TipoCorreo": TipoCorreo,
                        "ClavePersona": cveresponsable
                    };
                    buscarCursosService.mailNotificacion(Mail);
                    toastr.success("¡Solicitud Enviada!");
                    var Almacenar = {
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "TipoInformacionId": "18", //Curso interno de posgrado
                        "FechaSolicitud": new Date(),
                        "InformacionId": $scope.registro.cursoInternoId,
                        "EstadoFlujoId": estado,
                        "ClavePersonaAut": cveresponsable
                    };
                    if (estado == 11) {
                        buscarCursosService.AddSolicitud(Almacenar).then(
                        function (result) {
                            toastr.success(result.data);
                            var num = result.data;
                            var intini = num.indexOf(",");
                            var numero = num.substring(intini + 1);
                            var Almacenar = {
                                "ClavePersona": $scope.authentication.userprofile.clavePersona,
                                "SolicitudId": numero,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "Descripcion": "Se envió solicitud de descarga de cursos",
                                "EstadoFlujoId": estado,
                                "IdRol": 19
                            };
                            buscarCursosService.AddBitacora(Almacenar).then(
                            function (result) {
                                //if (result.data != null) {
                                //    toastr.success(result.data);
                                //}
                            },
                            function (err) {
                                console.error(err);
                            });
                        },
                        function (err) {
                            console.error(err);
                        });
                    }
                },
                function (err) {
                    console.error(err);
                });
            }

            $scope.Presentar = false;
        }




        //Guardar estadoActivoId
        $scope.SolicitarAcceso = function () {
            
            if ($scope.registro.proyecto != null) {
                var ProyectoAux = $scope.registro.proyecto.proyectoId.concat(" - ").concat($scope.registro.proyecto.nombre)
                $scope.message = "Acceso al OC Curso con el nombre <b>" + $scope.registro.titulo + "</b> del proyecto " + ProyectoAux;
            }
            else {
                $scope.message = "Acceso al OC Curso con el nombre <b>" + $scope.registro.titulo;
            }
            
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/SolicitarAccesoGenerico.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function (justificacion) {
                        $scope.var = modalInstance.result;
                        //Enviar Correo     
                        var Tipo = "accesoGEN";
                        var estado = 11;// 8,9,10
                        //var Texto = "solicita descargar los archivos adjuntos de cursos relacionadas al proyecto <b> ";
                        //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                        $uibModalInstance.dismiss('cancel');
                        var Texto = $scope.message + "<br/>";

                        $scope.GuardarSolicitudAcceso(justificacion, Tipo, Texto, estado);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.GuardarSolicitudAcceso = function (justificacion, Tipo, Texto, estado) {
            var personaId = $scope.claveSolicitante;
            var tipoInformacion = "";
            if ($scope.registro.perteneceCP == false) {
                tipoInformacion = 17;
            } else {
                tipoInformacion = 18;
            }
            var UnOr = "";
            if ($scope.registro.proyecto != null) {
                UnOr = $scope.registro.proyecto.unidadOrganizacionalId;
            } else {
                UnOr = $scope.persona.claveUnidad;
            }
            
            var solicitud = {
                "clavePersonaSolicitante": personaId,
                "tipoInformacionId": tipoInformacion,
                "informacionOCId": $scope.registro_id,
                "fechaSolicitud": new Date(),
                "unidadAutorizadoraId": UnOr,
                "estadoFlujoId": estado,
                "moduloId": "MT"
            };
            //TODO:AQUI me quede
            comunService.solicitarAcceso(solicitud).then(
                function (result) {
                    toastr.success("Solicitud enviada");
                    $scope.GuardarBitacoraAcceso(result.data.solicitudAccesoId, justificacion, Tipo, Texto, estado);
                    //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);

                    $scope.solicitudExistente = true;

                },
                function (err) {
                    toastr.error("Problema al enviar la solicitud");
                    console.error(err);
                });
        }

        $scope.GuardarBitacoraAcceso = function (idNewSolicitudAcceso, justificacion, Tipo, Texto, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            var UnOr = "";
            if ($scope.registro.proyecto != null) {
                UnOr = $scope.registro.proyecto.unidadOrganizacionalId;
            } else {
                UnOr = $scope.persona.claveUnidad;
            }
            var bitacora = {
                "solicitudAccesoId": idNewSolicitudAcceso,
                "fechaMovimiento": new Date(),
                "clavePersona": $scope.claveSolicitante,
                "descripcion": "Se envió la solicitud",
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": UnOr,
                "justificacion": justificacion
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) { $scope.EnviarCorreo(justificacion, Tipo, Texto, estado); },
                function (error) { }
            );
        }

        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
            var UnOr = "";
            if ($scope.registro.proyecto != null) {
                UnOr = $scope.registro.proyecto.unidadOrganizacionalId;
            } else {
                UnOr = $scope.persona.claveUnidad;
            }
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.nombreSolicitante,
                "Seccion": "MT / Cursos",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": UnOr,
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            comunService.mailNotificacion(Mail);
        }

        $scope.save = function (justificacion) {
            var Registro = {
                "RegistrosId": $scope.registro.insumosId,
                "ClavePersonaSolicitante": $scope.authentication.userprofile.clavePersona,
                "FechaSolicitudRegistro": new Date(),
                "Justificacion": justificacion,
                "EstadoSolicitudId": '11',//'2',
                "ClavePersonaAutorizador": $scope.registro.proyecto.numjefeProyecto
            };
            buscarCursosService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("BuscarRegistros");
                                },
                                function (err) {
                                    console.error(err);
                                });
        }

        //Debe ser la misma persona que solicito
        $scope.BuscarAutorizacion = function () {
            //var autori = $scope.registro.estadoFlujoId;
            //if (autori == 13) { 
            //    $scope.Descarga = "True";
            //}

            if ($scope.registro.perteneceCP == false) {
                var tipo = "17";
            }
            else {
                var tipo = "18";
            }
            var reg = {
                "TipoInformacionId": tipo, //Curso interno de posgrado
                "InformacionId": $scope.registro.cursoInternoId,
                "ClavePersona": $scope.authentication.userprofile.clavePersona
            }
            buscarCursosService.GetPermiso(reg).then(
                            function (result) {
                                $scope.var = result.data;
                                if ($scope.var != null) {
                                    if ($scope.var.estadoFlujoId == 13) {
                                        $scope.Descarga = "True";
                                    }
                                }
                            },
                            function (err) {
                                console.error(err);
                            });
        }


        $scope.DarAcceso = function () {
            if ($scope.formulario.justifica.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.Proyecto = $scope.registro.proyecto.proyectoId.concat(" - ").concat($scope.registro.proyecto.nombre)
                $scope.desactivarApr = "False";
                $scope.desactivarRec = "False";
                var just = $scope.justifica.text;
                var Registro = {
                    "RegistrosId": $scope.registro.insumosId,
                    "EstadoSolicitudId": '1',
                    "FechaAtencion": new Date(),
                    "TextoRespuesta": just
                };
                buscarCursosService.UpdateAut(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    //Enviar Correo     
                                    var Tipo = 3;
                                    var estado = 1;
                                    var Texto = "le informa que ha sido <b> Aceptada </b> su solicitud para descargar archivos adjuntos de insumos del proyecto <b> ";
                                    $scope.EnviarCorreo(just, Tipo, Texto, estado);
                                    $state.go("BuscarRegistros");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

        $scope.Rechazar = function () {
            if ($scope.formulario.justifica.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.Proyecto = $scope.registro.proyecto.proyectoId.concat(" - ").concat($scope.registro.proyecto.nombre)
                $scope.desactivarApr = "False";
                $scope.desactivarRec = "False";
                var just = $scope.justifica.text;
                var Registro = {
                    "RegistrosId": $scope.registro.insumosId,
                    "EstadoSolicitudId": '3',
                    "FechaAtencion": new Date(),
                    "TextoRespuesta": just
                };
                buscarCursosService.UpdateAut(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    //Enviar Correo     
                                    var Tipo = 3;
                                    var estado = 3;
                                    var Texto = "le informa que ha sido <b> Rechazada </b> su solicitud para descargar archivos adjuntos de insumos del proyecto <b> ";
                                    $scope.EnviarCorreo(just, Tipo, Texto, estado);

                                    $state.go("BuscarRegistros");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }

        }



        $scope.BuscarJefe = function (Registro) {
            buscarCursosService.AutJefe(Registro).then(
                            function (result) {
                                if (result.data == true) {
                                    $scope.Descarga = "True";
                                }
                            },
                            function (err) {
                                console.error(err);
                            });
        }




        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined") {

        } else {
            $rootScope.parametros.busqueda = $rootScope.parametros.busqueda;

        }



        $scope.registraAcceso = function () {

          

            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "CURSOS"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();


    }
})();