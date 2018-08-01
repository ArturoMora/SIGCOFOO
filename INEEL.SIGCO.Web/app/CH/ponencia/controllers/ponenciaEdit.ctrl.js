(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("ponenciaCtrlEdit", ['AuthService', '$scope', '$rootScope', 'MenuService', 'PonenciaService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", ponenciaCtrlEdit]);

    function ponenciaCtrlEdit(AuthService, $scope, $rootScope, MenuService, PonenciaService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder) {
        var API = globalGet.get("api");
        window.scrollTo(0, 0);
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        $scope.rolId = MenuService.getRolId();

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.datePicker = getRangoDeFechaDefault(0, 2, 0);
        $scope.editarGestion = 0;
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.paisanterior = "";
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.autoresExtEliminados = [];
        $scope.autoresIntEliminados = [];
        $scope.AutoresIIERegistrados = "";
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;

        $scope.tipoPersonal = AuthService.authentication.userprofile.tipoPersonalId;

        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar


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
                $scope.registro = result.data;
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

                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
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

        PonenciaService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        //////////////////////Buscar persona////////////
        //=======

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaInicio);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de inicio del congreso deber ser menor a la de hoy");
                $scope.registro.fechaInicio = "";
                return false;
            }

            $scope.registro.year = $scope.finalDateComparacion.getFullYear();
        }

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
        $scope.ModificaPais = function () {
            $scope.paisanterior = $scope.paises[$scope.pais - 1].descripcion;
            $scope.registro.lugarCongreso = $scope.paisanterior;
        }
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
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
                            $(":file").filestyle('clear');
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
                
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                var de = parseInt($scope.registro.paginasde);
                var hasta = parseInt($scope.registro.paginashasta);
                if (de > hasta) {
                    toastr.error("Rango de páginas incorrecto");
                    return false;
                }

                for (var i = 0; i < $scope.autoresExtEliminados.length; i++) {
                    $scope.AutoresExt.push($scope.autoresExtEliminados[i]);
                }
                PonenciaService.updateAutoresExt($scope.AutoresExt);
                for (var i = 0; i < $scope.autoresIntEliminados.length; i++) {
                    $scope.AutoresIIE.push($scope.autoresIntEliminados[i]);
                }
                PonenciaService.updateAutoresInt($scope.AutoresIIE);


                if ($scope.registro.congresoSelect != undefined) {
                    if ($scope.registro.paisID != "") {

                        $scope.desactivar = true; $scope.registro.congresoSelect
                        $scope.registro.congresoId = $scope.registro.congresoSelect.congresoId;
                        $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;
                        if ($scope.editarGestion == 0) {
                            $scope.registro.estadoFlujoId = 1;
                        }
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
                                //$state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
                                $scope.desactivar = false;
                                $state.reload();
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    } else { toastr.error("Seleccione un país!"); }
                } else { toastr.error("Seleccione un congreso!"); }
                //} else { 
                //  toastr.error("Año invalido!"); 
                //}
            }
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
        }

        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    //<<<<<<< HEAD
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    if ($scope.registro.fechaInicio > $scope.hoy) {
                        toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    var de = parseInt($scope.registro.paginasde);
                    var hasta = parseInt($scope.registro.paginashasta);
                    if (de > hasta) {
                        toastr.error("Rango de páginas incorrecto");
                        return false;
                    }

                    for (var i = 0; i < $scope.autoresExtEliminados.length; i++) {
                        $scope.AutoresExt.push($scope.autoresExtEliminados[i]);
                    }
                    PonenciaService.updateAutoresExt($scope.AutoresExt);
                    for (var i = 0; i < $scope.autoresIntEliminados.length; i++) {
                        $scope.AutoresIIE.push($scope.autoresIntEliminados[i]);
                    }


                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        $scope.AutoresIIERegistrados = $scope.AutoresIIERegistrados + $scope.AutoresIIE[i].clavePersona + ",";
                    }



                    PonenciaService.updateAutoresInt($scope.AutoresIIE);
                    //=======

                    ////////Hace una verificacion de tipo personal, de esta forma evitamos enviar una solicitud de un gerente a si mismo
                    if ($scope.validacion == 0 && $scope.rolId != 4 && $scope.rolId != 5 && $scope.rolId != 16) {
                        var Registro = {
                            "ponenciaId": $scope.registro.ponenciaId,
                            "estadoFlujoId": 8
                        };
                        //$scope.update();
                        //Cambiar el estado del registro
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 8;
                        PonenciaService.update($scope.registro).then(  //normalmente los flujos (a nivel tecnico) de las solicitudes en la ficha curricular siguen los siguientes pasos
                            function (result) { //1 : Se actualiza el registro y su estado, una vez que se hace eso se crea una solicitud de validacion de info (para el admin o gerente)
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 12,
                                    "InformacionId": $scope.registro.ponenciaId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 8,
                                    "ClaveUnidadAut": $scope.registro.claveUnidadAut
                                }
                                PonenciaService.AddSolicitud(Solicitud).then(
                                    function (result) { // 2: Cuando se termina de registrar la solicitud entonces parte de esos datos (de la solicitud) se usan para registrarlos en una bitacora de solicitudes (la bitacora contiene todos los movimientos de la solicitud tuvo)
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        PonenciaService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {  //3: Cuando se registra la solicitud en la bitacora se crea entonces el cuerpo del correo a enviar
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Ponencias",
                                            "TipoCorreo": "SolicitudGerente",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "coautores": $scope.AutoresIIERegistrados,
                                            "Descripcion1": 1
                                        }
                                        PonenciaService.mailNotificacionConCoautores(Mail);
                                        toastr.success("Solicitud Enviada!");

                                        if (origenCH) {
                                            $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
                                        } else {
                                            $rootScope.globalRegresar();
                                        }
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                                $rootScope.globalRegresar();
                            });
                    } else {
                        var Registro = {
                            "ponenciaId": $scope.registro.ponenciaId,
                            "estadoFlujoId": 2
                        };
                        //Cambiar el estado del registro
                        $scope.registro.estadoFlujoId = 2;
                        PonenciaService.update($scope.registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 12,
                                    "InformacionId": $scope.registro.ponenciaId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 2
                                }
                                PonenciaService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }

                                        PonenciaService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Ponencias",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "coautores": $scope.AutoresIIERegistrados,
                                        }
                                        PonenciaService.mailNotificacionConCoautores(Mail);
                                        toastr.success("Solicitud Enviada!");

                                        if (origenCH) {
                                            $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
                                        } else {
                                            $rootScope.globalRegresar();
                                        }
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;

                                $rootScope.globalRegresar();
                            });
                    }
                }
            } catch (e) {

                throw e;
            }

        }
        
        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
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
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                $scope.userAdd = false;
                $scope.autorIIE = {};
                $scope.PersonaSeleccionada = null;
                $scope.AutoresIIE.push(Registro);
                
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
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
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
            $scope.auxColabora.splice(idx, 1);

        };
        $scope.ModificaPais = function () {
            $scope.registro.paisID = $scope.paisID;

        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();