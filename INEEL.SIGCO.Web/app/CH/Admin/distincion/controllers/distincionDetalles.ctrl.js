(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("distincionDetallesCtrl"
            , ['AuthService'
                , '$scope', '$rootScope'
                , 'DistincionService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , '$stateParams'
                , 'MenuService'
                , distincionDetallesCtrl]);
    function distincionDetallesCtrl(AuthService, $scope, $rootScope,
        DistincionService, globalGet, uploadFileACH, $state, $filter, $stateParams, MenuService) {
        $scope.rolId = MenuService.getRolId();

        if ($scope.rolId != 1 && $scope.rol != 1026 && $scope.rol != 4) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de está distinción con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está distinción con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de está distinción con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está distinción con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        var API = globalGet.get("api");
        $scope.distincion = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Extraer informacion del usuario//
        $scope.authentication = AuthService.authentication;
        //Parametros
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        //Obtene distincion
        DistincionService.getbyid(id).then(
            function (result) {
                $scope.distincion = result.data;
                $scope.registro = result.data;
                DistincionService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.distincion.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                if ($scope.distincion.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.distincion.fechaValidacion);
                }
                $scope.distincion.fechaDistincion = new Date(result.data.fechaDistincion);
                if ($scope.distincion.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (err) {
                console.error(err);
            });
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
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
                    
                    $scope.distincion.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.DistincionForm.$setDirty();
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

            DistincionService.AddSolicitud(Solicitud).then(
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
                    DistincionService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            $scope.distincion.estadoFlujoId = 3;
            $scope.distincion.fechaValidacion = $scope.FechaValidacionAux;
            $scope.distincion.ArchivoId = 0;

            DistincionService.updateValidacion($scope.distincion).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    DistincionService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            DistincionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            DistincionService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        $scope.distincionedit = function (opc) {
            if ($scope.DistincionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                $scope.fechaActual = new Date();
                if ($scope.distincion.fechaDistincion > $scope.fechaActual) {
                    // var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                    toastr.error("La fecha de obtención de distinción debe ser menor a " + $scope.ddMMyyyy);
                } else {
                    $scope.desactivar = true;
                    // if ($scope.distincion.adjunto != null) {
                    //     $scope.distincion.adjuntoId = $scope.distincion.adjunto.adjuntoId;
                    // } else {
                    //     $scope.distincion.adjuntoId = null;
                    // }
                    var Mail = {
                        "Modulo": "Capital Humano",
                        "Empleado": $scope.distincion.nombreCompleto,
                        "Seccion": "Reconocimientos",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.distincion.clavePersona,
                        "Descripcion1": "<b>Reconocimiento:</b> " + $scope.distincion.reconocimiento + "<br/>",
                        "Descripcion2": "<b>Aprobado por:</b> " + $scope.distincion.aprobado,
                        "Descripcion3": "",
                        "Descripcion4": "",
                        "Justificacion": $scope.justificacion,
                        "Estado": ""
                    }
                    if ($scope.editAdmin == "1") {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                            $scope.registro.distincionId, 4) > 0) {

                        }
                    }
                    switch (opc) {
                        case 1:
                            var registro = {
                                "ClavePersona": $scope.registro.clavePersona,
                                "FechaDistincion": $scope.distincion.fechaDistincion,
                                "DistincionId": id
                            };

                            DistincionService.ValidaRegistroDuplicado(registro).then(
                                function (res) {
                                    if (res.data) {
                                        toastr.warning("Intente cambiar las fechas de distinción");
                                        toastr.warning("Ya existe el registro!");
                                        $scope.desactivar = false;
                                        return false;
                                    }
                                    $scope.distincion.estadoFlujoId = 2;
                                    $scope.distincion.ArchivoId = 0;
                                    DistincionService.distincionedit($scope.distincion).then(
                                        function (result) {
                                            if (result.data.adjuntoId != null) {
                                                $scope.distincion.adjunto.adjuntoId = result.data.adjuntoId;
                                                $scope.distincion.adjuntoId = result.data.adjuntoId;
                                                $scope.regFile = false;
                                            } else {
                                                $scope.distincion.adjunto = null;
                                                $scope.distincion.adjuntoId = null;
                                                $scope.regFile = true;
                                                // if (result.data.adjunto != null) {
                                                //     $scope.distincion.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                                //     $scope.distincion.adjuntoId = result.data.adjunto.adjuntoId;
                                                //     $scope.regFile = false;
                                                // } else {
                                                //     $scope.distincion.adjunto = null;
                                                //     $scope.distincion.adjuntoId = null;
                                                //     $scope.regFile = true;
                                                // }
                                            }
                                            $scope.DistincionForm.$setPristine();
                                            toastr.success("Registro Actualizado");
                                            $scope.desactivar = false;
                                        },
                                        function (err) {
                                            console.error(err);
                                            $scope.desactivar = false;
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
                            $scope.distincion.estadoFlujoId = 1
                            $scope.distincion.ArchivoId = 0;

                            DistincionService.updateValidacion($scope.distincion).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    DistincionService.updateSolicitud(registro).then(
                                        function (result) {
                                            var Bitacora = {
                                                "SolicitudId": registro.solicitudId,
                                                "FechaMovimiento": new Date(),
                                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                                "Descripcion": "Rechazado: " + $scope.justificacion,
                                                "EstadoFlujoId": 2,
                                                "idRol": 1
                                            }
                                            DistincionService.AddBitacoraSolicitud(Bitacora);
                                            Mail.Estado = "Rechazada";
                                            DistincionService.mailNotificacion(Mail);
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
        }

        $scope.deleteFile = function () {
            $scope.distincion.adjunto.nombre = "eliminar";
            //DistincionService.distincionedit($scope.distincion);
            // toastr.success("Archivo Eliminado!");
            $scope.distincion.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.DistincionForm.$setDirty();
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();