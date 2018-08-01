(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("asociacionDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'AsociacionesService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", '$uibModal', 'MenuService', asociacionDetallesCtrl]);

    function asociacionDetallesCtrl(AuthService, $scope, $rootScope, AsociacionesService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026 && $scope.rol != 4) { toastr.error("No Autorizado"); $state.go("home"); return false; }
        $scope.justificacion = messageDefaultAprobacionAdminCH_ ;
        $scope.aprobacionQ = " ¿Seguro que desea aprobar está asociación con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está asociación con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar está asociación con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de está asociación con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.asociacion = {};

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        ////? ach
        AsociacionesService.getAsociaciones()
           .then(
           function (result) {
               $scope.asociaciones = result.data;
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
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.asociacion.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.validacionForm.$setDirty();
                }
            });

        }
        //#endregion info gral

        //modal asociaciones
        $scope.openAsociaciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listaasociaciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.asociacion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $scope.asociacion = item;
                        $uibModalInstance.close($scope.asociacion);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.asociacion.asociacion = selectedItem;
                $scope.asociacion.asociacionId = selectedItem.asociacionId;
                $scope.validacionForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //obtener el registro a editar
        AsociacionesService.GetById(id).then(
            function (result) {
                $scope.asociacion = result.data;
                AsociacionesService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.asociacion.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro = $scope.asociacion;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                //$scope.FechaValidacionAux = new Date();

                if ($scope.asociacion.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.asociacion.fechaValidacion);
                }
                $scope.asociacion.fechaInicio = new Date($scope.asociacion.fechaInicio);
                $scope.asociacion.fechaTermino = new Date($scope.asociacion.fechaTermino);
                if ($scope.asociacion.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            AsociacionesService.AddSolicitud(Solicitud).then(
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
                    AsociacionesService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            $scope.asociacion.estadoFlujoId = 3;
            $scope.asociacion.fechaValidacion = $scope.FechaValidacionAux;

            AsociacionesService.updateValidacion($scope.asociacion).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    AsociacionesService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            AsociacionesService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            AsociacionesService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }

        $scope.save = function (opc) {

            if ($scope.validacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                var date = new Date();
                $scope.formato = $filter('date')(new Date(), 'dd/MM/yyyy');
                var fechaInicio = new Date($scope.asociacion.fechaInicio);
                var fechaTermino = new Date($scope.asociacion.fechaTermino);
                if (fechaInicio >= fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a fecha de termino");
                } else {
                    if (fechaTermino <= fechaInicio) {
                        toastr.error("La fecha de termino debe ser mayor a fecha de inicio");
                    } else {
                        var Mail = {
                            "Modulo": "Capital Humano",
                            "Empleado": $scope.asociacion.nombreCompleto,
                            "Seccion": "Asociación",
                            "TipoCorreo": 2,
                            "ClavePersona": $scope.asociacion.clavePersona,
                            "Descripcion1": "<b>Asociación:</b> " + $scope.asociacion.asociacion.descripcion + "<br/>",
                            "Descripcion2": "<b>Participación:</b> " + $scope.asociacion.participacion,
                            "Descripcion3": "",
                            "Descripcion4": "",
                            "Justificacion": $scope.justificacion,
                            "Estado": ""
                        }
                        $scope.desactivar = true;
                        if ($scope.asociacion.adjunto != null) {
                            $scope.asociacion.adjuntoId = $scope.asociacion.adjunto.adjuntoId;
                        } else {
                            $scope.asociacion.adjuntoId = null;
                        }

                        if ($scope.editAdmin == "1") {
                            if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                                $scope.registro.asociacionesId, 3) > 0) {

                            }
                        }
                        switch (opc) {
                            case 1:
                                var registro = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "AsociacionId": $scope.asociacion.asociacionId,
                                    "FechaInicio": $scope.asociacion.fechaInicio,
                                    "FechaTermino": $scope.asociacion.fechaTermino,
                                    "AsociacionesId": id
                                };

                                AsociacionesService.ValidaRegistroDuplicado(registro).then(
                                    function (res) {
                                        $scope.asociacion.estadoFlujoId = 2;
                                        AsociacionesService.update($scope.asociacion).then(
                                            function (result) {
                                                if (result.data.adjuntoId != null) {
                                                    $scope.asociacion.adjunto.adjuntoId = result.data.adjuntoId;
                                                    $scope.asociacion.adjuntoId = result.data.adjuntoId;
                                                    $scope.regFile = false;
                                                } else {
                                                    $scope.asociacion.adjunto = null;
                                                    $scope.asociacion.adjuntoId = null;
                                                    $scope.regFile = true;
                                                    // if (result.data.adjunto != null) {
                                                    //     $scope.asociacion.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                                    //     $scope.asociacion.adjuntoId = result.data.adjunto.adjuntoId;
                                                    //     $scope.regFile = false;
                                                    // } else {
                                                    //     $scope.asociacion.adjunto = null;
                                                    //     $scope.asociacion.adjuntoId = null;
                                                    //     $scope.regFile = true;
                                                    // }
                                                }
                                                $scope.validacionForm.$setPristine();
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

                                AsociacionesService.update($scope.asociacion).then(
                                    function (result) {
                                        if (result.data.adjuntoId != null) {
                                            $scope.asociacion.adjunto.adjuntoId = result.data.adjuntoId;
                                            $scope.asociacion.adjuntoId = result.data.adjuntoId;
                                            $scope.regFile = false;
                                        } else {
                                            $scope.asociacion.adjunto = null;
                                            $scope.asociacion.adjuntoId = null;
                                            $scope.regFile = true;
                                            // if (result.data.adjunto != null) {
                                            //     $scope.asociacion.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.asociacion.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.regFile = false;
                                            // } else {
                                            //     $scope.asociacion.adjunto = null;
                                            //     $scope.asociacion.adjuntoId = null;
                                            //     $scope.regFile = true;
                                            // }
                                        }
                                        $scope.validacionForm.$setPristine();
                                        if ($scope.editAdmin != "1")
                                            apruebaAdminCHfunction(Mail, id2);
                                    });

                                break;
                            case 3:
                                var registro = {
                                    "solicitudId": id2,
                                    "estadoFlujoId": 1
                                }
                                $scope.asociacion.estadoFlujoId = 1

                                AsociacionesService.updateValidacion($scope.asociacion).then(
                                    function (result) {
                                        toastr.success("Solicitud Rechazada!");
                                        AsociacionesService.updateSolicitud(registro).then(
                                            function (result) {
                                                var Bitacora = {
                                                    "SolicitudId": registro.solicitudId,
                                                    "FechaMovimiento": new Date(),
                                                    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                                    "Descripcion": "Rechazado: " + $scope.justificacion,
                                                    "EstadoFlujoId": 2,
                                                    "idRol": 1
                                                }
                                                AsociacionesService.AddBitacoraSolicitud(Bitacora);
                                                Mail.Estado = "Rechazada"
                                                AsociacionesService.mailNotificacion(Mail);
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
        }


        $scope.deleteFile = function () {
            $scope.asociacion.adjunto.nombre = "eliminar";
            //AsociacionesService.update($scope.asociacion);
            //toastr.success("Archivo Eliminado!");
            $scope.asociacion.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.validacionForm.$setDirty();
        }
    }
})();