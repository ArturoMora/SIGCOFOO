(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formacionacademicaDetallesCtrl", ['AuthService', '$scope', '$rootScope',
            'FormacionAcademicaService', "$stateParams", "$state", "uploadFileACH", "globalGet", "$filter", "$uibModal", "MenuService", formacionacademicaDetallesCtrl]);

    function formacionacademicaDetallesCtrl(AuthService, $scope, $rootScope,
        FormacionAcademicaService, $stateParams, $state, uploadFileACH, globalGet, $filter, $uibModal, MenuService) {
        // $scope.rolId = MenuService.getRolId(); if ($scope.rolId != 1) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        ////alert("ddd1");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        $scope.idRol = MenuService.getRolId();


        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva formación académica con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de una nueva formación académica con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva formación académica con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de una nueva formación académica con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })






        //alert("FA");
        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.FA = {};

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        ////Obtener grado academico
        FormacionAcademicaService.getGradoAcademico().then(
            function (result) {
                $scope.gradosacademicos = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de grado académico.");
            }
        );
        //obtener lista de carreras
        FormacionAcademicaService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de carreras.");
            }
        );

        //obtener instituciones 
        FormacionAcademicaService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de instituciones.");
            }
        );
        $scope.registrofa = [];
        $scope.registro = {};
        //obtener el registro a mostrar
        FormacionAcademicaService.getFormacionAcadId(id).then(
            function (result) {
                $scope.FA = result.data;
                $scope.registro = result.data;
                FormacionAcademicaService.Persona(result.data.clavePersona).then(
                    function (result) {

                        $scope.FA.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                        
                        var grados = [];
                        if ($scope.idRol == 1) {
                            if ($scope.authentication.userprofile.tipoPersonalId != 'SIN')
                                if ($scope.authentication.userprofile.clavePersona == $scope.registro.clavePersona) {
                                    angular.forEach($scope.gradosacademicos, function (value, key) {
                                        if (value.gradoAcademicoId <= 3)
                                            grados.push(value);
                                    });

                                }
                        }
                        if (grados.length > 0) {
                            $scope.gradosacademicos = grados;
                        }
                    });
                //$scope.FechaValidacionAux = new Date();

                if ($scope.FA.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.FA.fechaValidacion);
                }
                $scope.selectedcarrera = $scope.FA.carrera;
                $scope.selectedinstitucion = $scope.FA.institucion;
                if ($scope.FA.fechaInicio != null) {
                    $scope.FA.fechaInicio = new Date($scope.FA.fechaInicio);
                    if ($scope.FA.fechaInicio.getFullYear() == 1900 || $scope.FA.fechaInicio.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.FA.fechaInicio;
                        $scope.FA.fechaInicio = null;
                    }
                }


                if ($scope.FA.fechaTermino != null) {
                    $scope.FA.fechaTermino = new Date($scope.FA.fechaTermino);
                    if ($scope.FA.fechaTermino.getFullYear() == 1900 || $scope.FA.fechaTermino.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.FA.fechaTermino;
                        $scope.FA.fechaTermino = null;
                    }
                }
                if ($scope.FA.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                if ($scope.FA.cedula != null || $scope.FA.cedula != undefined) {
                    $scope.FA.cedu = true;
                } else {
                    $scope.FA.cedu = false;
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
                ext: "pdf;doc;docx;jpeg;jpg", /* pdf;doc;docx;ppt */
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
                    $scope.FA.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.fromfa.$setDirty();
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
                $scope.fromfa.$setDirty();
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
                $scope.fromfa.$setDirty();
            });
            $scope.desabilitar = false;
        }

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.FA.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.FA.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
            } else {
                if ($scope.inicioDateComparacion > $scope.fechaActual) {
                    //alert($scope.fechaActual + "\n" + $scope.inicioDateComparacion + "\n" + $scope.finalDateComparacion);
                    var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                    toastr.error("La fecha de inicio debe ser menor a " + $scope.ddMMyyyy);
                }
            }
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.FA.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.FA.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
            } else {
                if ($scope.finalDateComparacion > $scope.fechaActual) {
                    var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                    toastr.error("La fecha de termino debe ser menor a " + $scope.ddMMyyyy);
                }
            }
        }
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {
            //alert("estadoFlujoId " + $scope.registro.estadoFlujoId);
            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };
            
            FormacionAcademicaService.AddSolicitud(Solicitud).then(
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
                    
                    FormacionAcademicaService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            $scope.FA.estadoFlujoId = 3;
            $scope.FA.fechaValidacion = $scope.FechaValidacionAux;
            FormacionAcademicaService.updateValidacion($scope.FA).then(
                function (result) {
                    $scope.desactivar = false;
                    toastr.success("Solicitud Aprobada!");
                    FormacionAcademicaService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            FormacionAcademicaService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            FormacionAcademicaService.mailNotificacion(Mail);
                            $rootScope.globalRegresar();

                        }, function (error) { });

                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });


        }
        $scope.Actualizar = function (opc) {
            if ($scope.fromfa.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if ($scope.justificacion == null && opc != 1) {
                toastr.error("Escriba una justificación");
                return false;
            }
            if ($scope.FA.cedu == false) {
                $scope.FA.cedula = null;
            }
            
            if ($scope.FA.cedu == true && ($scope.FA.cedula == "" || $scope.FA.cedula == null || $scope.FA.cedula == undefined)) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            //Validacion Fechas
            var a = 0;
            if ($scope.FA.fechaInicio == null) {
                $scope.FA.fechaInicio = new Date('01/01/1900');
                a++;
            }
            if ($scope.FA.fechaTermino == null) {
                $scope.FA.fechaTermino = new Date('01/01/1900');
                a++;
            }
            if (a != 2) {
                var dia = new Date($scope.FA.fechaInicio).getFullYear();
                var dia2 = new Date($scope.FA.fechaTermino).getFullYear();
                if (dia != 1899 && dia != 1900) {
                    if (dia2 != 1899 && dia2 != 1900) {
                        $scope.hoy = new Date();
                        $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                        if ($scope.FA.fechaInicio > $scope.hoy) {
                            toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                            return false;
                        }
                        if ($scope.FA.fechaTermino > $scope.hoy) {
                            toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                            return false;
                        }
                        if ($scope.FA.fechaInicio >= $scope.FA.fechaTermino) {
                            toastr.error("La fecha de inicio debe ser menor a la de término");
                            return false;
                        }
                    }
                }
            }
            $scope.FA.gradoAcademicoId = $scope.FA.gradoAcademico.gradoAcademicoId;

            // obtener id de la carrera
            $scope.FA.carreraId = $scope.selectedcarrera.carreraId;
            $scope.carrera = $scope.selectedcarrera.descripcion;

            // obetener id de la institucion
            $scope.FA.institucionID = $scope.selectedinstitucion.institucionID;
            $scope.instituto = $scope.selectedinstitucion.descripcion;

            //otener el id del paises
            $scope.FA.paisID = $scope.selectedinstitucion.paisID;


            //ingresar id del archivo, esta pendiente por validar 
            $scope.FA.idArchivo = $scope.numEmp
            // Actualiza registro FA
            $scope.desactivar = true;
            // if ($scope.FA.adjunto != null) {
            //     $scope.FA.adjuntoId = $scope.FA.adjunto.adjuntoId;
            // } else {
            //     $scope.FA.adjuntoId = null;
            // }
            if ($scope.FA.especialidad == null) {
                $scope.FA.especialidad = "";
            }
            var Mail = {
                "Modulo": "Capital Humano",
                "Empleado": $scope.FA.nombreCompleto,
                "Seccion": "Formación Académica",
                "TipoCorreo": 2,
                "ClavePersona": $scope.FA.clavePersona,
                "Descripcion1": "<b>Grado académico:</b> " + $scope.FA.gradoAcademico.descripcion + "<br/>",
                "Descripcion2": "<b>Carrera :</b> " + $scope.carrera + "<br/>",
                "Descripcion3": "<b>Especialidad :</b> " + $scope.FA.especialidad + "<br/>",
                "Descripcion4": "<b>Institución :</b> " + $scope.instituto,
                "Justificacion": $scope.justificacion,
                "Estado": ""
            }
            if ($scope.editAdmin == "1") {
                CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                    $scope.registro.formacionAcademicaId, 1)
                
            }
            switch (opc) {
                case 1:

                    var registro = {
                        "ClavePersona": $scope.registro.clavePersona,
                        "GradoAcademicoId": $scope.FA.gradoAcademicoId,
                        "FechaInicio": $scope.FA.fechaInicio,
                        "FechaTermino": $scope.FA.fechaTermino,
                        "FormacionAcademicaId": id
                    };

                    FormacionAcademicaService.ValidaRegistroDuplicado(registro).then(
                        function (res) {
                            if(res.data){
                                toastr.warning("Intente cambiar grado académico o las fechas de inicio y término");
                                toastr.warning("Ya existe el registro!");
                                $scope.desactivar = false;
                                return false;
                            }
                            //por default cuando se agrega un registro el estdo del flujo es 1
                            $scope.FA.estadoFlujoId = 2;

                            FormacionAcademicaService.updateFormacion($scope.FA).then(
                                function (result) {
                                    if (result.data.adjuntoId != null) {
                                        $scope.FA.adjunto.adjuntoId = result.data.adjuntoId;
                                        $scope.FA.adjuntoId = result.data.adjuntoId;
                                        $scope.regFile = false;
                                    } else {
                                        $scope.FA.adjunto = null;
                                        $scope.FA.adjuntoId = null;
                                        $scope.regFile = true;
                                        // if (result.data.adjunto != null) {
                                        //     $scope.FA.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                        //     $scope.FA.adjuntoId = result.data.adjunto.adjuntoId;
                                        //     $scope.regFile = false;
                                        // } else {
                                        //     $scope.FA.adjunto = null;
                                        //     $scope.FA.adjuntoId = null;
                                        //     $scope.regFile = true;
                                        // }
                                    }
                                    toastr.success("Registro actualizado correctamente!");
                                    $scope.desactivar = false;
                                    if ($scope.FA.fechaInicio != null) {
                                        $scope.FA.fechaInicio = new Date($scope.FA.fechaInicio);
                                        if ($scope.FA.fechaInicio.getFullYear() == 1900 || $scope.FA.fechaInicio.getFullYear() == 1899) {
                                            $scope.inicioAux = $scope.FA.fechaInicio;
                                            $scope.FA.fechaInicio = null;
                                        }
                                    }


                                    if ($scope.FA.fechaTermino != null) {
                                        $scope.FA.fechaTermino = new Date($scope.FA.fechaTermino);
                                        if ($scope.FA.fechaTermino.getFullYear() == 1900 || $scope.FA.fechaTermino.getFullYear() == 1899) {
                                            $scope.inicioAux = $scope.FA.fechaTermino;
                                            $scope.FA.fechaTermino = null;
                                        }
                                    }
                                    $scope.fromfa.$setPristine();
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
                    $scope.FA.estadoFlujoId = 1;
                    FormacionAcademicaService.updateFormacion($scope.FA).then(
                        function (result) {
                            toastr.success("Solicitud Rechazada!");
                            Mail.Estado = "Rechazada";
                            FormacionAcademicaService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                    FormacionAcademicaService.updateSolicitud(registro);
                    var Bitacora = {
                        "SolicitudId": registro.solicitudId,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                        "Descripcion": "Rechazado: " + $scope.justificacion,
                        "EstadoFlujoId": 2,
                        "idRol": 1
                    }
                    FormacionAcademicaService.AddBitacoraSolicitud(Bitacora);
                    break;
            }
        }

        $scope.deleteFile = function () {
            $scope.FA.adjunto.nombre = "eliminar";
            //FormacionAcademicaService.updateFormacion($scope.FA);
            //toastr.success("Archivo Eliminado!");
            $scope.FA.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.fromfa.$setDirty();
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();