(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formacionacdemicaEditCtrl", ['AuthService', '$scope', '$rootScope', 'FormacionAcademicaService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", formacionacdemicaEditCtrl]);

    function formacionacdemicaEditCtrl(AuthService, $scope, $rootScope, FormacionAcademicaService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
        window.scrollTo(0, 0)
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        var id = $rootScope.getGlobalID(); //.idG; //$stateParams.id;
        $scope.registrofa = {};
        //$scope.fechaAux = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
        //alert($scope.fechaAux);
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        $scope.menorQue = function (prop, val) {
            return function (item) {
                return item[prop] < val;
            }
        }
        FormacionAcademicaService.getGradoAcademico().then(
            function (result) {
                $scope.gradosacademicos = result.data;
               
                if ($scope.authentication.userprofile.tipoPersonalId != 'SIN') {
                    $scope.gradosacademicos = $filter('filter')($scope.gradosacademicos, $scope.menorQue('gradoAcademicoId', 4));
                  
                }
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de grado academico.");
            }
        );

        //obtener lista de carreras
        FormacionAcademicaService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;

            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );
        //obtener instituciones 
        FormacionAcademicaService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );
        $scope.registro = {};
        //obtener el registro a editar
        FormacionAcademicaService.getFormacionAcadId(id).then(
            function (result) {
                $scope.registrofa = result.data;
                FormacionAcademicaService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registrofa.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = $scope.registrofa.nombreCompleto;
                        $scope.registro.clavePersona = $scope.registrofa.clavePersona;
                    });
                

                if ($scope.registrofa.fechaInicio != null) {
                    $scope.registrofa.fechaInicio = new Date($scope.registrofa.fechaInicio);
                    if ($scope.registrofa.fechaInicio.getFullYear() == 1900 || $scope.registrofa.fechaInicio.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registrofa.fechaInicio;
                        $scope.registrofa.fechaInicio = null;
                    }
                }


                if ($scope.registrofa.fechaTermino != null) {
                    $scope.registrofa.fechaTermino = new Date($scope.registrofa.fechaTermino);
                    if ($scope.registrofa.fechaTermino.getFullYear() == 1900 || $scope.registrofa.fechaTermino.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registrofa.fechaTermino;
                        $scope.registrofa.fechaTermino = null;
                    }
                }
                $scope.selectedcarrera = $scope.registrofa.carrera;
                $scope.selectedinstitucion = $scope.registrofa.institucion;
                if ($scope.registrofa.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
               
                if ($scope.registrofa.cedula != null || $scope.registrofa.cedula != undefined) {
                    $scope.registrofa.cedu = true;
                } else {
                    $scope.registrofa.cedu = false;
                }

                if ($scope.registrofa.cedula == "") {
                    $scope.registrofa.cedu = false;
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
                ext: "pdf;doc;docx;jpeg;jpg", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    $scope.fromfa.$setDirty(); 
                    if (!err) {
                        
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        angular.element("input[type='file']").val(null);
                        $(":file").filestyle('clear');
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
                    $scope.registrofa.adjunto = {
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
            $scope.fromfa.$setDirty(); 
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
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            $scope.fromfa.$setDirty(); 
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
        }

        //editarregistro

        $scope.addFormacion = function () {
            if ($scope.registrofa.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.addFormacionF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.addFormacionF();
            }
        }


        $scope.addFormacionF = function () {
            if ($scope.fromfa.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.registrofa.cedu == false) {
                    $scope.registrofa.cedula = null;
                }

                if ($scope.registrofa.cedu == true && ($scope.registrofa.cedula == "" || $scope.registrofa.cedula == null || $scope.registrofa.cedula == undefined)) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                }
                //Validacion Fechas

                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registrofa.fechaInicio != null && $scope.registrofa.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrofa.fechaTermino != null && $scope.registrofa.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrofa.fechaInicio != null && $scope.registrofa.fechaTermino != null && $scope.registrofa.fechaInicio >= $scope.registrofa.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registrofa.fechaInicio == null) {
                    $scope.registrofa.fechaInicio = new Date('01/01/1900');
                }
                if ($scope.registrofa.fechaTermino == null) {
                    $scope.registrofa.fechaTermino = new Date('01/01/1900');
                }


                /////////////////

                $scope.registrofa.gradoAcademicoId = $scope.registrofa.gradoAcademico.gradoAcademicoId;

                // obtener id de la carrera
                $scope.registrofa.carreraId = $scope.selectedcarrera.carreraId;

                // obetener id de la institucion
                $scope.registrofa.institucionID = $scope.selectedinstitucion.institucionID;

                //otener el id del paises
                $scope.registrofa.paisID = $scope.selectedinstitucion.paisID;

                
                $scope.desabilitar = true;

                var registro = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "GradoAcademicoId": $scope.registrofa.gradoAcademicoId,
                    "FechaInicio": $scope.registrofa.fechaInicio,
                    "FechaTermino": $scope.registrofa.fechaTermino,
                    "FormacionAcademicaId": id
                };

                FormacionAcademicaService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if(res.data){
                            toastr.warning("Intente cambiar grado académico o las fechas de inicio y término");
                            toastr.warning("Ya existe el registro!");
                            $scope.desabilitar = false;
                            return false;
                        }

                        if ($scope.editarGestion == 0) {
                            $scope.registrofa.estadoFlujoId = 1;
                        }
                        FormacionAcademicaService.updateFormacion($scope.registrofa).then(
                            function (result) {
                                if (result.data.adjuntoId != null) {
                                    $scope.registrofa.adjunto.adjuntoId = result.data.adjuntoId;
                                    $scope.registrofa.adjuntoId = result.data.adjuntoId;
                                    $scope.regFile = false;
                                } else {
                                    $scope.registrofa.adjunto = null;
                                    $scope.registrofa.adjuntoId = null;
                                    $scope.regFile = true;
                                    // if (result.data.adjunto != null) {
                                    //     $scope.registrofa.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                    //     $scope.registrofa.adjuntoId = result.data.adjunto.adjuntoId;
                                    //     $scope.regFile = false;
                                    // } else {
                                    //     $scope.registrofa.adjunto = null;
                                    //     $scope.registrofa.adjuntoId = null;
                                    //     $scope.regFile = true;
                                    // }
                                }
                                toastr.success("Registro Actualizado");
                                $scope.desabilitar = false;
                                $scope.requeridas = false;
                                if ($scope.registrofa.fechaInicio != null) {
                                    $scope.registrofa.fechaInicio = new Date($scope.registrofa.fechaInicio);
                                    if ($scope.registrofa.fechaInicio.getFullYear() == 1900 || $scope.registrofa.fechaInicio.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registrofa.fechaInicio;
                                        $scope.registrofa.fechaInicio = null;
                                    }
                                }


                                if ($scope.registrofa.fechaTermino != null) {
                                    $scope.registrofa.fechaTermino = new Date($scope.registrofa.fechaTermino);
                                    if ($scope.registrofa.fechaTermino.getFullYear() == 1900 || $scope.registrofa.fechaTermino.getFullYear() == 1899) {
                                        $scope.inicioAux = $scope.registrofa.fechaTermino;
                                        $scope.registrofa.fechaTermino = null;
                                    }
                                }
                                $scope.fromfa.$setPristine();
                            },
                            function (err) {
                               
                                $scope.desabilitar = false;
                            });
                    }, function (err) {
                        
                    }
                );

            }

        }


        $scope.validar = function () {
            try {
                if ($scope.registrofa.fechaInicio == null || $scope.registrofa.fechaTermino == null) {
                    $scope.requeridas = true;
                    toastr.error("Complete los datos requeridos de período de estudio");
                    return false;
                }

                if ($scope.fromfa.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.registrofa.cedu == false) {
                        $scope.registrofa.cedula = null;
                    }

                    if ($scope.registrofa.cedu == true && ($scope.registrofa.cedula == "" || $scope.registrofa.cedula == null || $scope.registrofa.cedula == undefined)) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    }
                    //Validacion Fechas
                    var dia = new Date($scope.registrofa.fechaInicio).getFullYear();
                    var dia2 = new Date($scope.registrofa.fechaTermino).getFullYear();
                    if (dia != 1899 && dia != 1900) {
                        if (dia2 != 1899 && dia2 != 1900) {
                            $scope.hoy = new Date();
                            $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                            if ($scope.registrofa.fechaInicio > $scope.hoy) {
                                toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                                return false;
                            }
                            if ($scope.registrofa.fechaTermino > $scope.hoy) {
                                toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                                return false;
                            }
                            if ($scope.registrofa.fechaInicio >= $scope.registrofa.fechaTermino) {
                                toastr.error("La fecha de inicio debe ser menor a la de término");
                                return false;
                            }
                        }
                    }
                    //$scope.addFormacion();
                    /////////////////
                    var Registro = {
                        "formacionAcademicaId": $scope.registrofa.formacionAcademicaId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desabilitar = true;
                    $scope.registrofa.estadoFlujoId = 2;
                    FormacionAcademicaService.updateFormacion($scope.registrofa).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.registrofa.clavePersona,
                                "TipoInformacionId": 1,
                                "InformacionId": $scope.registrofa.formacionAcademicaId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2,
                                "titulo": $scope.registrofa.gradoAcademico.descripcion
                            }
                            FormacionAcademicaService.AddSolicitud(Solicitud).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": result.data,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": $scope.registrofa.clavePersona,
                                        "Descripcion": "Se envió la solicitud",
                                        "EstadoFlujoId": 1
                                    }
                                    FormacionAcademicaService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Capital Humano",
                                        "Empleado": $scope.registrofa.nombreCompleto,
                                        "Seccion": "Formación Académica",
                                        "TipoCorreo": 1,
                                        "ClavePersona": $scope.registrofa.clavePersona
                                    }
                                    FormacionAcademicaService.mailNotificacion(Mail);
                                    toastr.success("Solicitud Enviada!");
                                    $state.go("fichapersonal.fa", { seccion: 'formacionacademica' });
                                })
                        },
                        function (err) {
                            $scope.desabilitar = false;
                            $state.go("fichapersonal.fa", { seccion: 'formacionacademica' });
                            
                        });
                }
            } catch (e) {
               
                throw e;
            }

        }

        $scope.deleteFile = function () {
            $scope.registrofa.adjunto.nombre = "eliminar";
            //FormacionAcademicaService.updateFormacion($scope.registrofa);
            //toastr.success("Archivo Eliminado!");
            $scope.registrofa.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.fromfa.$setDirty(); 
        }


        $scope.regresar = function () {
          
            $state.go("fichapersonal.fa", { seccion: 'formacionacademica' });
        }

       

    }
})();