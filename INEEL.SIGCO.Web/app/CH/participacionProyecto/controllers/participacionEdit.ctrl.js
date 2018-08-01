(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("participacionCtrlEdit", ['AuthService', '$scope', '$rootScope', 'ParticipacionService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", participacionCtrlEdit]);

    function participacionCtrlEdit(AuthService, $scope, $rootScope, ParticipacionService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
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
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
        ParticipacionService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                ParticipacionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                

                if ($scope.registro.fechaInicio != null) {
                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                    if ($scope.registro.fechaInicio.getFullYear() == 1900 || $scope.registro.fechaInicio.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registro.fechaInicio;
                        $scope.registro.fechaInicio = null;
                    }
                }


                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                    if ($scope.registro.fechaTermino.getFullYear() == 1900 || $scope.registro.fechaTermino.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registro.fechaTermino;
                        $scope.registro.fechaTermino = null;
                    }
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
                $scope.elemento = selectedItem;
                $scope.registro.proyecto.nombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                //$scope.unidadOrganizacionalAut = selectedItem.unidadOrganizacionalId;
                debugger;
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
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
        $scope.update = function () {
            if ($scope.registro.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.updateF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.updateF();
            }
        }
        //Funcion para agregar registro
        $scope.updateF = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                //if ($scope.registro.fechaInicio != null && $scope.registro.fechaInicio > $scope.hoy) {
                //    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                //if ($scope.registro.fechaTermino != null && $scope.registro.fechaTermino > $scope.hoy) {
                //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                if ($scope.registro.fechaInicio != null && $scope.registro.fechaTermino != null && $scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registro.fechaInicio == null) {
                    $scope.registro.fechaInicio = new Date('01/01/1900');
                }
                if ($scope.registro.fechaTermino == null) {
                    $scope.registro.fechaTermino = new Date('01/01/1900');
                }
                ////////////
                $scope.comparativoSinHistorico = $filter('date')(new Date('01/01/1900'), 'dd/MM/yyyy');
                $scope.FechaInicioSH = $filter('date')(new Date($scope.registro.fechaInicio), 'dd/MM/yyyy');
                $scope.FechaTerminoSH = $filter('date')(new Date($scope.registro.fechaTermino), 'dd/MM/yyyy');
                if ($scope.FechaInicioSH == $scope.comparativoSinHistorico && $scope.FechaTerminoSH == $scope.comparativoSinHistorico)
                {
                        $scope.desactivar = true;
                        if ($scope.editarGestion == 0) {
                            $scope.registro.estadoFlujoId = 1;
                        }
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
                                if ($scope.registro.fechaInicio != null) {
                                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                                    if ($scope.registro.fechaInicio.getFullYear() == 1900 || $scope.registro.fechaInicio.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registro.fechaInicio;
                                        $scope.registro.fechaInicio = null;
                                    }
                                }


                                if ($scope.registro.fechaTermino != null) {
                                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                                    if ($scope.registro.fechaTermino.getFullYear() == 1900 || $scope.registro.fechaTermino.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registro.fechaTermino;
                                        $scope.registro.fechaTermino = null;
                                    }
                                }
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                } else {
                    //if (a != 2) {
                    //    if ($scope.registro.fechaInicio > $scope.hoy) {
                    //        toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    //        return false;
                    //    }
                    //}
                    if ($scope.registro.fechaInicio < $scope.registro.fechaTermino || ($scope.registro.fechaTermino == null && $scope.registro.fechaInicio != null) && a != 2) {
                        $scope.desactivar = true;
                        if ($scope.editarGestion == 0) {
                            $scope.registro.estadoFlujoId = 1;
                        }
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
                                if ($scope.registro.fechaInicio != null) {
                                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                                    if ($scope.registro.fechaInicio.getFullYear() == 1900 || $scope.registro.fechaInicio.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registro.fechaInicio;
                                        $scope.registro.fechaInicio = null;
                                    }
                                }


                                if ($scope.registro.fechaTermino != null) {
                                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                                    if ($scope.registro.fechaTermino.getFullYear() == 1900 || $scope.registro.fechaTermino.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registro.fechaTermino;
                                        $scope.registro.fechaTermino = null;
                                    }
                                }
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    } else {
                        toastr.error("La fecha de inicio debe ser menor a la de termino");
                    }
                }



                
            }
        }
        $scope.validar = function () {
            try {
                if ($scope.registro.fechaInicio == null || $scope.registro.fechaTermino == null) {
                    $scope.requeridas = true;
                    toastr.error("Complete los datos requeridos de período de participación");
                    return false;
                }
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var dia = new Date($scope.registro.fechaInicio).getFullYear();
                    var dia2 = new Date($scope.registro.fechaTermino).getFullYear();
                    if (dia != 1899 && dia != 1900) {
                        if (dia2 != 1899 && dia2 != 1900) {
                            $scope.hoy = new Date();
                            $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                            if ($scope.registro.fechaInicio > $scope.hoy) {
                                toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                                return false;
                            }
                            if ($scope.registro.fechaTermino > $scope.hoy) {
                                toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                                return false;
                            }
                            if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                                toastr.error("La fecha de inicio debe ser menor a la de término");
                                return false;
                            }
                        }
                    }
                    var Registro = {
                        "personalProyectoId": $scope.registro.personalProyectoId,
                        "estadoFlujoId": 8
                    };
                    $scope.updateF();
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    $scope.registro.estadoFlujoId = 8;
                    ParticipacionService.update($scope.registro).then(
                                    function (result) {
                                        debugger;
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 14,
                                            "InformacionId": $scope.registro.personalProyectoId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 8,
                                            "ClaveUnidadAut": $scope.registro.proyecto.unidadOrganizacionalId
                                        }
                                        ParticipacionService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        ParticipacionService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Participación en Proyecto",
                                            "TipoCorreo": "SolicitudGerenteViaProyecto",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "UnidadOrganizacionalId": $scope.registro.proyecto.unidadOrganizacionalId
                                        }
                                        ParticipacionService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.participacion", { seccion: 'participacion' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                        $rootScope.globalRegresar();
                                    });
                }
            } catch (e) {
                console.log(e);
                throw e;
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