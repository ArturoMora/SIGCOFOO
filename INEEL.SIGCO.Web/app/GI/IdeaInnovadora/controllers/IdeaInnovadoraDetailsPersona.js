(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("ideaInnovadoraDetailsPersona", ['AuthService', '$scope', '$stateParams', 'IdeainnovadoraService', "$rootScope", "MenuService", "comiteService", "miembrosGEService", "solicitudesGIService", "bitacoraSolicitudService", "$state", "correoNotificacionService", "EvaluadorIdeaService", "tipoAccesoService", ideaInnovadoraDetailsPersona]);

    function ideaInnovadoraDetailsPersona(AuthService, $scope, $stateParams, IdeainnovadoraService, $rootScope, MenuService, comiteService, miembrosGEService, solicitudesGIService, bitacoraSolicitudService, $state, correoNotificacionService, EvaluadorIdeaService, tipoAccesoService) {
        var id = $stateParams.id;
        if (id === undefined || id == null || id == '') {
            id = $rootScope.getGlobalID();
        } else {
            //entra por url:
            $state.go('buscarIdeaInnovadoraDetalles', { 'id': id });
        }
        var id2 = $rootScope.getGlobalID2();
        window.scrollTo(0, 0)
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.notificados = [];
        $scope.comiteselect = {};
        $scope.comiteexist = {};
        $scope.showEval = true;
        $scope.editaSolicitud=true;
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        $scope.evaluacionRegistro=function(){
            IdeainnovadoraService.ComentariosSolicitudIdea($scope.registro.ideaInnovadoraId).then(
                function(res){
                    $scope.evaluacion= res.data;
                },function(err){
                    console.log(err);
                }
            );   
        }

        $scope.comentarioSolicitudAprobada=function(){
            IdeainnovadoraService.ComentariosSolicitudAprobadaIdea($scope.registro.ideaInnovadoraId).then(
                function(res){
                    $scope.evaluacion= res.data;
                },function(err){
                    console.log(err);
                }
            );   
        }

        //obtener el registro a mostrar
        IdeainnovadoraService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                
                if($scope.registro.estadoFlujoId==10){
                    $scope.comentarioSolicitudAprobada();
                }
                if($scope.registro.estadoFlujoId==15){
                    $scope.evaluacionRegistro();
                }

                IdeainnovadoraService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                    });
            }, function (error) {
                toastr.error(error);
            });

            
            

        //Obtener comentarios
        EvaluadorIdeaService.getComentarios(id).then(
            function (result) {
                $scope.comentariosIdea = result.data;
            }, function (error) {
                toastr.error(error);
            });
        //obtener comite
        comiteService.get().then(
            function (result) {
                $scope.comites = result.data;
            }, function (error) {
                toastr.error(error);
            });
        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        //proponentes
        IdeainnovadoraService.getProponentes(id).then(
            function (result) {
                $scope.proponentes = result.data;
            });

        miembrosGEService.get(2).then(
            function (result) {
                
                $scope.miembros = result.data;
            }, function (error) {
                toastr.error(error);
            });


        //verificar q no existe ya un evaluador
        //comiteselect

        IdeainnovadoraService.grupoevaluadorexist(id).then(
            function (result) {
                
                $scope.comiteexist = result.data;
                if ($scope.comiteexist != null && $scope.comiteexist != undefined) {
                    $scope.comiteselect.id = $scope.comiteexist.miembrosGIId;

                    //obtener grupo evaluador

                    miembrosGEService.get(2).then(
                        function (result) {
                            
                            $scope.miembros = result.data;
                            if ($scope.comiteexist != null && $scope.comiteexist != undefined) {
                                for (var i = 0; i < $scope.miembros.length; i++) {
                                    if ($scope.miembros[i].clavePersona == $scope.comiteexist.clavePersona) {
                                        $scope.miembros[i].seleccionado = true;
                                    }
                                }
                            }
                        }, function (error) {
                            toastr.error(error);
                        });
                }
            }, function (error) {
                toastr.error(error);
            });


        //notificador
        $scope.verificarnotificar = function (clavePersona) {
            $scope.contador = 0;
            for (var i = 0; i < $scope.miembros.length; i++) {
                if ($scope.miembros[i].clavePersona != clavePersona) {
                    $scope.miembros[i].seleccionado = false;
                }
            }
            for (var i = 0; i < $scope.miembros.length; i++) {
                
                if ($scope.comiteexist != null && $scope.comiteexist != undefined) {
                    if ($scope.miembros[i].clavePersona != $scope.comiteexist.clavePersona) {
                        if ($scope.miembros[i].seleccionado == true) {
                            $scope.contador++;
                        }
                    }
                } else {
                    if ($scope.miembros[i].seleccionado == true) {
                        $scope.contador++;
                    }
                }
            }
        }

        //enviar notificaciones
        $scope.notificar = function () {
            for (var i = 0; i < $scope.miembros.length; i++) {
                if ($scope.miembros[i].seleccionado == true) {
                    $scope.notificados.push($scope.miembros[i]);
                }
            }
            var noti = {
                'listaMiembros': $scope.notificados,
                'id': id
            }
            solicitudesGIService.notificar(noti).then(
                function (result) {
                    //bitacora!!
                    var Bitacora = {
                        "SolicitudId": id2,
                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                        "ClavePersona": $scope.ClavePersonaLogin,
                        "Descripcion": "Se notificó a los evaluadores",
                        "EstadoFlujoId": 14
                    }
                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                    toastr.success("Evaluador asignado");
                    $state.go("solicitudesGI");
                }, function (error) {
                    toastr.error(error);
                });

        }


        $scope.addEval = function () {
            if ($scope.showEval == true) {
                $scope.showEval = false;
            } else {
                $scope.showEval = true;
            }
        }

        //Rechazar 
        $scope.Acciones = function (accion) {
            // valores de accion
            //1: rechazar
            //2: modificar
            //3: aprobar
            if ($scope.rolId == 1028) {
                if (($scope.justificacion == null || $scope.justificacion == undefined)) {
                    toastr.error("Agrega una justificación");
                    return false;
                }
            }
            
            if ($scope.rolId == 1029) {
                if ($scope.registro.comentariosEval == null || $scope.registro.comentariosEval == undefined) {
                    toastr.error("Agrega un comentario");
                    return false;
                }
            }
            if ($scope.showEval == false && ($scope.registro.calificacion == undefined || $scope.registro.calificacion == null)) {
                toastr.error("Agrega una evaluación final");
                return false;
            }

            $scope.principalProponente;
            for (var i = 0; i < $scope.proponentes.length; i++) {
                if ($scope.proponentes[i].contribucionProponenteId == 0) {
                    $scope.principalProponente = $scope.proponentes[i].clavePersona;
                }
            }
            
            if ($scope.registro.comentariosEval != null && $scope.registro.comentariosEval != undefined) {
                $scope.justificacionAcciones = $scope.registro.comentariosEval;
            }
            if ($scope.justificacion != null && $scope.justificacion != undefined) {
                $scope.justificacionAcciones = $scope.justificacion;
            }


            switch (accion) {
                case 1:
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 15
                    }
                    $scope.registro.calificacion = 0;
                    $scope.registro.EstadoFlujoId = 15;
                    IdeainnovadoraService.updateEstado($scope.registro).then(
                        function (result) {
                            
                            if ($scope.rolId == 1029) {
                                $scope.justificacion = $scope.registro.comentariosEval;
                            }

                            var Bitacora = {
                                "SolicitudId": id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Rechazada",
                                "EstadoFlujoId": 14,
                                "Justificacion": $scope.justificacion
                            }
                            solicitudesGIService.updateSolicitud(registro).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registro.nombrePersona,
                                        "Seccion": "Idea Innovadora",
                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Estado": "rechazada",
                                        "Descripcion1": $scope.principalProponente,
                                        "Descripcion2": $scope.justificacionAcciones
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
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
                        "solicitudId": id2,
                        "estadoFlujoId": 1
                    }
                    $scope.registro.calificacion = 0;
                    $scope.registro.EstadoFlujoId = 1;
                    if ($scope.rolId == 1029) {
                        $scope.justificacion = $scope.registro.comentariosEval;
                    }
                    IdeainnovadoraService.updateEstado($scope.registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Se envió a modificación",
                                "EstadoFlujoId": 14,
                                "Justificacion": $scope.justificacion
                            }
                            solicitudesGIService.updateSolicitud(registro).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registro.nombrePersona,
                                        "Seccion": "Idea Innovadora",
                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Estado": "enviada a modificación",
                                        "Descripcion1": $scope.principalProponente,
                                        "Descripcion2": $scope.justificacionAcciones
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
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
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 10
                    }
                    //if ($scope.registro.calificacion <= 0) {
                    //    toastr.error("La evaluación final debe ser mayor a cero");
                    //    return false;
                    //}
                    $scope.registro.estadoFlujoId = 10;
                    IdeainnovadoraService.updateEstado($scope.registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Aprobada",
                                "EstadoFlujoId": 14,
                                "Justificacion": $scope.justificacion
                            }
                            solicitudesGIService.updateSolicitud(registro).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registro.nombrePersona,
                                        "Seccion": "Idea Innovadora",
                                        "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Estado": "aprobada",
                                        "Descripcion1": $scope.principalProponente,
                                        "Descripcion2": $scope.justificacionAcciones
                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
                                    $state.go("solicitudesGI");
                                })
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al rechazar");
                            $state.reload();
                        });
                    break;
                case 4:

                    if ($scope.rolId == 1029) {
                        $scope.justificacion = $scope.registro.comentariosEval;
                    }
                    var evaluador = {
                        'IdeaInnovadoraId': id,
                        'Comentarios': $scope.justificacion
                    };
                    
                    EvaluadorIdeaService.UpdateComentarios(evaluador).then(
                        function (result) {
                            
                            var Bitacora = {
                                "SolicitudId": id2,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.ClavePersonaLogin,
                                "Descripcion": "Aprobada",
                                "EstadoFlujoId": 14,
                                "Justificacion": $scope.justificacion
                            }
                            bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.registro.nombrePersona,
                                "Seccion": "Idea Innovadora",
                                "TipoCorreo": "RechazarAprobarEditarAdminGI",
                                "ClavePersona": $scope.registro.clavePersona,
                                "Estado": "aprobada",
                                "Descripcion1": $scope.principalProponente,
                                "Descripcion2": $scope.justificacion
                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            $state.go("solicitudesGI");
                        });
                    break;
            }

        }
    }
})();