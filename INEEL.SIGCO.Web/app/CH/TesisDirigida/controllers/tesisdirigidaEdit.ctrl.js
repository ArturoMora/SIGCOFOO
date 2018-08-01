(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tesisdirigidaEditCtrl", ['AuthService', '$scope','$rootScope', 'TesisDirigidaService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH",'$uibModal', tesisdirigidaEditCtrl]);

    function tesisdirigidaEditCtrl(AuthService, $scope, $rootScope, TesisDirigidaService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
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
        

        TesisDirigidaService.getgradoacademico().then(
             function (result) {
                 $scope.gradoacademico = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de grados academicos.");
            }
        );
        //obtener el registro a editar
        TesisDirigidaService.getbyid(id).then(
            function (result) {
                TesisDirigidaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombreCompleto = result.data.nombreCompleto;
                    $scope.registro.nombrePersona = $scope.registro.nombreCompleto ;
                });
                $scope.registro = result.data;
                if ($scope.registro.fechaExamen != null) {
                    $scope.registro.fechaExamen = new Date($scope.registro.fechaExamen);
                }
                if ($scope.registro.fechaAceptacion != null) {
                    $scope.registro.fechaAceptacion = new Date($scope.registro.fechaAceptacion);
                }
                if ($scope.registro.fechaInicio != null) {
                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                }
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
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
           
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
        ///////////////////////////////////////////////////////////////
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
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');

                var limiteSuperior = new Date();
                var limiteInferior = new Date(1975, 1, 1);
                              
                if ($scope.registro.fechaInicio < limiteInferior) {
                    toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                    $scope.registro.fechaInicio = "";
                    return false;
                }

                if ($scope.registro.fechaTermino < limiteInferior) {
                    toastr.error("La fecha de termino ingresada no es una fecha válida.");
                    $scope.registro.fechaTermino = "";
                    return false;
                }
                
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe ser menor a la fecha actual " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe ser menor a la fecha actual" + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                
                if ($scope.registro.fechaAceptacion != null) {

                    if ($scope.registro.fechaAceptacion < $scope.registro.fechaTermino) {
                        toastr.error("La fecha de aceptación de la tesis debe ser mayor a la de término");
                        return false;
                    }
                }

                if ($scope.registro.fechaExamen != null) {

                    if ($scope.registro.fechaExamen <= $scope.registro.fechaAceptacion) {
                        toastr.error("La fecha de examen debe ser mayor a la de aceptación de la tesis ");
                        return false;
                    }
                }


                //Todo salio bien
                $scope.desabilitar = true;
                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }
                var registro={
                    "GradoAcademicoId": $scope.registro.gradoAcademicoId,
                    "FechaInicio": $scope.registro.fechaInicio,
                    "FechaTermino": $scope.registro.fechaTermino,
                    "ClavePersona": $scope.authentication.userprofile.clavePersona,
                    "TesisDirigidaId": $scope.registro.tesisDirigidaId
                };
                TesisDirigidaService.ValidaRegistroDuplicado(registro).then(
                    function(res){
                        if(res.data){
                            toastr.warning("Intente cambiar el grado académico o la fechas de inicio y término");
                            toastr.warning("Ya existe el registro!");
                            $scope.desabilitar = false;
                            return false;
                        }
                        TesisDirigidaService.update($scope.registro).then(
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
                                toastr.success("Registro Actualizado");
                                $scope.ValidForm.$setPristine();
                                $scope.desabilitar = false;
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    },function(err){
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
                    //Validacion Fechas
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');


                    var limiteSuperior = new Date();
                    var limiteInferior = new Date(1975, 1, 1);

                    if ($scope.registro.fechaInicio < limiteInferior) {
                        toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                        $scope.registro.fechaInicio = "";
                        return false;
                    }

                    if ($scope.registro.fechaTermino < limiteInferior) {
                        toastr.error("La fecha de termino ingresada no es una fecha válida.");
                        $scope.registro.fechaTermino = "";
                        return false;
                    }

                    if ($scope.registro.fechaInicio > $scope.hoy) {
                        toastr.error("La fecha de inicio debe ser menor a la fecha actual " + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaTermino > $scope.hoy) {
                        toastr.error("La fecha de término debe ser menor a la fecha actual" + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    }

                    if ($scope.registro.fechaAceptacion != null) {

                        if ($scope.registro.fechaAceptacion < $scope.registro.fechaTermino) {
                            toastr.error("La fecha de aceptación de la tesis debe ser mayor a la de término");
                            return false;
                        }
                    }

                    if ($scope.registro.fechaExamen != null) {

                        if ($scope.registro.fechaExamen <= $scope.registro.fechaAceptacion) {
                            toastr.error("La fecha de examen debe ser mayor a la de aceptación de la tesis ");
                            return false;
                        }
                    }

                    var Registro = {
                        "tesisDirigidaId": $scope.registro.tesisDirigidaId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desabilitar = true;
                    $scope.registro.estadoFlujoId = 2;
                    TesisDirigidaService.update($scope.registro).then(
                        function (result) {
                            
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 7,
                                            "InformacionId": $scope.registro.tesisDirigidaId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo" : $scope.registro.titulo
                                        }
                                        TesisDirigidaService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        TesisDirigidaService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombreCompleto,
                                            "Seccion": "Tesis Dirigida",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        TesisDirigidaService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.tesisdirigida", { seccion: 'tesisdirigida' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desabilitar = false;
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
            //TesisDirigidaService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.clean = function () {
            $scope.registro.fechaAceptacion = null;
        }

        $scope.clean2 = function () {
            $scope.registro.fechaExamen = null;
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.tesisdirigida", { seccion: 'tesisdirigida' });
        }
    }
})();