(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ponenciaCtrlEdit", ['AuthService', '$scope', '$rootScope', 'PonenciaService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", ponenciaCtrlEdit]);

    function ponenciaCtrlEdit(AuthService, $scope, $rootScope, PonenciaService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder) {
        
        var API = globalGet.get("api");
        var id = $rootScope.getGlobalID();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.registro = {};
        $scope.paisanterior = "";
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
         
         $scope.datePicker = getRangoDeFechaDefault(0, 2, 0);


        PonenciaService.getbyid(id).then(
            function (result) {
                $scope.paisanterior = result.data.lugarCongreso;
                PonenciaService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.claveUnidadAut = $scope.authentication.userprofile.claveUnidad;
                    });
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er"
                }, {
                    "id": "2",
                    "descripcion": " 2do"
                }, {
                    "id": "3",
                    "descripcion": " 3er"
                }, {
                    "id": "4",
                    "descripcion": " 4to"
                }, {
                    "id": "5",
                    "descripcion": " 5to"
                }, {
                    "id": "6",
                    "descripcion": " 6to"
                }, {
                    "id": "7",
                    "descripcion": " 7mo"
                }, {
                    "id": "8",
                    "descripcion": " 8vo"
                }, {
                    "id": "9",
                    "descripcion": " 9no"
                }, {
                    "id": "10",
                    "descripcion": "10mo"
                }];
                $scope.registro = result.data;
               
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                PonenciaService.ValidarExistencia($scope.registro.ponenciaId).then(function (result) {
                    $scope.validacion = result.data;
                });
                $scope.registro.congresoSelect = $scope.registro.congreso;
                $scope.registro.congresonombreSelect = $scope.registro.congreso.nombreCongreso;
                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                var count = 1;
                PonenciaService.getByPonencia($scope.registro.ponenciaId).then(
                    function (result) {
                        $scope.AutoresIIE = result.data;
                        for (var p = 0; p < $scope.AutoresIIE.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresIIE[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
                PonenciaService.getByPonenciaExt($scope.registro.ponenciaId).then(
                    function (result) {
                        $scope.AutoresExt = result.data;
                        for (var p = 0; p < $scope.AutoresExt.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresExt[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
            },
            function (error) {
                toastr.error(error);
            });
        PonenciaService.getCongresos().then(
            function (result) {
                $scope.congresos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de congresos.");
            }
        );
        PonenciaService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        PonenciaService.getAmbitos().then(
            function (result) {
                $scope.ambitos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Ambitos.");
            }
        );
        PonenciaService.getNiveles().then(
            function (result) {
                $scope.niveles = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Niveles de ponencia.");
            }
        );
        PonenciaService.getEstados().then(
            function (result) {
                $scope.ponencias = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de ponencia.");
            }
        );
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.ModificaPais = function () {
            //$scope.paisanterior = $scope.paises[$scope.pais - 1].descripcion;
            $scope.registro.paisID = $scope.paisID;
            
        }
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
            });
        }
        ///////////////////////////////////////////////////////////////
        //$scope.validarFechas = function () {
        //    $scope.fechaActual = new Date();
        //    $scope.finalDateComparacion = new Date($scope.registro.fechaInicio);
        //    if ($scope.finalDateComparacion > $scope.fechaActual) {
        //        toastr.error("Fecha de inicio del congreso deber ser menor a la de hoy");
        //        $scope.registro.fechaInicio = "";
        //        return false;
        //    }
        //}
        $scope.openCongresos = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacongresos.html',
                controller: 'listacongresosCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.congresoSelect = selectedItem;
                $scope.registro.congresonombreSelect = selectedItem.nombreCongreso;
            });
            $scope.desabilitar = false;
        }
        //alert("ff1");
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
           
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;ppt;pptx", /* pdf;doc;docx;ppt */
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
                            //alert("ff");
                            $(":file").filestyle('clear');
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $(":file").filestyle('clear');
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        //Funcion para agregar registro
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.registro.paginasde != $scope.registro.paginashasta) {
                    var de = parseInt($scope.registro.paginasde);
                    var hasta = parseInt($scope.registro.paginashasta);

                    if (hasta < de) {
                        toastr.error("Rango de páginas incorrecto");
                        return false;
                    }
                }


                if ($scope.registro.year.length == 4) {
                    var datetoday = new Date();
                    var today = datetoday.getFullYear();

                   
                    if ($scope.registro.year < 1975 || $scope.registro.year > today) {
                        toastr.error("El rango del año del congreso debe estar comprendido entre 1975 y " + today);
                        return false;
                    }
                    if ($scope.registro.congresoSelect != undefined) {
                        if ($scope.registro.paisID != "") {
                           
                            // $scope.registro.lugarCongreso = $scope.paises[$scope.pais - 1].nombrePais;
                            $scope.desactivar = true;
                            $scope.registro.congresoId = $scope.registro.congresoSelect.congresoId;
                            $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;
                            $scope.registro.estadoFlujoId = 1;
                            PonenciaService.update($scope.registro).then(
                                function (result) {
                                    if (result.data.adjuntoId != null) {
                                        $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
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
                                    //$state.go("Ponencias");
                                    $scope.desactivar = false;
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        } else { toastr.error("Seleccione un país!"); }
                    } else { toastr.error("Seleccione un congreso!"); }
                } else { toastr.error("Año invalido!"); }
            }
        }
        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.registro.paginasde != $scope.registro.paginashasta) {
                        var de = parseInt($scope.registro.paginasde);
                        var hasta = parseInt($scope.registro.paginashasta);

                        if (hasta < de) {
                            toastr.error("Rango de páginas incorrecto");
                            return false;
                        }
                    }
                    $scope.update();
                    if ($scope.validacion == 0) {
                        var Registro = {
                            "ponenciaId": $scope.registro.ponenciaId,
                            "estadoFlujoId": 8
                        };
                        //Cambiar el estado del registro
                        $scope.desactivar = true;
                        PonenciaService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 12,
                                    "InformacionId": $scope.registro.ponenciaId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 8,
                                    "ClaveUnidadAut": $scope.registro.claveUnidadAut,
                                    "titulo": $scope.registro.tituloPonencia
                                }
                                PonenciaService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        PonenciaService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Ponencia",
                                            "TipoCorreo": "SolicitudGerente",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion1": 1
                                        }
                                        PonenciaService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Ponencias");
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    } else {
                        var Registro = {
                            "ponenciaId": $scope.registro.ponenciaId,
                            "estadoFlujoId": 2
                        };
                        //Cambiar el estado del registro
                        PonenciaService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 12,
                                    "InformacionId": $scope.registro.ponenciaId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 2,
                                    "titulo": $scope.registro.tituloPonencia
                                }
                                PonenciaService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1,
                                            "titulo": $scope.registro.tituloPonencia
                                        }

                                        PonenciaService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Ponencia",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona,
                                        }
                                        PonenciaService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Ponencias");
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    }
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }
        
        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            PonenciaService.update($scope.registro);
            toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $(":file").filestyle('clear');
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    "ponenciaId": $scope.registro.ponenciaId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    "estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }

                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                PonenciaService.AddUser(Registro).then(
                    function (result) {
                        $scope.userAdd = false;
                        $scope.autorIIE = {};
                        Registro.autorIIEPonenciaId = result.data.autorIIEPonenciaId;
                        $scope.PersonaSeleccionada = null;
                        $scope.AutoresIIE.push(Registro);

                        //Eliminar del drop
                        for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                            if ($scope.catNum[i].id == Registro.contribucion) {
                                $scope.auxColabora.push($scope.catNum[i]);
                                $scope.catNum.splice(i, 1);
                            }
                        }

                    });


            } else {
                toastr.error("Complete los datos requeridos del autor");
            }

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
            PonenciaService.deleteAutorIIE(registro.autorIIEPonenciaId).then(
                function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }
                    var idx = ($scope.AutoresIIE.indexOf(registro));
                    $scope.AutoresIIE.splice(idx, 1);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.ponenciaId = $scope.registro.ponenciaId;

                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                PonenciaService.AddUserExt($scope.autorExt).then(
                    function (result) {
                        $scope.addExt = false;
                        $scope.autorExt.autorPonenciaExtId = result.data.autorPonenciaExtId;
                        $scope.AutoresExt.push($scope.autorExt);
                        //Eliminar del drop
                        for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                            if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                                $scope.auxColabora.push($scope.catNum[i]);
                                $scope.catNum.splice(i, 1);
                            }
                        }
                        $scope.autorExt = {};

                    });
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.eliminarAutorExt = function (registro) {
            $scope.descripcionRow = registro.nombre;
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
            PonenciaService.deleteAutorExt(registro.autorPonenciaExtId).then(
                function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }
                    var idx = ($scope.AutoresExt.indexOf(registro));
                    $scope.AutoresExt.splice(idx, 1);
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
    }
})();