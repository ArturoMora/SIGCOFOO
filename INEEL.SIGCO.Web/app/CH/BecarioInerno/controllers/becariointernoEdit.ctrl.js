(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("becariointernoEditCtrl", ['AuthService', '$scope', '$rootScope', 'BecarioInternoService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH","$uibModal", becariointernoEditCtrl]);

    function becariointernoEditCtrl(AuthService, $scope, $rootScope, BecarioInternoService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH,$uibModal) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0)
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
        BecarioInternoService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de becas internas.");
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
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );
        //BecarioInternoService.getPaises().then(
        //     function (result) {
        //         $scope.paises = result.data;
        //     },
        //    function (err) {
        //        toastr.error("No se han podido cargar el catalogo de instituciones.");
        //    }
        //);
        //obtener el registro a editar
        BecarioInternoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                BecarioInternoService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombreCompleto = result.data.nombreCompleto;
                    $scope.registro.nombrePersona = $scope.registro.nombreCompleto;
                });
                
                if ($scope.registro.fechaBaja != null) {
                    $scope.registro.fechaBaja = new Date($scope.registro.fechaBaja);
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
                if ($scope.registro.fechaTerminoExt != null) {
                    if (new Date($scope.registro.fechaTerminoExt).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);
                    }
                    else {
                        $scope.registro.fechaTerminoExt = null;
                    }
                    //$scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);
                }
                if ($scope.registro.extencion == 1 || $scope.registro.extencion == true) {
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
           
            $scope.ValidForm.$setDirty();

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
                }
            });
           
        }
        //#endregion info gral
        
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
            });
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
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
            });
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
        }



        $scope.add = function () {
            if ($scope.registro.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.addF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.addF();
            }
        }


        //Funcion para agregar registro
        $scope.addF = function () {
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
              

                 //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
             
                if ($scope.registro.fechaInicioBeca > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }

               
                if ($scope.registro.fechaInicioBeca >= $scope.registro.fechaTerminoBeca) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registro.fechaBaja!=null && ($scope.registro.fechaBaja < $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja > $scope.registro.fechaTerminoBeca)) {
                    toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                    return false;
                }



                    if ($scope.registro.fechaTerminoExt != null) {
                        if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                            toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                            return false;
                        }
                    }

                /////////////////
                //Todo salio bien
                if ($scope.registro.extencion == true) {
                    $scope.registro.extencion = 1;
                } else {
                    $scope.registro.extencion = 0;
                }



                $scope.desabilitar = true;
                $scope.registro.carreraId = $scope.selectedcarrera.carreraId;
                $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.registro.paisID = $scope.selectedinstitucion.paisID;
                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }

                var registro={
                    "ClavePersona": $scope.authentication.userprofile.clavePersona,
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
                            $scope.desabilitar = false;
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
                                $scope.ValidForm.$setPristine();
                                $scope.desabilitar = false;
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );


            }
        }
        $scope.validar = function () {
            try {
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


                    if ($scope.registro.extencion == true) {
                        $scope.registro.extencion = 1;
                    } else {
                        $scope.registro.extencion = 0;
                    }
                    //Validacion Fechas
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    if ($scope.registro.fechaInicioBeca > $scope.hoy) {
                        toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaTerminoBeca > $scope.hoy) {
                        toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaInicioBeca >= $scope.registro.fechaTerminoBeca) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    }
                    if ($scope.registro.fechaBaja!=null && ($scope.registro.fechaBaja <= $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja >= $scope.registro.fechaTerminoBeca)) {
                        toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                        return false;
                    }
                    if ($scope.registro.fechaTerminoExt != null) {
                        if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                            toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                            return false;
                        }
                    }
                    if ($scope.registro.extencion == true) {
                        $scope.registro.extencion = 1;
                    } else {
                        $scope.registro.extencion = 0;
                    }
                    $scope.desabilitar = true;
                    $scope.registro.carreraId = $scope.selectedcarrera.carreraId;
                    $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                    $scope.registro.paisID = $scope.selectedinstitucion.paisID;
                    if ($scope.editarGestion == 0) {
                        $scope.registro.estadoFlujoId = 1;
                    }
                    //BecarioInternoService.update($scope.registro);
                    /////////////////
                    var Registro = {
                        "becarioInternoId": $scope.registro.becarioInternoId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro

                  
                    $scope.desabilitar = true;
                    $scope.registro.estadoFlujoId = 2;
                    BecarioInternoService.update($scope.registro).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 8,
                                            "InformacionId": $scope.registro.becarioInternoId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo": $scope.registro.becaInterna.descripcion
                                        }

                                        
                                        BecarioInternoService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        //Bitacora
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        BecarioInternoService.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombreCompleto,
                                            "Seccion": "Becario Interno",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        BecarioInternoService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.becariointerno", { seccion: 'becariointerno' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desabilitar = false;
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


        $scope.regresar = function () {
            $state.go("fichapersonal.becariointerno", { seccion: 'becariointerno' });
        }
    }
})();