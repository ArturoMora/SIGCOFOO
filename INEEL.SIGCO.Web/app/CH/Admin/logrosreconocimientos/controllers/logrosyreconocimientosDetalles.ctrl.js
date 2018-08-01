(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("logrosreconocimientosDetailsAdmin", ['AuthService', '$scope', 'logrosreconocimientosService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", 'MenuService', logrosreconocimientosDetailsAdmin]);

    function logrosreconocimientosDetailsAdmin(AuthService, $scope, logrosreconocimientosService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId(); 


        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo reconocimiento con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo reconocimento con la siguiente justificación: " + $scope.justificacion + " ? ";



        if ($scope.rolId != 1 && $scope.rol!=1026 ) { toastr.error("No Autorizado"); $state.go("home"); return false; }
        var API = globalGet.get("api");
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar
        logrosreconocimientosService.getbyid(id).then(
            function (result) {
                logrosreconocimientosService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                $scope.registro = result.data;
                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
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

                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombrePersona,
                    "Seccion": "Logros y Reconocimientos",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.registro.clavePersona,
                    "Descripcion1": "<b>Título:</b> " + $scope.registro.descripcion + "<br/>",
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
                    case 1:
                        $scope.registro.estadoFlujoId = 2;
                        logrosreconocimientosService.update($scope.registro).then(
                                        function (result) {
                                            if (result.data.adjuntoId != null) {
                                                $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                                $scope.registro.adjuntoId = result.data.adjuntoId;
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
                        break;
                    case 2:
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 3
                        }
                        $scope.registro.estadoFlujoId = 3;
                        $scope.registro.fechaValidacion = $scope.FechaValidacionAux;

                        logrosreconocimientosService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Aprobada!");
                                logrosreconocimientosService.updateSolicitud(registro).then(
                            function (result) {
                                var Bitacora = {
                                    "SolicitudId": registro.solicitudId,
                                    "FechaMovimiento": new Date(),
                                    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                    "Descripcion": "Aprobado: " + $scope.justificacion,
                                    "EstadoFlujoId": registro.estadoFlujoId,
                                    "idRol": 1
                                }
                                logrosreconocimientosService.AddBitacoraSolicitud(Bitacora);
                                Mail.Estado = "Aprobada"
                                logrosreconocimientosService.mailNotificacion(Mail);
                                $state.go("solicitudesrh");
                            })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                        break;
                    case 3:
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 1
                        }
                        $scope.registro.estadoFlujoId = 1

                        logrosreconocimientosService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                logrosreconocimientosService.updateSolicitud(registro).then(
                            function (result) {
                                var Bitacora = {
                                    "SolicitudId": registro.solicitudId,
                                    "FechaMovimiento": new Date(),
                                    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                    "Descripcion": "Rechazado: " + $scope.justificacion,
                                    "EstadoFlujoId": 2,
                                    "idRol": 1
                                }
                                logrosreconocimientosService.AddBitacoraSolicitud(Bitacora);
                                Mail.Estado = "Rechazada"
                                logrosreconocimientosService.mailNotificacion(Mail);
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