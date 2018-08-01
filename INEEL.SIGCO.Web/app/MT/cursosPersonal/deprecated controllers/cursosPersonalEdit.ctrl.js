(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("CursosPersonalEditCtrl", ['AuthService', '$scope', '$rootScope', 'CursosPersonalServiceMT', 'globalGet', '$state', "uploadFileACH", "$uibModal", "DTOptionsBuilder", CursosPersonalEditCtrl]);

    function CursosPersonalEditCtrl(AuthService, $scope, $rootScope, CursosPersonalServiceMT, globalGet, $state, uploadFileACH, $uibModal, DTOptionsBuilder) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.tasklist = [];
        $scope.archivosAdjuntos = [];
        $scope.sitiosWebNuevos = [];
        $scope.sitioWebCurso = [];
        $scope.contador = 0;
        $scope.urlDescarga = API + "Descarga/GetFileCurso";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);


        CursosPersonalServiceMT.getbyid(id).then(
            function (result) {
                CursosPersonalServiceMT.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                    });
                $scope.autorIIE = {};
                $scope.registro = result.data;
                CursosPersonalServiceMT.getExt($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.AutoresExt = result.data;

                    });

                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }

                if ($scope.registro.fechaCurso != null) {
                    $scope.registro.fechaCurso = new Date($scope.registro.fechaCurso);
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

                CursosPersonalServiceMT.getByObj($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.AutoresIIE = result.data;
                        for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                            $scope.contador = $scope.contador + $scope.AutoresIIE[i].contribucion;
                        }

                    });
                CursosPersonalServiceMT.getAdjuntos($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.archivosAdjuntos = result.data;
                    });
            },
            function (error) {
                toastr.error("Error con archivos adjuntos");
            });
        CursosPersonalServiceMT.getTipoCurso().then(
            function (result) {
                $scope.cursos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipo de Cursos.");
            }
        );

        $scope.validarFechas = function () {
            if ($scope.registro.fechaTermino != null) {
                $scope.fechatermino = new Date($scope.registro.fechaTermino);
            }

            $scope.fechainicio = new Date($scope.registro.fechaCurso);
            if ($scope.fechainicio > $scope.fechatermino && ($scope.fechatermino != null)) {
                toastr.error("Fecha de inicio del curso deber ser menor a la de termino");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }




        $scope.VerificaFechaInicio = function () {

            var limiteInferior = new Date(1975, 1, 1);
            var fechaInicioIngresada = new Date($scope.registro.fechaCurso);

            if (fechaInicioIngresada < limiteInferior) {
                toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                $scope.registro.fechaCurso = "";
                return false;
            }

            if ($scope.registro.fechaTermino != null) {

                var fechaTerminoIngresada = new Date($scope.registro.fechaTermino);
                if (fechaTerminoIngresada < fechaInicioIngresada) {
                    toastr.error("La fecha de inicio ingresada debe ser mayor a la fecha de término.");
                    $scope.registro.fechaCurso = "";
                    return false;
                } else {
                    return true;
                }

            }


        };

        $scope.VerificaFechaTermino = function () {

            var limiteSuperior = new Date();
            var limiteInferior = new Date(1975, 1, 1);
            var fechaTerminoIngresada = new Date($scope.registro.fechaTermino);


            if (fechaTerminoIngresada > limiteSuperior) {
                toastr.error("La fecha de termino ingresada no es una fecha válida.");
                $scope.registro.fechaTermino = "";
                return false;
            }

            if (fechaTerminoIngresada < limiteInferior) {
                toastr.error("La fecha de termino ingresada no es una fecha válida.");
                $scope.registro.fechaTermino = "";
                return false;
            }

            if ($scope.registro.fechaCurso != null) {
                var fechaInicioIngresada = new Date($scope.registro.fechaCurso);
                if (fechaInicioIngresada > fechaTerminoIngresada) {
                    toastr.error("La fecha de inicio debe ser menor a la fecha de término.");
                    $scope.registro.fechaTermino = "";
                    return false;
                } else {
                    return true;
                }

            }

        };


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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.add_user();
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.

        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].nombre) {
                    igual = 1;
                }
            }
            if (igual == 0) {
                for (contador = 0; contador < $scope.tasklist.length; contador++) {
                    if (adjunto.files[0].name == $scope.tasklist[contador].nombre) {
                        igual = 1;
                    }
                }
            }
            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                adjunto = '';
                return;
            }
            else {

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
                            $("#filesGral").filestyle('clear');
                            if (!result.error) {
                                transferComplete(result);
                                $("#filesGral").filestyle('clear');

                            } else {
                                toastr.error(result.message);
                                $("#filesGral").filestyle('clear');
                            }
                            //                        $scope.add_File();

                        } else {
                            var error = err.message || "Error al adjuntar";
                            $("#filesGral").filestyle('clear');
                            toastr.error(error);
                        }
                    });
            }
        };
        $scope.tasklist = [];
        function transferComplete(result) {
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    var RegistroFiles = {
                        "RutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        "ModuloId": $scope.registro.adjunto.moduloId,
                        "CursoInternoId": $scope.registro.cursoInternoId
                    }
                    CursosPersonalServiceMT.AddFile(RegistroFiles).then(
                        function (result) {
                            $scope.buscarArchivos();
                        });
                    $scope.existFile = 1;
                }
            });
        }

        $scope.buscarArchivos = function () {
            CursosPersonalServiceMT.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.archivosAdjuntos = result.data;


                    for (var o = 0; o < $scope.archivosAdjuntos.length; o++) {
                        if ($scope.archivosAdjuntos[o].nombre == $scope.archivosAdjuntos[o + 1].nombre) {
                            $scope.eliminarFile($scope.archivosAdjuntos[o]);
                        }
                    }
                });
        }
        $scope.deleteTask = function (index) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);

        }
        //#endregion info gral

        //Funcion para actualizar el registro
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno");
                    return false;
                }
                if (($scope.archivosAdjuntos.length + $scope.tasklist.length) == 0) {
                    toastr.error("Ingrese por lo menos un autor interno");
                    return false;
                }
                if ($scope.registro.fechaCurso > $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                } else {
                    $scope.desactivar = true;
                    if ($scope.registro.perteneceCP == 1) {
                        $scope.registro.perteneceCP = true;
                    } else { $scope.registro.perteneceCP = false; }
                    $scope.registro.estadoFlujoId = 1;
                    CursosPersonalServiceMT.update($scope.registro).then(
                        function (result) {
                            for (var sitios = 0; sitios < $scope.sitiosWebNuevos.length; sitios++) {
                                var RegistroSitios = {
                                    "Url": $scope.sitiosWebNuevos[sitios],
                                    "Descripcion": $scope.sitiosWebNuevos[sitios],
                                    "FechaRegistro": new Date(),
                                    "Autor": $scope.registro.nombrePersona,
                                    "Estado": true,
                                    "CursoInternoId": $scope.registro.cursoInternoId
                                }
                                CursosPersonalServiceMT.AddSitios(RegistroSitios);
                            }
                            toastr.success("Registro Actualizado");
                            $scope.desactivar = false;
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                }

            }
        }


        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.registro.perteneceCP == 1) {
                        $scope.registro.perteneceCP = true;
                    } else { $scope.registro.perteneceCP = false; }
                    var Registro = {
                        "cursoInternoId": $scope.registro.cursoInternoId,
                        "estadoFlujoId": 2,
                        "perteneceCP": $scope.registro.perteneceCP
                    };
                    //Cambiar el estado del registro
                    $scope.update();
                    $scope.desactivar = true;
                    debugger;
                    CursosPersonalServiceMT.updateEstado(Registro).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.registro.clavePersona,
                                "TipoInformacionId": "",
                                "InformacionId": $scope.registro.cursoInternoId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2
                            }
                            if ($scope.registro.perteneceCP == true) {
                                Solicitud.TipoInformacionId = 18;
                                CursosPersonalServiceMT.AddSolicitudCH(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var tipoMensaje;
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Cursos",
                                            "TipoCorreo": "SolicitudCentroPosgrado",
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        CursosPersonalServiceMT.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Cursos")
                                    })
                            } else {
                                Solicitud.TipoInformacionId = 17;
                                CursosPersonalServiceMT.AddSolicitudCH(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CursosPersonalServiceMT.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var tipoMensaje;
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Cursos",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        CursosPersonalServiceMT.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Cursos")
                                    })
                            }
                        },
                        function (err) {
                            $scope.desactivar = false;
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
            CursosPersonalServiceMT.update($scope.registro);
            toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_File = function () {
            var RegistroFiles = {
                "RutaCompleta": $scope.registro.adjunto.rutaCompleta,
                "nombre": $scope.registro.adjunto.nombre,
                "ModuloId": $scope.registro.adjunto.moduloId,
                "CursoInternoId": $scope.registro.cursoInternoId
            }
            CursosPersonalServiceMT.AddFile(RegistroFiles);
            //$scope.archivosAdjuntos.push($scope.registro.adjunto);
            $scope.registro.adjunto = null;
            $scope.existFile = 0;
        }


        $scope.eliminarFile = function (registro) {
            CursosPersonalServiceMT.deleteAdjunto(registro.adjuntoCursosId);
            var idx = ($scope.archivosAdjuntos.indexOf(registro));
            $scope.archivosAdjuntos.splice(idx, 1);
        }

        $scope.add_user = function () {
            debugger;
            var Registro = {
                "cursoInternoId": $scope.registro.cursoInternoId,
                "clavePersona": $scope.autorIIE.clavePersona,
                "nombreCompleto": $scope.autorIIE.nombrePersona

            }
            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                    toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                    $scope.PersonaSeleccionada = null;
                    return false;
                }
            }
            CursosPersonalServiceMT.AddUser(Registro).then(
                function (result) {
                    $scope.userAdd = false;
                    $scope.autorIIE = {};
                    Registro.autorInternoCursoInternoId = result.data.autorInternoCursoInternoId;
                    $scope.PersonaSeleccionada = null;
                    $scope.AutoresIIE.push(Registro);

                });
        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro, $uibModalInstance) {
            debugger;
            CursosPersonalServiceMT.deleteAutorIIE(registro.autorInternoCursoInternoId).then(
                function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }
                    var idx = ($scope.AutoresIIE.indexOf(registro));
                    $scope.AutoresIIE.splice(idx, 1);
                    $uibModalInstance.dismiss('close');
                    var porcentaje = parseInt(registro.contribucion);
                    $scope.contador = $scope.contador - porcentaje;
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.addLiga = function () {

            if ($scope.registro) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.registro.descripcionLiga;
                var idx = -1;
                if (liga != "" && liga != undefined) {
                    for (var contador = 0; contador < $scope.registro.sitioWebCurso.length; contador++) {
                        if ($scope.registro.sitioWebCurso[contador].url == liga) {
                            var idx = contador;
                        }
                    }
                    var idx2 = $scope.sitiosWebNuevos.indexOf(liga);
                    if (idx > -1 || idx2 > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada, indique otra");
                    }
                    // is newly selected
                    else {
                        $scope.sitiosWebNuevos.push(liga);
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            }
            else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }
        }


        $scope.deleteTaskNew = function (index) {
            $scope.sitiosWebNuevos.splice(index, 1);

        }


        //Eliminar el archivo adjunto
        $scope.deleteTaskAnt = function (index, id) {
            // $scope.registrositioWebCurso.splice(index, 1);
            debugger;
            //var files = $scope.adjuntos.length + $scope.tasklist.length;
            //if (files > 1) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        //servicio de eliminar AdjuntoBecarioExterno
                        // delete: 
                        CursosPersonalServiceMT.deleteSitio(id).then(
                            function (sucess) {
                                //var idx = ($scope.registro.sitioWebCurso.indexOf(rowAdjuntoBecarioExterno));
                                $scope.registro.sitioWebCurso.splice(index, 1);
                                $uibModalInstance.dismiss('cancel');
                            },
                            function (error) {
                                $uibModalInstance.dismiss('cancel');
                            }
                        );

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
        //else {
        //    toastr.error("No existen suficientes archivos para eliminar");
        //}

        $scope.add_userExt = function () {
            if ($scope.autorExt.nombreCompleto != null) {
                $scope.autorExt.cursoInternoId = $scope.registro.cursoInternoId;

                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombreCompleto == $scope.autorExt.nombreCompleto)) {
                        toastr.error("El autor " + $scope.autorExt.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }


                CursosPersonalServiceMT.AddUserExt($scope.autorExt).then(
                    function (result) {
                        $scope.addExt = false;
                        $scope.autorExt.autorExternoCursoInternoId = result.data.autorExternoCursoInternoId;
                        $scope.AutoresExt.push($scope.autorExt);

                        ////Eliminar del drop
                        //for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                        //    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        //        $scope.auxColabora.push($scope.catNum[i]);
                        //        $scope.catNum.splice(i, 1);
                        //    }
                        //}
                        $scope.autorExt = {};

                    });
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.eliminarAutorExt = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.deleteExt(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.deleteExt = function (registro, $uibModalInstance) {
            CursosPersonalServiceMT.deleteAutorExt(registro.autorExternoCursoInternoId).then(
                function (result) {
                    var idx = ($scope.AutoresExt.indexOf(registro));
                    $scope.AutoresExt.splice(idx, 1);
                    $scope.auxColabora.splice(idx, 1);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    };

})();