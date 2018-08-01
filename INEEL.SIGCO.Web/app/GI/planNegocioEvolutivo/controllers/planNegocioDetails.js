(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("planNegocioDetail", ['AuthService', '$scope', 'planNegocioService', "$stateParams", "globalGet", "$rootScope", "MenuService", "solicitudesGIService", "bitacoraSolicitudService", "correoNotificacionService", "$state", planNegocioDetail]);

    function planNegocioDetail(AuthService, $scope, planNegocioService, $stateParams, globalGet, $rootScope, MenuService, solicitudesGIService, bitacoraSolicitudService, correoNotificacionService, $state) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.justificacion = "";
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.nombrePersona = $scope.authentication.nombreCompleto;
        //Extraer informacion del usuario//

        // $scope.justificacionSolicitudPlan = function () {
        //     bitacoraSolicitudService.GetComentariosSolicitud($scope.registro.planNegocioEvolutivoId).then(  //En caso de que a un plan aprobado se le hayan hecho actualizaciones(que se haya enviado a evaluar varias veces)
        //         function (res) {
        //             $scope.evaluacionPlan = res.data;
        //             if ($scope.evaluacionPlan == null) { //En caso de que el plan provenga de una propuesta interna financiado de un fondo distinto al ficydet (ya que en ese caso solo se evalua la propuesta, el plan se aprueba en automatico)
        //                 bitacoraSolicitudService.GetJustificacionPlanAceptado($scope.registro.propuestaClave).then(
        //                     function (res) {
        //                         $scope.evaluacionPlan = res.data;
        //                     }, function (err) {
        //                         console.log(err);
        //                     }
        //                 );
        //             }
        //         }, function (err) {
        //             console.log(err);
        //         }
        //     );
        // }


        function justificacionSolicitudPlan(estadoFlujo, estado) {
            
            var solicitud = {
                "informacionId": $scope.registro.planNegocioEvolutivoId,
                "estadoOC": estado,
                "nombreOC": "Plan",
                "tipoInformacionOC": 31,
                "EstadoFlujoId": estadoFlujo
            };

            //En caso de que a un plan aprobado NO se le hayan hecho actualizaciones
            bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                function (res) {
                    $scope.evaluacionPlan = res.data;
                    debugger;
                    if($scope.evaluacionPlan==null){
                        //En caso de que a un plan aprobado se le hayan hecho actualizaciones (el plan nace junto con la propuesta, y posteriormente el plan puede seguir actualizandose)
                        solicitud.tipoInformacionOC = 32;
                        solicitud.informacionId = $scope.registro.propuestaClave;
                        bitacoraSolicitudService.GetJustificacionSolicitud(solicitud).then(
                            function(res){
                                $scope.evaluacionPlan = res.data;
                            },
                            function(err){
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

        planNegocioService.getbyid(id).then(
            function (result) {
                
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                // $scope.justificacionSolicitudPlan();
                if($scope.registro.estadoFlujoId==10){
                    justificacionSolicitudPlan(10, "Aprobado");
                }

                if($scope.registro.estadoFlujoId==6){
                    justificacionSolicitudPlan(15, "Rechazado");
                }
                
                $scope.obtieneDatosSolicitudPrevia(id);
            },
            function (error) {
                toastr.error(error);
            });

        //Como esta vista es compartida para usuarios administrativos como personal en general, se necesitan algunas funciones para las operaciones administrativas
        //Obtiene los datos de la solicitud del plan de negocio, en este punto debe de existir una solicitud previa, [cuando fue evaluada la propuesta junto con el plan]
        $scope.obtieneDatosSolicitudPrevia = function (id) {
            planNegocioService.GetSolicitud(id).then(function (res) {
                $scope.bitacora = res.data;
            }, function (err) {
                toastr.error("Error al cargar los datos de la solicitud");
                console.log(err);
            });
        }


        //Acciones que puede realizar el admin o gerente con una solicitud
        $scope.acciones = function (accion) {
            // valores de accion
            //1: rechazar
            //2: modificar
            //3: aprobar
            if (($scope.justificacion == null || $scope.justificacion == undefined || $scope.justificacion == "")) {
                toastr.error("Agrega una justificación al plan de negocio evolutivo");
                return false;
            }

            

            switch (accion) {
                case "rechazar":
                    if ($scope.justificacion == null || $scope.justificacion == "") {
                        toastr.error("Agregue un comentario");
                        return false;
                    }
                    $scope.registro.estadoFlujoId = 6;  //No utilizamos el estado de edicion porque causaria errores en el proceso
                    var solicitud = {
                        "solicitudId": $scope.bitacora.solicitudId,
                        "estadoFlujoId": 15   
                    };
                    planNegocioService.updateEstado($scope.registro).then( //Actualizamos el plan de negocio
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": $scope.bitacora.solicitudId,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.registro.clavePersona,
                                "Descripcion": "Rechazado Plan de Negocio Evolutivo",
                                "EstadoFlujoId": 15,
                                "Justificacion": $scope.justificacion
                            }
                            solicitudesGIService.updateSolicitud(solicitud).then(  //Actualizamos la  solicitud
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);  //Agregamos un registro nuevo a la bitacora de solicitudes [como un log]
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registro.nombrePersona,  
                                        "Seccion": "Plan de Negocio Evolutivo",
                                        "TipoCorreo": "AprobarRechazarGerenteGIPNE",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Justificacion": $scope.justificacion,
                                        "Estado": "Rechazada",
                                        "NombreProyecto": $scope.registro.propuesta.nombreTecnico

                                    }
                                    correoNotificacionService.mailNotificacion(Mail);  //Envio de correos
                                    toastr.success("Solicitud rechazada!");
                                    $rootScope.globalRegresar();
                                })
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al rechazar");
                            $state.reload();
                        });
                    break;
                case "aprobar":
                if ($scope.justificacion == null || $scope.justificacion == "") {
                    toastr.error("Agregue un comentario");
                    return false;
                }
                var solicitud = {
                    "solicitudId": $scope.bitacora.solicitudId,
                    "estadoFlujoId": 10
                    };
                    $scope.registro.estadoFlujoId = 10;
                    planNegocioService.updateEstado($scope.registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": $scope.bitacora.solicitudId,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.registro.clavePersona,
                                "Descripcion": "Aprobado Plan de Negocio Evolutivo",
                                "EstadoFlujoId": 10,
                                "Justificacion": $scope.justificacion
                            }
                            solicitudesGIService.updateSolicitud(solicitud).then(
                                function (result) {
                                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Gestión de la Innovación",
                                        "Empleado": $scope.registro.nombrePersona,
                                        "Seccion": "Plan de Negocio Evolutivo",
                                        "TipoCorreo": "AprobarRechazarGerenteGIPNE",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Justificacion": $scope.justificacion,
                                        "Estado": "Aprobada",
                                        "NombreProyecto": $scope.registro.propuesta.nombreTecnico

                                    }
                                    correoNotificacionService.mailNotificacion(Mail);
                                    toastr.success("Solicitud aprobada!");
                                    $rootScope.globalRegresar();
                                })
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al aprobar");
                            $state.reload();
                        });

                    break;
            }

        }




        // $scope.validar = function () {
        //     if ($scope.justificacion == null || $scope.justificacion == undefined || $scope.justificacion == "") {
        //         return false;
        //     }
        //     $scope.registro.estadoFlujoId = 10;
        //     planNegocioService.update($scope.registro).then(
        //         function (result) {

        //             var Solicitud = {
        //                 "ClavePersona": $scope.registro.clavePersona,
        //                 "TipoInformacionId": 31,
        //                 "InformacionId": $scope.registro.planNegocioEvolutivoId,
        //                 "FechaSolicitud": new Date(),
        //                 "EstadoFlujoId": 10,
        //                 "idRol": 4,
        //                 "ClaveUnidadAut": "",
        //                 "tipoPersonal_Id": 'Sin Definir'
        //             }
        //             solicitudesGIService.AddSolicitud(Solicitud).then(
        //                 function (result) {
        //                     var Bitacora = {
        //                         "SolicitudId": result.data,
        //                         "FechaMovimiento": new Date('dd/MM/yyyy'),
        //                         "ClavePersona": $scope.ClavePersonaLogin,
        //                         "Descripcion": "Se aprobó la solicitud",
        //                         "EstadoFlujoId": 8,
        //                         "idRol": $scope.rolId,
        //                         "justificacion": $scope.justificacion
        //                     }
        //                     bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora).then(
        //                         function (result) { },
        //                         function (error) { console.log(error); }
        //                     );

        //                     var Mail = {
        //                         "Modulo": "Gestión de la Innovación",
        //                         "Empleado": $scope.nombrePersona,
        //                         "Seccion": "Plan de Negocio Evolutivo",
        //                         "TipoCorreo": "AprobarRechazarGerenteGIPNE",
        //                         "ClavePersona": $scope.registro.clavePersona,
        //                         "Justificacion": $scope.justificacion,
        //                         "Estado": "Aprobada",
        //                         "NombreProyecto": $scope.registro.propuesta.nombreTecnico

        //                     }
        //                     correoNotificacionService.mailNotificacion(Mail);
        //                     toastr.success("Solicitud aprobada!");
        //                     $state.go("solicitudesGI");
        //                 })

        //         },
        //         function (err) {
        //             console.error(err);
        //             toastr.success("Error al aprobar");
        //             $state.reload();
        //         });

        // }
    }
})();