﻿(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("experienciaexternaDetallesCtrl", ['AuthService', '$scope', '$rootScope',
            'ExperienciaExternaService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", 'MenuService', experienciaexternaDetallesCtrl]);

    function experienciaexternaDetallesCtrl(AuthService, $scope, $rootScope,
        ExperienciaExternaService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, MenuService) {
        $scope.rolId = MenuService.getRolId(); 
        if ($scope.rolId != 1 && $scope.rol!=1026 && $scope.rol!=4) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";

        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de está experiencia externa con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está experiencia externa con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de está experiencia externa con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está experiencia externa con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })




        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar
        ExperienciaExternaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                ExperienciaExternaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;

                    $scope.registro.clavePersona = result.data.clavePersona;
                    $scope.registro.claveUnidadAut = result.data.claveUnidad;
                });

                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
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
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }

                    $scope.ValidForm.$setDirty();
                }
            });
            
        }
        //#endregion info gral
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

            ExperienciaExternaService.AddSolicitud(Solicitud).then(
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
                    ExperienciaExternaService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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

            ExperienciaExternaService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    ExperienciaExternaService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            ExperienciaExternaService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            ExperienciaExternaService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                if ($scope.registro.fechaInicio < $scope.registro.fechaTermino || ($scope.registro.fechaTermino == null && $scope.registro.fechaInicio != null)) {
                    var Mail = {
                        "Modulo": "Capital Humano",
                        "Empleado": $scope.registro.nombrePersona,
                        "Seccion": "Experiencia Externa",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion1": "<b>Nombre de empresa:</b> " + $scope.registro.nombreEmpresa + "<br/>",
                        "Descripcion2": "<b>Giro:</b> " + $scope.registro.giro + "<br/>",
                        "Descripcion3": "<b>Puesto:</b> " + $scope.registro.puesto,
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
                    if ($scope.editAdmin == "1") {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                            $scope.registro.experienciaExternaId, 6) > 0) {
                            
                        }
                    }
                    switch (opc) {
                        case 1:
                            $scope.registro.estadoFlujoId = 2;
                            ExperienciaExternaService.update($scope.registro).then(
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
                            $scope.registro.estadoFlujoId = 1

                            ExperienciaExternaService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    ExperienciaExternaService.updateSolicitud(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Rechazado: " + $scope.justificacion,
                                        "EstadoFlujoId": 2,
                                        "idRol": 1
                                    }
                                    ExperienciaExternaService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    ExperienciaExternaService.mailNotificacion(Mail);
                                    $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                            break;
                    }
                } else {
                    toastr.error("La fecha de inicio debe ser menor a la de termino");
                }
            }
        }


        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //ExperienciaExternaService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.ValidForm.$setDirty();
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();