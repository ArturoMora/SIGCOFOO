(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("cursointernoDetailsCtrl", ['AuthService', '$scope', '$rootScope', '$state', 'CursoInternoCHService', "$stateParams", "globalGet", "DTOptionsBuilder", cursointernoDetailsCtrl]);

    function cursointernoDetailsCtrl(AuthService, $scope, $rootScope, $state, CursoInternoCHService, $stateParams, globalGet, DTOptionsBuilder) {
        //var id = $stateParams.id;
        window.scrollTo(0, 0);
        var API = globalGet.get("api");
        //var id = $rootScope.idG;
        var id = 0;

        if ($stateParams.id != null && $stateParams.id != undefined && $stateParams.id!="") {
            id = $stateParams.id;
        } else {
            id = $rootScope.getGlobalID();
        }
        //if ($rootScope.getGlobalID() != null && $rootScope.getGlobalID() != undefined) {
            
        //} else {
           
        //}
        
        var id2 = $rootScope.getGlobalID2();
        $scope.centroposgrado = $rootScope.centroposgrado;
        
        $scope.id2 = id2;
        //$scope.id2 = $rootScope.idG2;
        if ($scope.id2 == '1A') {
            $scope.id2 = 1;
        }



        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
            } else {
                $rootScope.globalRegresar();
            }
        }


        
        $scope.urlDescarga = API + "Descarga/GetFileCurso";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        CursoInternoCHService.getbyid(id).then(
            function (result) {
                CursoInternoCHService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                    //alert($scope.registro.proyecto.unidadOrganizacionalId);
                    if ($scope.registro.proyecto != null) {
                        CursoInternoCHService.GetUO($scope.registro.proyecto.unidadOrganizacionalId).then(
                         function (result) {
                             $scope.UO = result.data;
                         },
                        function (error) {
                            toastr.error(error);
                        });
                    }

                });
                
                CursoInternoCHService.getByObj(result.data.cursoInternoId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                CursoInternoCHService.getExt(result.data.cursoInternoId).then(
                function (result) {
                    $scope.autorext = result.data;
                });
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }

                CursoInternoCHService.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.archivosAdjuntos = result.data;
                    for (var i = 0; i < $scope.archivosAdjuntos.length; i++) {
                        if ($scope.archivosAdjuntos[i].nombre.length > 37) {
                            var str = $scope.archivosAdjuntos[i].nombre + "";
                            var strshortened = str.slice(0, 37);
                            $scope.archivosAdjuntos[i].nombre = strshortened + "...";
                        }
                    }
                });
                
                for (var i = 0; i < $scope.registro.sitioWebCurso.length; i++) {
                    if ($scope.registro.sitioWebCurso[i].url.length > 34) {
                        var str = $scope.registro.sitioWebCurso[i].url + "";
                        var strshortened = str.slice(0, 34);
                        $scope.registro.sitioWebCurso[i].descripcion = strshortened + "...";
                    }
                }
                if (($scope.id2 != '')&&($scope.id2!=undefined)) {
                    
                    CursoInternoCHService.GetSolicitud($scope.id2).then(
                        function (result) {
                         $scope.solicitud = result.data; 
                        },
                        function (error) {
                       toastr.error("error 1"+error); 
                        });
                }

            },
            function (error) {
                toastr.error("error 2" + error);
            });

        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.justificacion == null) {
                    toastr.error("Escriba una justificación");
                    return false;
            }
            //Traer solicitud
                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": "investigador",//$scope.solicitud.clavePersona,
                    "Seccion": "Curso",
                    "TipoCorreo": "NotificacionResultadoCP",
                    "ClavePersona": $scope.solicitud.clavePersona,
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
                    case 2: //Aprobada
                        $scope.registro.estadoFlujoId = 13;
                      //  $scope.registro.fechaValidacion = $scope.FechaValidacionAux;
                        if ($scope.registro.perteneceCP == true) {
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 13
                            }
                            CursoInternoCHService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Aprobada!");
                                    CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 19
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada la Descarga";
                                    CursoInternoCHService.mailNotificacion(Mail);
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
                                "estadoFlujoId": 13
                            }
                            CursoInternoCHService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Aprobada!");
                                    CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 4
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada la Descarga";
                                    CursoInternoCHService.mailNotificacion(Mail);
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
                        
                        $scope.registro.estadoFlujoId = 12
                        if ($scope.registro.perteneceCP == true) {
                            var registro = {
                                "solicitudId": $scope.id2,
                                "estadoFlujoId": 12
                            }
                            CursoInternoCHService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Descripcion": "Rechazado por: " + $scope.justificacion,
                                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                                        "idRol": 19
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada la Descarga";
                                    CursoInternoCHService.mailNotificacion(Mail);
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
                            CursoInternoCHService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Descripcion": "Rechazado por: " + $scope.justificacion,
                                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                                        "idRol": 4
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada la Descarga";
                                    CursoInternoCHService.mailNotificacion(Mail);
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

    }

})();