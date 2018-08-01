(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("logrosreconocimientosCtrlEdit", ['AuthService', '$scope', '$rootScope', 'logrosreconocimientosService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", logrosreconocimientosCtrlEdit]);

    function logrosreconocimientosCtrlEdit(AuthService, $scope, $rootScope, logrosreconocimientosService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0);
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        var API = globalGet.get("api");
        var id = $rootScope.idG;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos

        //obtener el registro a editar
        logrosreconocimientosService.getbyid(id).then(
            function (result) {
                logrosreconocimientosService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                $scope.registro = result.data;
                $scope.registro.fechaObtencion = new Date($scope.registro.fechaObtencion);

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
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            debugger;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
            function (err, result) {
                debugger;
                if (!err) {
                    console.log("result:");
                    console.log(result);
                    debugger;
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
                debugger;
            });
        };
        function transferComplete(result) {
            debugger
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                }
            });
            debugger;
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                ////Validacion Fechas
                //$scope.hoy = new Date();
                //$scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                //if ($scope.registro.fechaInicio > $scope.hoy) {
                //    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                //if ($scope.registro.fechaTermino > $scope.hoy) {
                //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                //if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                //    toastr.error("La fecha de inicio debe ser menor a la de término");
                //    return false;
                //}
                //if ($scope.editarGestion == 0) {
                //    $scope.registro.estadoFlujoId = 1;
                //}
                /////////////////
                $scope.desactivar = true;
                logrosreconocimientosService.update($scope.registro).then(
                    function (result) {
                        if (result.data.adjuntoId != null) {
                            $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                            $scope.regFile = false;
                        } else {
                            if (result.data.adjunto != null) {
                                $scope.registro.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                $scope.registro.adjuntoId = result.data.adjunto.adjuntoId;
                                $scope.regFile = false;
                            } else {
                                $scope.registro.adjunto = null;
                                $scope.registro.adjuntoId = null;
                                $scope.regFile = true;
                            }
                        }
                        toastr.success("Registro Actualizado");
                        $scope.desactivar = false;
                    },
                    function (err) {
                        $scope.desactivar = false;
                        console.error(err);
                    });
            }
        }
        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    ////Validacion Fechas
                    //$scope.hoy = new Date();
                    //$scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    //if ($scope.registro.fechaInicio > $scope.hoy) {
                    //    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    //    return false;
                    //}
                    //if ($scope.registro.fechaTermino > $scope.hoy) {
                    //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    //    return false;
                    //}
                    //if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    //    toastr.error("La fecha de inicio debe ser menor a la de término");
                    //    return false;
                    //}
                    /////////////////
                    var Registro = {
                        "logrosReconocimientosId": $scope.registro.logrosReconocimientosId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    logrosreconocimientosService.updateEstado(Registro).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 26,
                                            "InformacionId": $scope.registro.logrosReconocimientosId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2
                                        }
                                        logrosreconocimientosService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        logrosreconocimientosService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Logros y Reconocimientos",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        logrosreconocimientosService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.logrosreconocimientos", { seccion: 'logrosreconocimientos' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //logrosreconocimientosService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();