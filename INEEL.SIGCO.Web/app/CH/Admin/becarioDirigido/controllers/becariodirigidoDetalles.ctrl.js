(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("becariodirigidoDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'BecarioDirigidoService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "MenuService", becariodirigidoDetallesCtrl]);

    function becariodirigidoDetallesCtrl(AuthService, $scope, $rootScope,
        BecarioDirigidoService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026 && $scope.rol != 4) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de esté becario dirigido con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de esté becario dirigido con la siguiente justificación: " + $scope.justificacion + " ? ";

        $scope.areaasignada = {};
        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        BecarioDirigidoService.getTipoBecas().then(
            function (result) {
                $scope.becas = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de becas.");
            }
        );
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            BecarioDirigidoService.AddSolicitud(Solicitud).then(
                function (result) {

                    id2 = result.data;
                    console.log("id de solicitud:");
                    console.log(result.data);

                    var Bitacora = {
                        "SolicitudId": result.data,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "Descripcion": "Gestión de Ficha",
                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                        "idRol": 1
                    }
                    BecarioDirigidoService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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

            BecarioDirigidoService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    BecarioDirigidoService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            BecarioDirigidoService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            BecarioDirigidoService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }

        //obtener el registro a editar
        BecarioDirigidoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                BecarioDirigidoService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombreEmpleado = result.data.nombreCompleto;
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
                $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                $scope.areaasignada.claveUnidad = $scope.registro.claveUnidad;
                $scope.areaasignada.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                //$scope.areaasignada.fechaEfectiva = $scope.registro.unidadOrganizacional.fechaEfectiva;
                $scope.registro.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
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
            $scope.desactivar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desactivar = false;
        }
        ////////////////////////////////////Buscar EO
        $scope.ElementoSeleccionado = {};
        $scope.openArea = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacional.html',
                controller: 'EstructuraOrganizacionalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                //$scope.ElementoSeleccionado = selectedItem;
                $scope.registro.nombreUnidad = selectedItem.nombreUnidad;
                $scope.registro.claveUnidad = selectedItem.claveUnidad;
                //$scope.registro.fechaEfectiva = selectedItem.fechaEfectiva;
            });
        }
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
                        console.log("result:");
                        console.log(result);
                        
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
                    $scope.ValidForm.$setDirty();
                }
            });
            
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
                $scope.registro.claveUnidad = $scope.areaasignada.claveUnidad;
                //$scope.registro.fechaEfectiva = $scope.areaasignada.fechaEfectiva;
                if ($scope.registro.proyectoNombre == null || $scope.registro.proyectoNombre == undefined) {
                    $scope.registro.proyectoNombre = "";
                }
                if ($scope.registro.fechaInicio < $scope.registro.fechaTermino) {
                    var Mail = {
                        "Modulo": "Capital Humano",
                        "Empleado": $scope.registro.nombreEmpleado,
                        "Seccion": "Becario Dirigido",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion1": "<b>Nombre de becario:</b> " + $scope.registro.nombreBecario + "<br/>",
                        "Descripcion2": "<b>Área asignada:</b> " + $scope.areaasignada.nombreUnidad + "<br/>",
                        "Descripcion3": "<b>Institución que otorga la beca:</b> " + $scope.registro.otorganteBeca + "<br/>",
                        "Descripcion4": "<b>Proyecto:</b>" + $scope.registro.proyectoNombre,
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
                            $scope.registro.becarioDirigidoId, 9) > 0) {
                            
                        }
                    }
                    switch (opc) {
                        case 1:

                            $scope.registro.estadoFlujoId = 2;
                            var registro = {
                                "ClavePersona": $scope.authentication.userprofile.clavePersona,
                                "TipoBecaId": $scope.registro.tipoBecaId,
                                "NumeroBecario": $scope.registro.numeroBecario,
                                "BecarioDirigidoId": $scope.registro.becarioDirigidoId
                            };

                            BecarioDirigidoService.ValidaRegistroDuplicado(registro).then(
                                function (res) {
                                    BecarioDirigidoService.update($scope.registro).then(
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
                            $scope.registro.estadoFlujoId = 1

                            BecarioDirigidoService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    BecarioDirigidoService.updateSolicitud(registro).then(
                                        function (result) {
                                            var Bitacora = {
                                                "SolicitudId": registro.solicitudId,
                                                "FechaMovimiento": new Date(),
                                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                                "Descripcion": "Rechazado: " + $scope.justificacion,
                                                "EstadoFlujoId": 2,
                                                "idRol": 1
                                            }
                                            BecarioDirigidoService.AddBitacoraSolicitud(Bitacora);
                                            Mail.Estado = "Rechazada"
                                            BecarioDirigidoService.mailNotificacion(Mail);
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
            //BecarioDirigidoService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm.$setDirty();
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();