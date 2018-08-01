(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tesisdirigidaDetallesCtrl", ['AuthService', '$scope', '$rootScope',
            'TesisDirigidaService', 'globalGet', '$state', '$filter',  "$stateParams", "FileUploader", "uploadFileACH", 'MenuService', tesisdirigidaDetallesCtrl]);

    function tesisdirigidaDetallesCtrl(AuthService, $scope, $rootScope,
        TesisDirigidaService, globalGet, $state, $filter,  $stateParams, FileUploader, uploadFileACH, MenuService) {
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });


        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva tesis dirigida con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de regstro de una nueva tesis dirigida con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva tesis dirigida con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de regstro de una nueva tesis dirigida con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })



        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        
        $scope.authentication = AuthService.authentication;
        
        //obtener gradoAcademicos
        TesisDirigidaService.getgradoacademico().then(
            function (result) {
                $scope.gradoacademico = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de grados academicos.");
            }
        );
        //obtener el registro a editar
        TesisDirigidaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
                TesisDirigidaService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                if ($scope.registro.fechaExamen != null) {
                    $scope.registro.fechaExamen = new Date($scope.registro.fechaExamen);
                }
                if ($scope.registro.fechaAceptacion != null) {
                    $scope.registro.fechaAceptacion = new Date($scope.registro.fechaAceptacion);
                }
                if ($scope.registro.fechaInicio != null) {
                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                }
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });

        ///////////////////////////////////////////////////////////////
        
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    
                    if (!err) {
                        
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }
                    
                });
        };
        function transferComplete(result) {
            $scope.$apply(function () {
                if (result.error === false) {
                    
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });
            
        }
        
        ///////////////////////////////////////////////////////////////
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            TesisDirigidaService.AddSolicitud(Solicitud).then(
                function (result) {

                    id2 = result.data;
                    var Bitacora = {
                        "SolicitudId": result.data,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "Descripcion": "Gestión de Ficha",
                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                        "idRol": 1
                    }
                    TesisDirigidaService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
                        return id2;
                    }, function (error) {
                        return 0;
                    });
                    if (opc == 2) {
                        
                        apruebaAdminCHfunction(Mail, id2);
                    }

                }, function (error) {
                    toastr.error("problema al registrar la bitácora");
                    console.log(error);
                    return 0;
                });
        }
        function apruebaAdminCHfunction(Mail, id2) {
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.registro.estadoFlujoId = 3;
            $scope.registro.fechaValidacion = $scope.FechaValidacionAux;
            TesisDirigidaService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    TesisDirigidaService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            TesisDirigidaService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            TesisDirigidaService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        //Funcion para agregar registro
        $scope.edit = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                var limiteSuperior = new Date();
                var limiteInferior = new Date(1975, 1, 1);

                if ($scope.registro.fechaInicio < limiteInferior) {
                    toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                    $scope.registro.fechaInicio = "";
                    return false;
                }

                if ($scope.registro.fechaTermino < limiteInferior) {
                    toastr.error("La fecha de termino ingresada no es una fecha válida.");
                    $scope.registro.fechaTermino = "";
                    return false;
                }

                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe ser menor a la fecha actual " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe ser menor a la fecha actual" + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registro.fechaAceptacion != null) {

                    if ($scope.registro.fechaAceptacion < $scope.registro.fechaTermino) {
                        toastr.error("La fecha de aceptación de la tesis debe ser mayor a la de término");
                        return false;
                    }
                }

                if ($scope.registro.fechaExamen != null) {

                    if ($scope.registro.fechaExamen <= $scope.registro.fechaAceptacion) {
                        toastr.error("La fecha de examen debe ser mayor a la de aceptación de la tesis ");
                        return false;
                    }
                }
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                $scope.desactivar = true;
                // if ($scope.registro.adjunto != null) {
                //     $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                // } else {
                //     $scope.registro.adjuntoId = null;
                // }
                for (var i = 0; i < $scope.gradoacademico.length; i++) {
                    if ($scope.registro.gradoAcademicoId == $scope.gradoacademico[i].gradoAcademicoId) {
                        $scope.gradoAux = $scope.gradoacademico[i].descripcion;
                    }
                }
                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombreCompleto,
                    "Seccion": "Tesis Dirigida",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.registro.clavePersona,
                    "Descripcion1": "<b>Titulo:</b> " + $scope.registro.titulo + "<br/>",
                    "Descripcion2": "<b>Autor:</b> " + $scope.registro.autor + "<br/>",
                    "Descripcion3": "<b>Grado académico:</b> " + $scope.gradoAux + "<br/>",
                    "Descripcion4": "<b>Palabras Clave:</b> " + $scope.registro.palabrasClave,
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.registro.tesisDirigidaId, 7) > 0) {
                        
                    }
                }
                switch (opc) {
                    case 1:
                        //Todo salio bien
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 2;
                        var registro = {
                            "GradoAcademicoId": $scope.registro.gradoAcademicoId,
                            "FechaInicio": $scope.registro.fechaInicio,
                            "FechaTermino": $scope.registro.fechaTermino,
                            "ClavePersona": $scope.authentication.userprofile.clavePersona,
                            "TesisDirigidaId": $scope.registro.tesisDirigidaId
                        };
                        TesisDirigidaService.ValidaRegistroDuplicado(registro).then(
                            function (res) {
                                if(res.data){
                                    toastr.warning("Intente cambiar el grado académico o la fechas de inicio y término");
                                    toastr.warning("Ya existe el registro!");
                                    $scope.desactivar = false;
                                    return false;
                                }
                                TesisDirigidaService.update($scope.registro).then(
                                    function (result) {
                                        if (result.data.adjuntoId != null) {
                                            $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                            $scope.registro.adjuntoId = result.data.adjuntoId;
                                            $scope.regFile = false;
                                        } else {
                                            $scope.registro.adjunto = null;
                                            $scope.registro.adjuntoId = null;
                                            $scope.regFile = true;
                                            // if (result.data.adjunto != null) {
                                            //     $scope.registro.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.registro.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.regFile = false;
                                            // } else {
                                            //     $scope.registro.adjunto = null;
                                            //     $scope.registro.adjuntoId = null;
                                            //     $scope.regFile = true;
                                            // }
                                        }
                                        $scope.ValidForm.$setPristine();
                                        toastr.success("Registro Actualizado");
                                        $scope.desactivar = false;
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                            }, function (err) {
                                console.log(err);
                            }
                        );

                        break;
                    case 2:

                        if ($scope.editAdmin != "1")
                            apruebaAdminCHfunction(Mail, id2);
                        break;
                    case 3:
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 1
                        }
                        $scope.registro.estadoFlujoId = 1;
                        TesisDirigidaService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                TesisDirigidaService.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": $scope.registro.solicitudId,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        TesisDirigidaService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada";
                                        TesisDirigidaService.mailNotificacion(Mail);
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh");
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

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //TesisDirigidaService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.ValidForm.$setDirty();
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.clean = function () {
            $scope.registro.fechaAceptacion = null;
        }

        $scope.clean2 = function () {
            $scope.registro.fechaExamen = null;
        }
    }
})();