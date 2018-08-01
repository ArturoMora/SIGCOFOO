(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("experienciadocenteCtrlEdit", ['AuthService', '$scope', '$rootScope', 'ExperienciaDocenteService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", experienciadocenteCtrlEdit]);

    function experienciadocenteCtrlEdit(AuthService, $scope, $rootScope, ExperienciaDocenteService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
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
        //obtener instituciones 
        ExperienciaDocenteService.getInstituciones().then(
             function (result) {
                 $scope.instituciones = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
            );
        $scope.menorQue = function (prop, val) {
            return function (item) {
                return item[prop] < val;
            }
        }
        ExperienciaDocenteService.getGradoAcademico().then(
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
        //obtener el registro a editar
        ExperienciaDocenteService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                ExperienciaDocenteService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                
                $scope.selectedinstitucion = $scope.registro.institucion;
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

        //Funcion para agregar registro

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

        $scope.updateF = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
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
                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }
                /////////////////
                $scope.desactivar = true;
                $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.registro.gradoAcademicoId = $scope.registro.gradoAcademico.gradoAcademicoId;
                ExperienciaDocenteService.update($scope.registro).then(
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
                    //Validacion Fechas
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
                    //$scope.update();
                    /////////////////
                    var Registro = {
                        "experienciaDocenteId": $scope.registro.experienciaDocenteId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                    $scope.registro.estadoFlujoId = 2;
                    ExperienciaDocenteService.update($scope.registro).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 10,
                                            "InformacionId": $scope.registro.experienciaDocenteId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo": $scope.registro.cursoImpartido

                                        }
                                        ExperienciaDocenteService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        ExperienciaDocenteService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Experiencia Docente",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        ExperienciaDocenteService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.experienciadocente", { seccion: 'experienciadocente' });
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
            //ExperienciaDocenteService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm.$setDirty();
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.experienciadocente", { seccion: 'experienciadocente' });
        }

    }
})();