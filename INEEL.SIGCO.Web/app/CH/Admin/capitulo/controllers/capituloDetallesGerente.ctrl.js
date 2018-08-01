(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("capituloCtrlDetailsGerente", ['AuthService', '$scope', '$rootScope', 'CapituloService', "$stateParams", "globalGet", "$state", capituloCtrlDetailsGerente]);

    function capituloCtrlDetailsGerente(AuthService, $scope, $rootScope, CapituloService, $stateParams, globalGet, $state) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();
        $scope.desactivar = false;



        $scope.justificacion = "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.aprobacionQ = "";
                $scope.rechazoQ = "";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })



        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        CapituloService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                CapituloService.PersonaSolicitud(id2).then(
                    function (result) {
                        $scope.clavePersona = result.data.clavePersona;
                        CapituloService.Persona(result.data.clavePersona).then(
                            function (result) {
                                $scope.nombrePersona = result.data.nombreCompleto;
                            });
                    },
                    function (error) {
                        toastr.error("Error al traer el nombre de persona");
                    });
                CapituloService.getPais($scope.registro.pais).then(
                    function (result) {
                        $scope.pais = result.data;
                    },
                    function (error) {
                        toastr.error("Error al traer el país");
                    });
            },
            function (error) {
                toastr.error(error);
            });


        $scope.save = function (opc) {

            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }

            $scope.listaCoAutores = "";
            for (var i = 0; i < $scope.registro.autorInternoCapitulo.length; i++) {
                $scope.listaCoAutores += $scope.registro.autorInternoCapitulo[i].clavePersona + ",";
            }
            
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.nombrePersona,
                "Seccion": "Capítulo de Libro",
                "TipoCorreo": "NotificacionesGerente",
                "ClavePersona": $scope.clavePersona,
                "Descripcion1": "<b>Título de Libro:</b> " + $scope.registro.tituloLibro + "<br/>",
                "Descripcion2": "<b>Título de Capítulo:</b> " + $scope.registro.tituloCapitulo + "<br/>",
                "Descripcion3": "<b>Editorial:</b> " + $scope.registro.editorial + "<br/>",
                "Descripcion4": "<b>Estado de Capítulo:</b> " + $scope.registro.estadoFlujo.descripcion,
                "Justificacion": $scope.justificacion,
                "Estado": "",
                "coautores": $scope.listaCoAutores,
            }
            switch (opc) {
                case 1:
                    var registro = {
                        "solicitudId": id,
                        "estadoFlujoId": 2
                    }
                    $scope.registro.estadoFlujoId = 2;
                    CapituloService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            var registro = {
                                "solicitudId": id2,
                                "estadoFlujoId": 2
                            }
                            CapituloService.updateSolicitud(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado: " + $scope.justificacion,
                                        "EstadoFlujoId": 8,
                                        "idRol": 4
                                    }
                                    CapituloService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    CapituloService.mailNotificacionConCoautores(Mail);
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
                        "solicitudId": id,
                        "estadoFlujoId": 1
                    }
                    $scope.registro.estadoFlujoId = 1
                    CapituloService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Rechazada!");
                            var registro = {
                                "solicitudId": id2,
                                "estadoFlujoId": 1
                            }
                            CapituloService.updateSolicitud(registro).then(
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
                                    CapituloService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    CapituloService.mailNotificacionConCoautores(Mail);
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