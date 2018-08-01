(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("publicacionCtrlDetailsGerente", ['AuthService', '$scope', '$rootScope', 'PublicacionService', "$stateParams", "globalGet", "$state", publicacionCtrlDetailsGerente]);

    function publicacionCtrlDetailsGerente(AuthService, $scope, $rootScope, PublicacionService, $stateParams, globalGet, $state) {
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

        $scope.justificacion="";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo artículo con la siguiente justificación: ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo artículo con la siguiente justificación: ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        $scope.AutoresIIERegistrados = "";

        PublicacionService.getbyid(id).then(
            function (result) {
                PublicacionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                PublicacionService.getByPublicacion(result.data.publicacionId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                PublicacionService.getByPublicacionExt(result.data.publicacionId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
            },
            function (error) {
                toastr.error(error);
            });


        PublicacionService.obtenAdminCh().then(
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
            if(opc==1){
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
                "Seccion": "Artículo",
                "TipoCorreo": "NotificacionesGerente",
                "ClavePersona": $scope.registro.clavePersona,
                "Descripcion1": "<b>Revista:</b> " + $scope.registro.revista.revistaNombre + "<br/>",
                "Descripcion2": "<b>Titulo de Artículo:</b> " + $scope.registro.tituloPublicacion + "<br/>",
                "Descripcion3": "<b>Nivel de Artículo:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
                "Descripcion4": "<b>Estado de Artículo:</b> " + $scope.registro.estadoPublicacion.descripcion,
                "Justificacion": $scope.justificacion,
                "coautores": $scope.AutoresIIERegistrados,
                "Estado": ""
            }

            //var MailGerente = {
            //    "Modulo": "Capital Humano",
            //    "Empleado": $scope.registro.nombrePersona,
            //    "Seccion": "Artículo",
            //    "TipoCorreo": "NotificacionesGerente",
            //    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
            //    "Descripcion1": "<b>Revista:</b> " + $scope.registro.revista.revistaNombre + "<br/>",
            //    "Descripcion2": "<b>Titulo de Artículo:</b> " + $scope.registro.tituloPublicacion + "<br/>",
            //    "Descripcion3": "<b>Nivel de Artículo:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
            //    "Descripcion4": "<b>Estado de Artículo:</b> " + $scope.registro.estadoPublicacion.descripcion,
            //    "Justificacion": $scope.justificacion,
            //    "Estado": ""
            //}

            //var MailAdminCH = {
            //    "Modulo": "Capital Humano",
            //    "Empleado": $scope.registro.nombrePersona,
            //    "Seccion": "Artículo",
            //    "TipoCorreo": "NotificacionesGerente",
            //    "ClavePersona": $scope.adminCH.clavePersona,
            //    "Descripcion1": "<b>Revista:</b> " + $scope.registro.revista.revistaNombre + "<br/>",
            //    "Descripcion2": "<b>Titulo de Artículo:</b> " + $scope.registro.tituloPublicacion + "<br/>",
            //    "Descripcion3": "<b>Nivel de Artículo:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
            //    "Descripcion4": "<b>Estado de Artículo:</b> " + $scope.registro.estadoPublicacion.descripcion,
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
                    PublicacionService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            PublicacionService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: "+ $scope.justificacion,
                                "EstadoFlujoId": 8,
                                "idRol": 4
                            }
                            PublicacionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            PublicacionService.mailNotificacionConCoautores(Mail);
                            //PublicacionService.mailNotificacion(MailGerente);
                            //PublicacionService.mailNotificacion(MailAdminCH);
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
                    PublicacionService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Rechazada!");
                            PublicacionService.updateSolicitud(registro).then(
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
                            PublicacionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Rechazada"
                            PublicacionService.mailNotificacionConCoautores(Mail);
                            //PublicacionService.mailNotificacion(MailGerente);
                           // PublicacionService.mailNotificacion(MailAdminCH);
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