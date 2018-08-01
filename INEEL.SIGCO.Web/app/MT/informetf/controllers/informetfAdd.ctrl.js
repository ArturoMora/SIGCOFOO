(function () {
    "use strict";
    var app = angular.module("ineelMT");
    app.controller("informetfAdd", ["$scope", "$rootScope", "$location", "$state", "$stateParams", "itfsService",
        "globalGet", "CalifResultadosFinancierosService", "CalificacionClienteService",
        "CalificacionPersonalService", "PersonalProyectoService", 'uploadFileACH', "$window",
        "MenuService", "AuthService", "$uibModal", "DTOptionsBuilder", "$filter", 'comunService', "buscarInsumosService",
        informetfAdd]);

    function informetfAdd($scope, $rootScope, $location, $state, $stateParams, itfsService,
        globalGet, CalifResultadosFinancierosService, CalificacionClienteService,
        CalificacionPersonalService, PersonalProyectoService, uploadFileACH, $window, MenuService,
        AuthService, $uibModal, DTOptionsBuilder, $filter, comunService, buscarInsumosService) {
        var itfId = $stateParams.id;
        var id2 = $stateParams.foo;
        $scope.idRol = MenuService.getRolId();
        $scope.idPublico = 1; //mapearlo con MT.cat_TipoAcceso
        var proyectoId = itfId;


        $scope.sefacturo = false;

        var d = new Date();
        $scope.anioActual = d.getUTCFullYear();

        $scope.disabledTitulo = true;
        $scope.disabledTipoAcceso = true;

        $scope.disabledEnabled = function (elemento) {

            if (elemento == undefined || elemento == null) {
                $scope.disabledTitulo = !$scope.disabledTitulo;
            }
            else if (elemento == "tipoAcceso") {
                $scope.disabledTipoAcceso = !$scope.disabledTipoAcceso;
            }

        }
        $scope.nombreUnidad = "";
        $scope.selectTipo = [];
        $scope.AutoresIIE = [];
        $scope.autorIIE = {};
        $scope.debug = false;
        $scope.authentication = AuthService.authentication;
        $scope.adminMT = false;
        $scope.isGerente = false;
        $scope.tieneInfoGral = false;

        $scope.puedeagregar = false;

        if ($scope.authentication.userprofile.roles != undefined) {

            if (MenuService.getRolId() == 16) {
                $scope.isGerente = true;
            }

            if (MenuService.getRolId() == 5) {
                $scope.isGerente = true;
            }

            if (MenuService.getRolId() == 4) {
                $scope.isGerente = true;
            }
            if (MenuService.getRolId() == 2) {
                $scope.adminMT = true;
            }
        }

        $scope.itfToProyects = function () {
            $window.history.back();
        }
        $scope.funciones = MenuService.getMenuMT();

        if ($rootScope.isAdminMT != undefined && $rootScope.isAdminMT === true) {
            $scope.fromAdminMT = true;
        } else {
            $scope.fromAdminMT = false;
        }


        $scope.txtGuardar = "Siguiente";

        $scope.click = false;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.tieneAdjuntos = false;


        $scope.tab = 1;
        $scope.active1 = "active";
        $scope.limpiar = function () {
            $scope.active1 = "";
            $scope.active2 = "";
            $scope.active3 = "";
            $scope.active4 = "";
            $scope.active5 = "";
            $scope.active6 = "";
            $scope.active7 = "";
            $scope.active8 = "";
        }


        //VARIABLE PARA VALIDAR LA FECHA CPP CONTRA LA DE TERMINO DEL PROYECTO PARA PODER ACTIVAR BANNER QUE PERMITE AGREGAR NUEVOS PARTICIPANTES AL PROYECTO
        var fechaCCP = new Date("12/31/2000");

        $scope.activarTab = function (num) {
            $scope.limpiar();
            switch (num) {
                case 1:
                    $scope.active1 = "active";
                    break;
                case 2:
                    $scope.active2 = "active";
                    break;
                case 3:
                    $scope.active3 = "active";
                    break;
                case 4:
                    $scope.active4 = "active";
                    break;
                case 5:
                    $scope.active5 = "active";
                    break;
                case 6:
                    $scope.active6 = "active";
                    break;
                case 7:
                    $scope.active7 = "active";
                    break;
                case 8:
                    $scope.active8 = "active";
                    break;
                default:
            }
        }

        $scope.startTab = function () {
        }


        try {

            if ($rootScope.nameState.indexOf(".infoGral") > 0) {
                $scope.activarTab(1);
            }

            if ($rootScope.nameState.indexOf(".resultadosP") > 0) {
                $scope.activarTab(2);
            }
            if ($rootScope.nameState == "ITF.satisfCliente") {
                $scope.activarTab(3);
            }
            if ($rootScope.nameState == "ITF.resultados") {
                $scope.activarTab(4);
            }
            if ($rootScope.nameState == "ITF.proyFuturos") {
                $scope.activarTab(5);
            }
            if ($rootScope.nameState == "ITF.evaluaciones") {
                $scope.activarTab(4); //  $scope.activarTab(6);
            }
            if ($rootScope.nameState == "ITF.leccionesAprend") {
                $scope.activarTab(5); //$scope.activarTab(7);
            }
            if ($rootScope.nameState == "ITF.insumos") {
                $scope.activarTab(6); //$scope.activarTab(8);
            }

        } catch (e) { }


        $scope.newTAB = function () {
            $scope.startTab();
            $scope.activarTab($scope.tab);
            //toastr.success($scope.tab, "$scope.tab");
        }

        $scope.startTab();


        $scope.existeITF = false;
        ////toastr.success("$stateParams.id:" + $stateParams.id);
        $scope.adjuntosITFList = [];
        $scope.revision = function () {
            itfsService.enviarARevision($scope.itf.informeTecnicoFinalId).then(
                function (result) {
                    var Solicitud = {
                        "ClavePersona": $scope.registro.clavePersona,
                        "TipoInformacionId": 21,
                        "InformacionId": $scope.itf.informeTecnicoFinalId,
                        "FechaSolicitud": new Date(),
                        "EstadoFlujoId": 8,
                        "ClaveUnidadAut": $scope.registro.claveUnidadAut
                    }
                    itfsService.AddSolicitud(Solicitud).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": result.data,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": $scope.registro.clavePersona,
                                "Descripcion": "Se envió la solicitud al Gerente",
                                "EstadoFlujoId": 1
                            }
                            toastr.success("El Informe T&eacute;cnico Final fue enviado a revisi&oacute;n");
                            itfsService.AddBitacoraSolicitud(Bitacora).then(
                                function (result) {
                                    var Mail = {
                                        "Modulo": "Memoria Tecnológica",
                                        "Empleado": $scope.registro.nombrePersona,
                                        "Seccion": "Informe Técnico Final",
                                        "TipoCorreo": "SolicitudGerente",
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Descripcion1": 1
                                    }
                                    //PublicacionService.mailNotificacion(Mail); //correo en el back

                                    $state.go("AddITF");
                                },
                                function (error) { $state.go("AddITF"); }

                            );

                        })


                },
                function (err) {
                    console.error(err);
                    toastr.error("Error al procesar la solicitud");
                    $state.go("AddITF");
                    // $location.path("/ListaItf");
                });
        };


        $scope.ApruebaRechazaGerente = function () {
            $scope.modalResult = {};
            $scope.datosDeModal = {
                msg1: "Aprobar solicitud",
                msg2: "Regresar solicitud",
                titulo: "Responder a solicitud de aprobación de ITF"
            }
            $scope.result = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/MT/GenericoMT/SolicitudConJustificacion.html',
                controller: 'SolicitudConJustificacionMTctrl',
                resolve: {
                    result: function () {
                        return $scope.datosDeModal;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.modalResult = selectedItem;
                $scope.postModalApruebaRechazaGerente($scope.modalResult);
            });

        }

        $scope.aprobacion1 = function () {

            if ($scope.AutoresIIE.length == 0) {
                toastr.error("No se encontraron Autores", "Error al procesar su solicitud");
                return;
            }
            $scope.ApruebaRechazaGerente();
        };



        function setBitacoraAprobacionRechazoGerente(correo, stateX) {
            //alert(id2);
            var attrs = {
                estadoFlujoId: 8,
                tipoInformacionId: 21,
                informacionId: $scope.itf.informeTecnicoFinalId
            };

            itfsService.GetBySolicitudAttrs(attrs).then(
                function (result) {
                    if (result.data != null) {
                        id2 = result.data.solicitudId;
                    }
                    $scope.bitacoraGerente(correo, stateX);
                },
                function (error) {
                    $scope.bitacoraGerente(correo, stateX);
                }
            );





            //Mail.Estado = "Aprobada"
            //PublicacionService.mailNotificacion(Mail);
        }


        $scope.bitacoraGerente = function (correo, stateX) {
            //alert("new: " + id2);
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 0
            }
            var Bitacora = {
                "SolicitudId": registro.solicitudId,
                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                "FechaMovimiento": new Date(),
                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                "Descripcion": correo.aprueba ? "Aprobado: " + correo.Justificacion : "Rechazado: " + correo.Justificacion,
                "EstadoFlujoId": 8,
                "idRol": 4
            }
            //correo.aprueba ? 8 : 1
            registro.estadoFlujoId = correo.aprueba ? 2 : 1;
            itfsService.updateSolicitud(registro).then(
                function (result) {
                    itfsService.AddBitacoraSolicitud(Bitacora).then(
                        function (result) { $state.go(stateX); },
                        function (error) { $state.go(stateX); }
                    );
                },
                function (error) { }
            );
        }
        $scope.sendCorreo = function (correo, stateX) {
            itfsService.sendCorreo(correo).then(
                function (result) { setBitacoraAprobacionRechazoGerente(correo, stateX); },
                function (error) {
                    setBitacoraAprobacionRechazoGerente(correo, stateX);
                    console.log(error);
                }
            );
        }

        $scope.postModalApruebaRechazaGerente = function (deModal) {

            var correo = { aprueba: true };
            correo.Modulo = "Memoria Tecnológica";
            //correo.Empleado = $scope.authentication.userprofile.nombre + ' ' + $scope.authentication.userprofile.apellidoPaterno + ' ' + $scope.authentication.userprofile.apellidoMaterno;
            correo.TipoCorreo = "ApruebaRechazaGerenteITF";
            correo.Descripcion1 = "<b>Respuesta de solicitud de aprobación de Informe T&eacute;cnico Final</b><br/>";
            correo.Descripcion2 = "";
            correo.Descripcion3 = "Proyecto: " + $scope.itf.proyecto.nombre;
            correo.Justificacion = deModal.justificacion;
            correo.ClavePersona = $scope.itf.proyecto.numjefeProyecto;
            //correo.UnidadOrganizacional = $scope.authentication.userprofile.unidadOrganizacional;


            var correoAdmMT = {};
            correoAdmMT.Modulo = "Memoria Tecnológica";
            //correo.Empleado = $scope.authentication.userprofile.nombre + ' ' + $scope.authentication.userprofile.apellidoPaterno + ' ' + $scope.authentication.userprofile.apellidoMaterno;
            correoAdmMT.TipoCorreo = "EnviaSolicituITFRevisionMT";
            correoAdmMT.Descripcion2 = "<b> revisar un informe t&eacute;cnico final asociado al proyecto : " + $scope.itf.proyecto.nombre + " para su revisi&oacute;n y posterior publicaci&oacute;n </b><br/>";
            correoAdmMT.Descripcion1 = "";
            correoAdmMT.Descripcion3 = "";
            correoAdmMT.Justificacion = deModal.justificacion;
            correoAdmMT.ClavePersona = "04711";







            if (deModal.ok1 == true) {
                itfsService.aprobacion1($scope.itf.informeTecnicoFinalId).then(
                    function (result) {
                        toastr.success("El Informe T&eacute;cnico Final fue aprobado");
                        //mandarCorreo pendiente  deModal.justificacion
                        correo.Descripcion2 = "<b> Aprobado por su jefe inmediato superior, la cu&aacute;l fue enviada al Administrador de MT para su revisi&oacute;n y posterior publicaci&oacute;n </b><br/>"
                        $scope.sendCorreo(correo, "SolicitudesITFs");
                        $scope.sendCorreo(correoAdmMT, "SolicitudesITFs");
                        //$state.go("SolicitudesITFs");
                    },
                    function (err) {
                        console.error(err);
                        toastr.error("Error al procesar la solicitud");
                        $location.path("/ListaItf");
                    });
            } else if (deModal.ok2 == true) {
                itfsService.RechazaAprobacion1($scope.itf.informeTecnicoFinalId).then(
                    function (result) {
                        toastr.success("El Informe T&eacute;cnico Final fue regresado exitosamente, para revisi&oacute;n de cambios sugeridos");
                        //mandarCorreo pendiente  deModal.justificacion
                        correo.Descripcion2 = "<b>Regresado por su jefe inmediato superior, favor de atender los comentarios en la justificación</b><br/>"
                        correo.aprueba = false;
                        $scope.sendCorreo(correo, "SolicitudesITFs");
                        //$state.go("SolicitudesITFs");
                    },
                    function (err) {
                        console.error(err);
                        toastr.error("Error al procesar la solicitud");
                        $location.path("/ListaItf");
                    });
            }

        };

        $scope.SetNewITF = function () {

            if (!$scope.existeITF && $stateParams.edit === "false") {
                ////
                $scope.itf = {
                    informeTecnicoFinalId: $stateParams.id,
                    proyectoId: $stateParams.id,
                    evaluaciones: [],
                    adjuntoITF: [],
                    estadoITFFlujoId: 0,

                };
                itfsService.getProyecto($stateParams.id).then(
                    function (result) {
                        $scope.itf.titulo = result.data.nombre;
                        itfsService.create($scope.itf).then(
                            function (result) {
                                //toastr.success("se ha creado nuevo ITF");
                                $scope.startITF();
                            },
                            function (err) {
                                console.error(err);
                                toastr.error("Error en la solicitud");
                                $location.path("/ListaItf")
                            });
                    },
                    function (err) {
                        console.error(err);
                    });

            }
        };

        $scope.ocultarGuardar = true;
        ////alert($scope.ocultarGuardar);
        $scope.editable = false;
        $scope.cliente = "NO DISPONIBLE";
        $scope.setBanderas = function () {

            //toastr.info("Jefe de proyecto no. ", $scope.itf.proyecto.numjefeProyecto);
            if ($scope.itf.estadoITFFlujoId == 0 && $scope.itf.proyecto.numjefeProyecto == $scope.authentication.userprofile.clavePersona) {
                $scope.editable = true;
            }
            if (!($scope.itf.estadoITFFlujoId == 1 && $scope.itf.proyecto.numjefeProyecto == $scope.authentication.userprofile.clavePersona)) {
                $scope.ocultarGuardar = false;
            }



            if ($scope.itf.proyecto.facturacionReal == null) {

                $scope.mensajefactura = "NO DISPONIBLE";
            } else {
                $scope.sefacturo = true;
                $scope.mensajefactura = $scope.itf.proyecto.facturacionReal;
            }

            //recuperar nombre de empresa y de unidad
            itfsService.GetNameEmpresaAndUnidadByProyect($scope.itf.proyecto).then(
                function (result) {
                    if (result.data != null) {
                        if (result.data.empresa != null) {
                            $scope.cliente = result.data.empresa;
                        }
                        if (result.data.unidad != null) {
                            $scope.cliente = $scope.cliente + " / " + result.data.unidad;
                        }
                    }
                },
                function (error) { }
            );
        }
        $scope.getNameUnidad = function () {
            comunService.UnidadOrganizacional.GetNameById($scope.itf.proyecto.unidadOrganizacionalId).then(
                function (result) {
                    $scope.nombreUnidad = result.data;
                },
                function (error) {
                }
            );
        }
        $scope.getProyecto = function () {

            if ($scope.itf.proyecto == undefined || $scope.itf.proyecto == null) {
                itfsService.getProyecto($scope.itf.proyectoId).then(
                    function (result) {
                        $scope.proyecto = result.data;
                        $scope.itf.proyecto = $scope.proyecto;
                        $scope.setBanderas();
                        $scope.getNameUnidad();
                    },
                    function (err) {
                        console.error(err);
                    });
            } else {
                $scope.proyecto = $scope.itf.proyecto;
                $scope.getNameUnidad();
                $scope.setBanderas();
            }
        }
        $scope.registro = {};
        itfsService.GetByID_Collections(itfId).then(
            function (result) {

                $scope.existeITF = true;
                $scope.itf = result.data;

                itfsService.Persona(result.data.proyecto.numjefeProyecto).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = $scope.itf.proyecto.numjefeProyecto;
                        $scope.registro.claveUnidadAut = $scope.itf.proyecto.unidadOrganizacionalId;
                    });
                if (!$scope.itf.anioElaboracion) {
                    // $scope.itf.anioElaboracion = $filter('date')(new Date(), 'yyyy');
                }

                //**********************************************************************
                //**********************************************************************
                //**********************************************************************
                //**********************************************************************
                //**********************************************************************
                //**********************************************************************

                if ($scope.itf.proyecto != null) {
                    if ($scope.itf.proyecto.fechaFin != null) {


                        var fechafinProy = new Date($scope.itf.proyecto.fechaFin);

                        if (fechafinProy <= fechaCCP) {

                            $scope.puedeagregar = true;
                        }
                    }

                }



                try {
                    $scope.itf.archivos = $scope.itf.itFgeneralId;
                } catch (e) { }

                try {
                    $scope.adjuntosITFList = $scope.itf.itFgeneral.adjuntoITF;
                } catch (err) {
                }
                try {
                    if ($scope.adjuntosITFList.length > 0)
                        $scope.tieneAdjuntos = true;
                } catch (e) { }

                if (result.data === null) {
                    //////////////
                    $scope.existeITF = false;
                    $scope.SetNewITF();
                } else {
                    $scope.startITF();
                }
            },
            function (err) {

                console.log(err);
                $scope.existeITF = false;
                $scope.SetNewITF();
            });

        $scope.startITF = function () {

            if (!$scope.itf.itFgeneral) {
                $scope.tieneInfoGral = false;
                var element = {
                    "claveAutor": $scope.authentication.userprofile.clavePersona,
                    "nombreCompleto": $scope.authentication.userprofile.nombreCompleto,
                    "informeTecnicoFinalId": $scope.itf.informeTecnicoFinalId,
                    "estado": true
                }
                $scope.AutoresIIE.push(element);
                itfsService.AddAutor(element).then(
                    function (result) {
                        console.log(result);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            } else {
                $scope.tieneInfoGral = true;
                itfsService.getAllAutores($scope.itf.informeTecnicoFinalId).then(
                    function (result) {
                        console.log(result);
                        if (result.data != null) {
                            var rows = result.data;
                            for (var i = 0; i < rows.length; i++) {

                                var element = {
                                    "claveAutor": rows[i].clavePersona,
                                    "nombreCompleto": rows[i].nombreCompleto,
                                    "informeTecnicoFinalId": $scope.itf.informeTecnicoFinalId,
                                    "estado": true
                                }
                                $scope.AutoresIIE.push(element);
                            }
                        }
                    }, function (error) { }
                );
                $scope.AutoresIIE
            }

            $scope.proyectoId = $scope.itf.proyectoId;
            proyectoId = $scope.itf.proyectoId;
            $scope.loading = true;
            $scope.editarEval = false;

            if (($scope.itf.evaluaciones != null && $scope.itf.evaluaciones.length > 0)) {
                $scope.editarEval = true;
            }
            $scope.foo = $stateParams.foo | 1;
            $scope.agrega = false;
            $scope.formData = {};
            $scope.fileNameNew = "";
            $scope.fileNameChaged = function () {
                //alert("select file");
            };
            $scope.siguienteIG = false;
            $scope.saveIG = function () {
                ////////////
                $scope.siguienteIG = true;
            };


            $scope.tasklist = [];
            $scope.tasklistInsumos = [];

            $scope.resultadosEconomicos = [];
            $scope.CalificacionCliente = [];
            $scope.CalificacionPersonal = [];
            $scope.PersonalProyecto = [];
            $scope.TipoInsumo = [];

            //$scope.itf = {};
            ////
            if (!$scope.itf.evaluaciones || $scope.itf.evaluaciones === null) {
                $scope.itf.evaluaciones = [];
            }
            if (!$scope.itf.insumos || $scope.itf.insumos === null) {
                $scope.itf.insumos = {};
            }


            $scope.proyecto = {};



            $scope.edit = $stateParams.edit;




            //#region carga de catalogos
            CalifResultadosFinancierosService.getAll().then(
                function (result) {
                    //$scope.resultadosEconomicos = result.data;
                    $scope.resultadosEconomicos = [];
                    var cont2 = 0;
                    for (var cont = 0; cont < result.data.length; cont++) {
                        if (result.data[cont].estado == 1) {
                            $scope.resultadosEconomicos[cont2] = result.data[cont];
                            cont2++;
                        }
                    }
                },
                function (err) {
                    console.error(err);
                });
            CalificacionClienteService.getAll().then(
                function (result) {
                    //$scope.CalificacionCliente = result.data;
                    $scope.CalificacionCliente = [];
                    var cont2 = 0;
                    for (var cont = 0; cont < result.data.length; cont++) {
                        if (result.data[cont].estado == 1) {
                            $scope.CalificacionCliente[cont2] = result.data[cont];
                            cont2++;
                        }
                    }
                },
                function (err) {
                    console.error(err);
                });
            $scope.debugCalifPersonal = [];
            CalificacionPersonalService.getAll().then(
                function (result) {
                    //$scope.CalificacionPersonal = result.data;
                    $scope.CalificacionPersonal = [];
                    var cont2 = 0;
                    for (var cont = 0; cont < result.data.length; cont++) {
                        if (result.data[cont].estado == 1) {
                            $scope.CalificacionPersonal[cont2] = result.data[cont];
                            cont2++;
                        }
                    }
                },
                function (err) {
                    console.error(err);
                });
            PersonalProyectoService.getProyPersonas(proyectoId).then(
                function (result) {
                    $scope.debugCalifPersonal = result.data;
                    $scope.PersonalProyecto = result.data;
                },
                function (err) {
                    console.error(err);
                });
            itfsService.getTipoInsumo().then(
                function (result) {
                    $scope.TipoInsumo = result.data;//aqui
                },
                function (err) {
                    console.error(err);
                });

            //#endregion carga de catalogos
            if ($scope.itf === null) {
                toastr.error("Error en la solicitud3");
                $location.path("/ListaItf")
            }

            $scope.getProyecto();

            $scope.loading = false;
        }
        itfsService.getTipoAcceso().then(
            function (result) {
                $scope.selectTipo = result.data;
            },
            function (err) {
                console.error(err);
            });

        $scope.addCalif = function (personalProyectoId, calif, ngModel) {
            if ($scope.itf.evaluaciones.length > 0) {

                for (var i = 0; i < $scope.itf.evaluaciones.length; i++) {
                    if ($scope.itf.evaluaciones[i].personalProyectoId === personalProyectoId) {
                        $scope.itf.evaluaciones.splice(i, 1);
                        break;
                    }
                }
            }
            $scope.itf.evaluaciones.push(
                { "califPer": calif, "personalProyectoId": personalProyectoId, "IdInformeTecnicoFinal": $scope.itf.informeTecnicoFinalId }
            );
        };

        $scope.NotContainsIn = function (evaluados) {
            return function (item) {

                if (evaluados == undefined || evaluados == null || evaluados.length < 1) {
                    return true;
                }
                for (var i = 0; i < evaluados.length; i++) {
                    if (item.clavePersona === evaluados[i].personalProyecto.persona.clavePersona) {
                        return false;
                    }
                }
                return true;
            };
        };

        $scope.save = function (paso, next) {


            switch (paso) {
                case 1:
                    if ($scope.itf.itFgeneral.resumen == null) {
                        toastr.error("Complete los datos requeridos");
                        $scope.click = false;
                        return false;
                    } else {

                        $scope.itf.itFgeneral.tipoAcceso = $scope.selectTipo;


                        $scope.itf.itFgeneral.accesoTipo = $scope.selectTipo[1].tipoAccesoId;

                        if (!($scope.itf.itFgeneral.adjuntoITF != null && $scope.itf.itFgeneral.adjuntoITF.length > 0)) {
                            $scope.itf.itFgeneral.adjuntoITF = [];
                        }
                        angular.forEach($scope.tasklist, function (value, key) {
                            $scope.itf.itFgeneral.adjuntoITF.push({
                                adjunto:
                                {
                                    "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                                    "nombre": value.nameFile.replace(/\"/g, ""),
                                    moduloId: "MT"
                                }
                            });

                        });
                        $scope.tasklist = [];
                    }
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:





                    //    break;
                    //case 7:
                    //    break;
                    //case 8:

                    if ($scope.itf.insumos == null) {
                        $scope.itf.insumos = {};
                        $scope.itf.insumos.adjuntoITFInsumo = [];
                    } else {
                        //$scope.itf.insumos = {};
                        $scope.itf.insumos.adjuntoITFInsumo = [];
                        if (!($scope.itf.insumos.adjuntoITFInsumo != null && $scope.itf.insumos.adjuntoITFInsumo.length > 0)) {
                            $scope.itf.insumos.adjuntoITFInsumo = [];
                        }
                    }
                    angular.forEach($scope.tasklistInsumos, function (value, key) {
                        $scope.itf.insumos.adjuntoITFInsumo.push({
                            adjunto:
                            {
                                "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                                "nombre": value.nameFile.replace(/\"/g, ""),
                                moduloId: "MT"
                            }
                        });
                    });

                    if (!$scope.itf.listaInsumos && $scope.itf.listaInsumos == null) {
                        $scope.itf.listaInsumos = [];
                    }
                    $scope.itf.listaInsumos.push($scope.itf.insumos);
                    break;
                default:
                    toastr.error("Opción incorrecta");
            }


            ////////
            //itfsService.create($scope.itf).then(
            itfsService.update($scope.itf).then(
                function (result) {

                    toastr.success("en proyecto:" + proyectoId, result.data);
                    $scope.click = false;
                    //GetByID_Collections --> GetFKs
                    itfsService.GetByID_Collections(itfId).then(
                        function (result) {

                            $scope.itf = result.data;
                            try {
                                $scope.adjuntosITFList = $scope.itf.itFgeneral.adjuntoITF;
                            } catch (e) { }

                            if ($scope.itf.evaluaciones == null) {
                                $scope.itf.evaluaciones = [];
                            }
                            if (paso === 6) {
                                $scope.editarEval = true;
                            }
                            if (paso == 8 || paso === 6) {
                                ////
                                $scope.tasklistInsumos = [];
                                // console.log('/ITF/' + $scope.itf.informeTecnicoFinalId + '/true/' + $scope.foo + 1 + '/insumos');
                                //toastr.success("Puede agregar un nuevo insumo");
                                $location.path('/ITF/' + $scope.itf.informeTecnicoFinalId + '/true/' + $scope.foo + 1 + '/insumos');

                            } else {
                                //$scope.startITF();
                                $scope.tab = paso + 1;
                                $scope.newTAB();
                                $state.go(next);
                            }

                        },
                        function (err) {
                            ////////
                            toastr.warning("Error");
                            $state.go("informes-tecnicos-finales");
                        });

                },
                function (err) {
                    $scope.click = false;
                    console.error(err);
                });
        }
        //Buscar Persona
        $scope.PersonaSeleccionada = {};
        $scope.verpersona = false;

        $scope.openResponsable = function () {

            $scope.desabilitarBuscarResponsable = true;
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        $scope.verpersona = false;
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                var compara = angular.equals($scope.claveBecario, selectedItem.clavePersona);
                if (compara == true) {
                    toastr.error("El becario y asesor no debe ser el mismo");
                    return false;
                }
                else {
                    $scope.itf.insumos.responsableIns = selectedItem.nombreCompleto;
                    //$scope.registroBecario.asesor_ClavePersona = selectedItem.clavePersona;
                    //$scope.registroBecario.asesor_Nombre = selectedItem.nombreCompleto;
                    //$scope.PersonaSeleccionada = selectedItem;
                }
            });
            $scope.desabilitarBuscarResponsable = false;
        }


        $scope.datoscompletos = function (paso, next) {


            $scope.click = true;
            var update = false;



            switch (paso) {
                case 1:
                    update = false;
                    if ($scope.itf.itFgeneral.resumen == null) {
                        toastr.error("Complete los datos requeridos");
                        $state.go("ITF.infoGral");
                    }
                    else {

                        update = true;
                        //$state.go(next);
                    }
                    break;
                case 2:
                    update = false;
                    //////////
                    if ($scope.itf.resultadosE.califResE === null) {
                        toastr.error("Complete los datos requeridos en resultados economicos");
                    } else {
                        update = true;
                    }
                    break;
                case 3:
                    update = false;
                    ;
                    if (!($scope.formITF.justificacion.$valid && $scope.formITF.calificacionClienteId.$valid)) {

                        toastr.error("Complete los datos requeridos en satisfacción del cliente");
                    } else {
                        update = true;
                    }
                    break;
                //case 4:
                //    update = true;
                //  break;
                case 5:
                    update = true;
                    break;
                case 4: //6

                    update = false;
                    if ($scope.itf.evaluaciones === null || $scope.itf.evaluaciones.length < 1) {
                        toastr.error("Complete los datos requeridos en evaluaciones");
                    } else {
                        update = true;
                    }
                    if ($scope.PersonalProyecto != null && $scope.PersonalProyecto.length > 0) {

                        if ($scope.itf.evaluaciones != undefined && $scope.itf.evaluaciones != null) {
                            if ($scope.itf.evaluaciones.length < $scope.PersonalProyecto.length) {
                                update = false;

                                toastr.info("Debe completar todas las evaluaciones");
                            }
                        }
                    }
                    break;
                case 6:
                    update = true;
                    break;
                case 7:
                    update = true;
                    break;
                case 8:
                    update = true;
                    break;
                default:
                    //toastr.error("Opción incorrecta");
                    break;
            }

            if (update) {
                $scope.save(paso, next);
            } else {
                $scope.click = false;
            }
        }


        //--------------------------------------------------- logica de adjunto para INFO GRAL
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: Date.now(), /* */
                size: '20', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
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

                        toastr.error(error);
                    }
                    $(":file").filestyle('clear');

                });
        };

        $scope.deleteTask = function (index) {
            $scope.tasklist.splice(index, 1);

        }
        // CONFIRMATION.        
        function transferComplete(result) {


            $scope.$apply(function () {
                $scope.itf.archivos = result.fullPathFile;
                $scope.fileNameNew = result.nameFile;
                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {
                    if ($scope.tasklist == null) {
                        $scope.tasklist = [];
                    }
                    for (var i = 0; i < $scope.tasklist.length; i++) {
                        if ($scope.tasklist[i].nameFile == result.nameFile) {
                            toastr.error(result.nameFile, "Ya se encuentra un documento con el nombre ");
                            $(":file").filestyle('clear');
                            return;
                        }
                    }

                    for (var i = 0; i < $scope.adjuntosITFList.length; i++) {
                        if ($scope.adjuntosITFList[i].adjunto.nombre == result.nameFile) {
                            toastr.error(result.nameFile, "Ya se encuentra un documento con el nombre ");
                            $(":file").filestyle('clear');
                            return;
                        }
                    }
                    $scope.tasklist.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                }
                $(":file").filestyle('clear');
            });

        }
        //#endregion info gral
        //--------------------------------------------------- logica de adjunto para INSUMOS        
        //#region insumos
        $scope.getFileDetailsInsumos = function (adjunto) {
            if (adjunto.files.length <= 0) {
                return false;
            }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*",
                type: Date.now(),
                size: '8',
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {


                        if (!result.error) {
                            updateProgressInsumos(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                    $(":file").filestyle('clear');

                });
        };

        $scope.deleteTaskInsumos = function (index) {

            $scope.tasklistInsumos.splice(index, 1);
            $(":file").filestyle('clear');

        }
        // CONFIRMATION.        
        function updateProgressInsumos(result) {


            $scope.$apply(function () {
                $scope.itf.archivos = result.fullPathFile;
                $scope.fileNameNew = result.nameFile;
                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {
                    if (!existeArchivo($scope.tasklistInsumos, result)) {
                        $scope.tasklistInsumos.push(
                            {
                                "nameFile": result.nameFile,
                                "fullpath": result.fullPathFile
                            });
                    }
                }
                $(":file").filestyle('clear');
            });

        }
        //#endregion insumos
        $scope.deleteAdjuntoITF = function (row) {

            itfsService.DeleteAdjuntoITF(row).then(
                function (result) {
                    toastr.success(result.data);
                    try {
                        var index = $scope.adjuntosITFList.indexOf(row);
                        $scope.adjuntosITFList.splice(index, 1);

                    } catch (e) { console.log(e); }
                },
                function (error) {
                    toastr.error("error al eliminar el elemento");
                    console.log(error);
                }
            );
        }
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.add_userExt = function () {
            $scope.addExt = false;
            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                if ($scope.AutoresIIE[i].claveAutor == $scope.PersonaSeleccionada.clavePersona) {
                    toastr.error("El autor " + $scope.PersonaSeleccionada.nombreCompleto + " ya existe dentro de la tabla de autores!");
                    return;
                }
            }
            var element = {
                "claveAutor": $scope.PersonaSeleccionada.clavePersona,
                "nombreCompleto": $scope.PersonaSeleccionada.nombreCompleto,
                "InformeTecnicoFinalId": $scope.itf.informeTecnicoFinalId,
                "Estado": true
            }

            itfsService.AddAutor(element).then(
                function (result) {
                    $scope.AutoresIIE.push(element);
                    console.log(result);
                },
                function (error) {
                    toastr.error("NO fue posible agregar al Autor");
                    console.error(error);
                }
            );
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
                if (!selectedItem) {
                } else {
                    $scope.add_userExt();
                }
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
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            $uibModalInstance.dismiss('close');
            itfsService.DeleteAutor(registro).then(
                function (result) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                }
            );


        };
        $scope.deleteJP = function () {
            toastr.error('no es posible eliminar a este autor');
        }
        ///////////////////////////////////////////////////////////////
        $scope.newPersonalProyecto = function (proy) {
            $rootScope.proyectoRoot = proy;
            $state.go("agregarParticipacionProyecto");
        }
        $scope.eliminarInsumo = function (registro) {
            ////alert(id);


            $scope.descripcionRow = registro.nombreIns;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.deleteInsumo(registro.insumosId, $uibModalInstance);


                        var idx = $scope.itf.listaInsumos.indexOf(registro);
                        if (idx !== -1) {
                            //array.splice(idx, 1);
                            $scope.itf.listaInsumos.splice(idx, 1);
                        }



                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };
        $scope.deleteInsumo = function (idInsumo, $uibModalInstance) {
            buscarInsumosService.DeleteInsumo(idInsumo).then(
                function (result) {
                    $uibModalInstance.dismiss('close');
                    toastr.success(result.data);
                    //$rootScope.globalRegresar();
                },
                function (error) {
                    try {
                        toastr.error(error.data.message);
                        $uibModalInstance.dismiss('close');
                    } catch (e) { }
                }
            );
        };




        ////// adjunto principal
        $scope.deleteFile = function () {
            $scope.itf.adjuntoId = null;
            $scope.itf.adjunto = null;
            $scope.regFile = true;
            $(":file").filestyle('clear');
        }


        $scope.deleteCalidadFile = function () {
            $scope.itf.satisCte.adjunto = null;
            $scope.itf.satisCte.adjuntoId = null;
            $scope.filescalidad = true;
            $(":file").filestyle('clear');
        }



        $scope.getFileDetailsPrincipal = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }

            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '20', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        if (!result.error) {
                            transferCompletePrincipal(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }

                });
        };



        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetailsCalidad = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

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
                            transferCompleteCalidad(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filescalidad").filestyle('clear');
                        toastr.error(error);
                    }

                });
        };

        function transferCompleteCalidad(result) {

            // console.log("aqui");
            // console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {

                    $scope.itf.satisCte.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "MT"
                    }

                    itfsService.AddAdjuntoCalidad($scope.itf.satisCte).then(
                        function (result) {
                            if (result.data != null) {

                                $scope.itf.satisCte.adjuntoId = result.data.adjunto.adjuntoId;
                                $scope.itf.satisCte.adjunto.adjuntoId = result.data.adjunto.adjuntoId;

                            }

                        },
                        function (error) {
                            $scope.itf.satisCte.adjuntoId = null;
                        }
                    );
                }
            });

        }





        function transferCompletePrincipal(result) {


            $scope.$apply(function () {
                if (result.error === false) {
                    $scope.itf.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "MT"
                    }
                    itfsService.AddAdjuntoPrincipal($scope.itf).then(
                        function (result) {
                            if (result.data != null) { //return itf.AdjuntoId

                                $scope.itf.adjuntoId = result.data;
                                $scope.itf.adjunto.adjuntoId = itf.adjuntoId;
                            }
                            //alert(result.data);
                        },
                        function (error) {
                            $scope.itf.adjuntoId = null;
                        }
                    );
                }
            });
        }



        $scope.mostrarError = false;
        $scope.rangoanioIncorrecto = function (anioUser) {

            var anio = 1975;
            var anioMax = $scope.anioActual;
            var anioUsuariro = 0;
            try {
                anioUsuariro = parseInt(anioUser);
            } catch (e) {
                $scope.mostrarError = true;
                return true;
            }
            if (anioUsuariro >= anio && anioUsuariro <= anioMax) {
                $scope.mostrarError = false;
                return false;
            } else {
                $scope.mostrarError = true;
                return true;
            }
        }




        //end adjunto principal



        $scope.regresoAbsoluto = function () {
            $state.go("AddITF");
        }

    }

})();