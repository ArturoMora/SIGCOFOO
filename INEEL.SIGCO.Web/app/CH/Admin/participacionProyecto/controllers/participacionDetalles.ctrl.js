(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("participacionDetallesCtrl", ['AuthService', '$scope', 'ParticipacionService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", 'MenuService', participacionDetallesCtrl]);

    function participacionDetallesCtrl(AuthService, $scope, ParticipacionService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId(); if ($scope.rolId != 1) { toastr.error("No Autorizado"); $state.go("home"); return false; }
        var API = globalGet.get("api");
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar
        ParticipacionService.getbyid(id).then(
            function (result) {
                ParticipacionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                $scope.registro = result.data;
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
        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterGetCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.elemento = selectedItem;
                $scope.registro.proyecto.nombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            debugger;
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
                if ($scope.registro.fechaInicio < $scope.registro.fechaTermino || ($scope.registro.fechaTermino == null && $scope.registro.fechaInicio != null)) {
                    var Mail = {
                        "Modulo": "Capital Humano",
                        "Empleado": $scope.registro.nombrePersona,
                        "Seccion": "Participación en Proyecto",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion1": "<b>Proyecto:</b> " + $scope.registro.proyectoId + "<br/>",
                        "Descripcion2": "<b>Nombre de Proyecto:</b> " + $scope.registro.proyecto.nombre + "<br/>",
                        "Descripcion3": "<b>Participación:</b> " + $scope.registro.participacion,
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
                        case 1:
                            $scope.registro.estadoFlujoId = 2;
                            ParticipacionService.update($scope.registro).then(
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

                            ParticipacionService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Aprobada!");
                                    ParticipacionService.updateSolicitud(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado: " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 1
                                    }
                                    ParticipacionService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    ParticipacionService.mailNotificacion(Mail);
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

                            ParticipacionService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    ParticipacionService.updateSolicitud(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Rechazado: " + $scope.justificacion,
                                        "EstadoFlujoId": 2,
                                        "idRol": 1
                                    }
                                    ParticipacionService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    ParticipacionService.mailNotificacion(Mail);
                                    $state.go("solicitudesrh");
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
            //ParticipacionService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();