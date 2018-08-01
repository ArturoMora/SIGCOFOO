(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("CursosPersonalDetailsCtrl", ['AuthService', '$scope', 'CursosPersonalServiceMT', "$stateParams", "globalGet", "DTOptionsBuilder", "IndicadoresMTService", CursosPersonalDetailsCtrl]);

    function CursosPersonalDetailsCtrl(AuthService, $scope, CursosPersonalServiceMT, $stateParams, globalGet, DTOptionsBuilde, IndicadoresMTServicer) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFileCurso";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        CursosPersonalServiceMT.getbyid(id).then(
            function (result) {
                $scope.auxCreado = result.data.clavePersona;
                CursosPersonalServiceMT.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                    debugger;
                    if ($scope.registro.proyecto != null) {
                        CursosPersonalServiceMT.GetUO($scope.registro.proyecto.unidadOrganizacionalId).then(
                         function (result) {
                             $scope.UO = result.data;
                         },
                        function (error) {
                            toastr.error(error);
                        });
                    }
                });
                CursosPersonalServiceMT.getByObj(result.data.cursoInternoId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                CursosPersonalServiceMT.getExt(result.data.cursoInternoId).then(
                function (result) {
                    $scope.autorext = result.data;
                });
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                CursosPersonalServiceMT.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    debugger;
                    $scope.archivosAdjuntos = result.data;
                    debugger;
                    for (var i = 0; i < $scope.archivosAdjuntos.length; i++) {
                        if ($scope.archivosAdjuntos[i].nombre.length > 37) {
                            var str = $scope.archivosAdjuntos[i].nombre + "";
                            var strshortened = str.slice(0, 37);
                            $scope.archivosAdjuntos[i].nombre = strshortened + "...";
                        }
                    }
                });
                for (var i = 0; i < $scope.registro.sitioWebCurso.length; i++) {
                    if ($scope.registro.sitioWebCurso[i].url.length > 37) {
                        var str = $scope.registro.sitioWebCurso[i].url + "";
                        var strshortened = str.slice(0, 37);
                        $scope.registro.sitioWebCurso[i].descripcion = strshortened + "...";
                    }
                }




            },
            function (error) {
                toastr.error(error);
            });

        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.justificacion == null) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombrePersona,
                    "Seccion": "Curso",
                    "TipoCorreo": "NotificacionResultadoCP",
                    "ClavePersona": $scope.registro.clavePersona,
                    "Descripcion1": "<b>Titulo:</b> " + $scope.registro.titulo + "<br/>",
                    "Descripcion2": "<b>Descripción:</b> " + $scope.registro.descripcion + "<br/>",
                    "Descripcion3": "<b>Tipo de curso:</b> " + $scope.registro.tipoCurso.descripcion + "<br/>",
                    "Descripcion4": "",
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                $scope.desactivar = true;
                if ($scope.registro.adjunto != null) {
                    $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                } else {
                    $scope.registro.adjuntoId = null;
                }
                switch (opc) {
                   case 2:
                        $scope.registro.estadoFlujoId = 12;
                      //  $scope.registro.fechaValidacion = $scope.FechaValidacionAux;
                        if ($scope.registro.perteneceCP == true) {
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 12
                            }
                            CursosPersonalServiceMT.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Aprobada!");
                                    CursosPersonalServiceMT.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 19
                                    }
                                    CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    CursosPersonalServiceMT.mailNotificacion(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $state.go("solicitudescp");
                                    } else { $state.go("solicitudesrh"); }
                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        } else {
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 12
                            }
                            CursosPersonalServiceMT.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Aprobada!");
                                    CursosPersonalServiceMT.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 4
                                    }
                                    CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    CursosPersonalServiceMT.mailNotificacion(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $state.go("solicitudescp");
                                    } else { $state.go("solicitudesrh"); }
                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        }
                        break;
                    case 3:
                        $scope.registro.estadoFlujoId = 13
                        if ($scope.registro.perteneceCP == true) {
                            var registro = {
                                "solicitudId": id2,
                                "estadoFlujoId": 13
                            }
                            CursosPersonalServiceMT.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    CursosPersonalServiceMT.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Rechazado por: " + $scope.justificacion,
                                        "EstadoFlujoId": 2,
                                        "idRol": 19
                                    }
                                    CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    CursosPersonalServiceMT.mailNotificacion(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $state.go("solicitudescp");
                                    } else { $state.go("solicitudesrh"); }
                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        } else {
                            var registro = {
                                "solicitudId": id2,
                                "estadoFlujoId": 13
                            }
                            CursosPersonalServiceMT.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    CursosPersonalServiceMT.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Rechazado por: " + $scope.justificacion,
                                        "EstadoFlujoId": 2,
                                        "idRol": 4
                                    }
                                    CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    CursosPersonalServiceMT.mailNotificacion(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $state.go("solicitudescp");
                                    } else { $state.go("solicitudesrh"); }
                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        }

                        break;
            }
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