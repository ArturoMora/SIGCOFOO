(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("becariointernoDetallesCtrl", ['AuthService', '$scope', '$rootScope',
            'BecarioInternoService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", 'MenuService', becariointernoDetallesCtrl]);

    function becariointernoDetallesCtrl(AuthService, $scope, $rootScope,
        BecarioInternoService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal, MenuService) {
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


        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de esté becario interno con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de esté becario interno con la siguiente justificación: " + $scope.justificacion + " ? ";




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
        BecarioInternoService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de becas internas.");
            }
        );
        BecarioInternoService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );
        BecarioInternoService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de instituciones.");
            }
        );
        //obtener el registro a editar
        BecarioInternoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                BecarioInternoService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                if ($scope.registro.fechaBaja != null) {
                    $scope.registro.fechaBaja = new Date($scope.registro.fechaBaja);
                }
                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    if (new Date($scope.registro.fechaValidacion).getFullYear() > 1901) {
                        $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                    }
                    else {
                        $scope.FechaValidacionAux = new Date();
                    }
                    //$scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }


                $scope.registro.fechaInicioBeca = new Date($scope.registro.fechaInicioBeca);
                //$scope.registro.fechaTerminoBeca = new Date($scope.registro.fechaTerminoBeca);
                if ($scope.registro.fechaTerminoBeca != null) {
                    if (new Date($scope.registro.fechaTerminoBeca).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoBeca = new Date($scope.registro.fechaTerminoBeca);
                    }
                    else {
                        $scope.registro.fechaTerminoBeca = null;
                    }
                }
                if ($scope.registro.extencion == 1) {
                    $scope.registro.extencion = true;
                    if (new Date($scope.registro.fechaTerminoExt).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);
                    }
                    else {
                        $scope.registro.fechaTerminoExt = null;
                    }
                    //$scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);

                } else {
                    $scope.registro.extencion = false;
                    $scope.registro.fechaTerminoExt = null;
                }

                $scope.selectedcarrera = $scope.registro.carrera;
                $scope.selectedinstitucion = $scope.registro.institucion;


                //$scope.carrerasset = $scope.registro.carrera.originalObject;
                //$scope.institucionesset = $scope.registro.institucion.originalObject;
                //$scope.paisesset = $scope.registro.pais;


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
                ext: "pdf;doc;docx",/* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {

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

                });
        };
        function transferComplete(result) {

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

        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            BecarioInternoService.AddSolicitud(Solicitud).then(
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
                    BecarioInternoService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
                        return id2;
                    }, function (error) {
                        return 0;
                    });
                    if (opc == 2) {
                        debugger;
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
            BecarioInternoService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    BecarioInternoService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            BecarioInternoService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            BecarioInternoService.mailNotificacion(Mail);
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
                if ($scope.registro.extencion == false) {
                    $scope.registro.fechaTerminoExt = null;
                }
                if ($scope.registro.extencion == true && $scope.registro.fechaTerminoExt == null) {
                    toastr.error("Ingrese una fecha de extensión");
                    return false;
                }
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicioBeca > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                //if ($scope.registro.fechaTerminoBeca > $scope.hoy) {
                //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                if ($scope.registro.fechaInicioBeca >= $scope.registro.fechaTerminoBeca) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                if ($scope.registro.fechaBaja != null && ($scope.registro.fechaBaja <= $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja >= $scope.registro.fechaTerminoBeca)) {
                    toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                    return false;
                }
                if ($scope.registro.fechaTerminoExt != null) {
                    if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                        toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                        return false;
                    }
                }

                $scope.desactivar = true;
                if ($scope.registro.adjunto != null) {
                    $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                } else {
                    $scope.registro.adjuntoId = null;
                }


                $scope.registro.carreraId = $scope.selectedcarrera.carreraId;
                $scope.AuxNombreCarrera = $scope.selectedcarrera.descripcion;
                $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.AuxNombreinstitucion = $scope.selectedinstitucion.descripcion;
                $scope.registro.paisID = $scope.selectedinstitucion.paisID;
                $scope.AuxNombrePais = $scope.selectedinstitucion.pais.descripcion;
                for (var i = 0; i < $scope.becasinternas.length; i++) {
                    if ($scope.registro.becaInternaId == $scope.becasinternas[i].becaInternaId) {
                        $scope.AuxnombreBeca = $scope.becasinternas[i].descripcion;
                    }
                }

                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombreCompleto,
                    "Seccion": "Becario Interno",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.registro.clavePersona,
                    "Descripcion1": "<b>Beca interna:</b> " + $scope.AuxnombreBeca + "<br/>",
                    "Descripcion2": "<b>Carrera:</b> " + $scope.AuxNombreCarrera + "<br/>",
                    "Descripcion3": "<b>Institución:</b> " + $scope.AuxNombreinstitucion + "<br/>",
                    "Descripcion4": "<b>País:</b> " + $scope.AuxNombrePais,
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                if ($scope.registro.extencion == true) {
                    $scope.registro.extencion = 1;
                } else {
                    $scope.registro.extencion = 0;
                }
                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.registro.becarioInternoId, 8) > 0) {
                        debugger;
                    }
                }

                switch (opc) {
                    case 1:
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 2;

                        var registro = {
                            "ClavePersona": $scope.registro.clavePersona,
                            "BecaInternaId": $scope.registro.becaInternaId,
                            "FechaInicioBeca": $scope.registro.fechaInicioBeca,
                            "FechaTerminoBeca": $scope.registro.fechaTerminoBeca,
                            "BecarioInternoId": $scope.registro.becarioInternoId
                        };
                        BecarioInternoService.ValidaRegistroDuplicado(registro).then(
                            function (res) {
                                if(res.data){
                                    toastr.warning("Intente cambiar el tipo de beca o las fecha de inicio o término");
                                    toastr.warning("Ya existe el registro!");
                                    $scope.desactivar = false;
                                    return false;
                                }
                                BecarioInternoService.update($scope.registro).then(
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
                        $scope.registro.estadoFlujoId = 1;
                        BecarioInternoService.update($scope.registro).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada");
                                BecarioInternoService.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        BecarioInternoService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada"
                                        BecarioInternoService.mailNotificacion(Mail);
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
            //BecarioInternoService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm.$setDirty();
        }

        $scope.clean = function () {
            $scope.registro.fechaBaja = null;
        }

        $scope.clean2 = function () {
            $scope.registro.fechaTerminoExt = null;
        }


        //modal carreras
        $scope.opencarreras = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacarreras.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.carrera = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedcarrera = selectedItem;
                $scope.selectedcarrera.carreraId = selectedItem.carreraId;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.selectedinstitucion.institucionID = selectedItem.institucionID;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }




    }
})();