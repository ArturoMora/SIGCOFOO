(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("ponenciaDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'PonenciaService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", 'MenuService', ponenciaDetallesCtrl]);

    function ponenciaDetallesCtrl(AuthService, $scope, $rootScope, PonenciaService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.aprobacionQ = "";
                $scope.rechazoQ = "";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro una nueva ponencia con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        $scope.AutoresIIERegistrados = "";

        var API = globalGet.get("api");
        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        $scope.editAdmin = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();

        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.autoresExtEliminados = [];
        $scope.autoresIntEliminados = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar
        PonenciaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                PonenciaService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;

                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });
                PonenciaService.getPaises().then(
                    function (result) {
                        $scope.paises = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er",
                    "lugar": 1
                }, {
                    "id": "2",
                    "descripcion": " 2do",
                    "lugar": 2
                }, {
                    "id": "3",
                    "descripcion": " 3er",
                    "lugar": 3
                }, {
                    "id": "4",
                    "descripcion": " 4to",
                    "lugar": 4
                }, {
                    "id": "5",
                    "descripcion": " 5to",
                    "lugar": 5
                }, {
                    "id": "6",
                    "descripcion": " 6to",
                    "lugar": 6
                }, {
                    "id": "7",
                    "descripcion": " 7mo",
                    "lugar": 7
                }, {
                    "id": "8",
                    "descripcion": " 8vo",
                    "lugar": 8
                }, {
                    "id": "9",
                    "descripcion": " 9no",
                    "lugar": 9
                }, {
                    "id": "10",
                    "descripcion": "10mo",
                    "lugar": 10
                }];

                $scope.registro.congresoSelect = $scope.registro.congreso;
                $scope.registro.congresonombreSelect = $scope.registro.congreso.nombreCongreso;
                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                $scope.congresoset = $scope.registro.congreso;
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
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
                toastr.error("No se ha podido cargar el catálogo de congresos.");
            }
        );

        PonenciaService.getAmbitos().then(
            function (result) {
                $scope.ambitos = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de ámbitos.");
            }
        );
        PonenciaService.getNiveles().then(
            function (result) {
                $scope.niveles = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de ponencia.");
            }
        );
        PonenciaService.getEstados().then(
            function (result) {
                $scope.ponencias = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de ponencia.");
            }
        );
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
                $scope.ValidForm.$setDirty();
            });
        }
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
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
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }
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

            PonenciaService.AddSolicitud(Solicitud).then(
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
                    PonenciaService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.registro.estadoFlujoId = 3;
            $scope.registro.fechaValidacion = $scope.FechaValidacionAux;

            PonenciaService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    PonenciaService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            PonenciaService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            ///////////////////////////////////////
                            PonenciaService.mailNotificacionConCoautores(Mail);
                            $rootScope.globalRegresar();
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var de = parseInt($scope.registro.paginasde);
                var hasta = parseInt($scope.registro.paginashasta);
                if (de >= hasta) {
                    toastr.error("Rango de páginas incorrecto");
                    return false;
                }
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                if ($scope.registro.year.length == 4) {
                    if ($scope.registro.congresoSelect != undefined) {
                        for (var i = 0; i < $scope.niveles.length; i++) {
                            if ($scope.niveles[i].nivelPublicacionId == $scope.registro.nivelPublicacionId) {
                                $scope.nivelSelect = $scope.niveles[i].descripcion;
                            }
                        }

                        for (var i = 0; i < $scope.ponencias.length; i++) {
                            if ($scope.ponencias[i].estadoPonenciaId == $scope.registro.estadoPonenciaId) {
                                $scope.estadoselect = $scope.ponencias[i].descripcion;
                            }
                        }



                        for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                            $scope.AutoresIIERegistrados = $scope.AutoresIIERegistrados + $scope.AutoresIIE[i].clavePersona + ",";
                        }

                        var Mail = {
                            "Modulo": "Capital Humano",
                            "Empleado": $scope.registro.nombrePersona,
                            "Seccion": "Ponencias",
                            "TipoCorreo": 2,
                            "ClavePersona": $scope.registro.clavePersona,
                            "Descripcion1": "<b>Congreso:</b> " + $scope.registro.congresonombreSelect + "<br/>",
                            "Descripcion2": "<b>Titulo de ponencia:</b> " + $scope.registro.tituloPonencia + "<br/>",
                            "Descripcion3": "<b>Nivel de ponencia:</b> " + $scope.nivelSelect + "<br/>",
                            "Descripcion4": "<b>Estado de ponencia:</b> " + $scope.estadoselect,
                            "Estado": "",
                            "Justificacion": $scope.justificacion,
                            "coautores": $scope.AutoresIIERegistrados,
                            "SeccionID": 1
                        }
                        $scope.desactivar = true;
                        // if ($scope.registro.adjunto != null) {
                        //     $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                        // } else {
                        //     $scope.registro.adjuntoId = null;
                        // }
                        $scope.registro.congresoId = $scope.registro.congresoSelect.congresoId;
                        //$scope.registro.congresoId = $scope.selectedcongreso.originalObject.congresoId;
                        $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;

                        if ($scope.editAdmin == "1") {
                            if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                                $scope.registro.ponenciaId, 12) > 0) {

                            }
                        }

                        for (var i = 0; i < $scope.autoresExtEliminados.length; i++) {
                            $scope.AutoresExt.push($scope.autoresExtEliminados[i]);
                        }
                        PonenciaService.updateAutoresExt($scope.AutoresExt);
                        for (var i = 0; i < $scope.autoresIntEliminados.length; i++) {
                            $scope.AutoresIIE.push($scope.autoresIntEliminados[i]);
                        }
                        PonenciaService.updateAutoresInt($scope.AutoresIIE);

                        switch (opc) {
                            case 1:

                                $scope.registro.estadoFlujoId = 1;
                                PonenciaService.update($scope.registro).then(
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
                                        $state.reload();
                                        $scope.desactivar = false;
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                                break;
                            case 2:

                                if ($scope.editAdmin != "1")
                                    apruebaAdminCHfunction(Mail, id2);
                                break;
                            case 3:
                                if ($scope.justificacion == null) {
                                    toastr.error("Escriba una justificación");
                                    return false;
                                }
                                var registro = {
                                    "solicitudId": id2,
                                    "estadoFlujoId": 1
                                }
                                $scope.registro.estadoFlujoId = 1

                                PonenciaService.update($scope.registro).then(
                                    function (result) {
                                        toastr.success("Solicitud Rechazada!");
                                        PonenciaService.updateSolicitud(registro).then(
                                            function (result) {
                                                var Bitacora = {
                                                    "SolicitudId": registro.solicitudId,
                                                    //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                                    "FechaMovimiento": new Date(),
                                                    "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                                    "Descripcion": "Rechazado: " + $scope.justificacion,
                                                    "EstadoFlujoId": 2,
                                                    "idRol": 1
                                                }
                                                PonenciaService.AddBitacoraSolicitud(Bitacora);
                                                Mail.Estado = "Rechazada"
                                                ///////////////////////////////////////
                                                PonenciaService.mailNotificacionConCoautores(Mail);
                                                // Mail.TipoCorreo = "NotificacionGerenteviaAdmin";
                                                // PonenciaService.mailNotificacionConCoautores(Mail);
                                                $rootScope.globalRegresar(); //$state.go("solicitudesrh");


                                            })
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                                break;
                        }
                    } else { toastr.error("Seleccione un congreso!"); }
                } else { toastr.error("Año invalido!"); }
            }
        }


        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //PonenciaService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.ValidForm.$setDirty();
            angular.element("input[type='file']").val(null);
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
                        return false;
                    }
                }

                $scope.userAdd = false;
                $scope.autorIIE = {};

                $scope.PersonaSeleccionada = null;
                $scope.AutoresIIE.push(Registro);

                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == Registro.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }

            } else {
                toastr.error("Complete los datos requeridos del autor");
            }

        }

        $scope.delete = function (registro) {

            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            if (registro.autorIIEPonenciaId != undefined) {
                registro.nombreCompleto = "eliminar";
                $scope.autoresIntEliminados.push(registro);
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);

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
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion && $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        return false;
                    }
                }

                $scope.addExt = false;

                $scope.AutoresExt.push($scope.autorExt);

                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                $scope.autorExt = {};

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }


        $scope.deleteExt = function (registro) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            if (registro.autorPonenciaExtId != undefined) {
                registro.nombre = "eliminar";
                $scope.autoresExtEliminados.push(registro);
            }

            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $scope.ValidForm.$setDirty();


        };

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();