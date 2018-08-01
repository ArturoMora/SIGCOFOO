(function () {
    "use strict";
    var app = angular.module("ineelMT");
    app.controller("informetfDetails", ["$scope", "$rootScope", "$location", "$state",
        "$stateParams", "itfsService", "$filter",
        "globalGet", "CalifResultadosFinancierosService",
        "CalificacionClienteService",
        "CalificacionPersonalService", "PersonalProyectoService",
        'uploadFileACH', "$window", "AuthService", "$uibModal", "$timeout", "DescargasService", "MenuService", 'comunService', 'AdminMT','ExportJsPDF',"IndicadoresMTService",
        informetfDetails]);

    function informetfDetails($scope,$rootScope, $location, $state, $stateParams, itfsService, $filter,
        globalGet, CalifResultadosFinancierosService, CalificacionClienteService,
        CalificacionPersonalService, PersonalProyectoService, uploadFileACH, $window, AuthService,
        $uibModal, $timeout, DescargasService, MenuService, comunService, AdminMT, ExportJsPDF, IndicadoresMTService) {

        $scope.authentication = AuthService.authentication;


        $scope.sefacturo = false;
        
        if ($rootScope.parametrosITFBUSQUEDAA1 == 'undefined' || $rootScope.parametrosITFBUSQUEDAA1 == null || $rootScope.parametrosITFBUSQUEDAA1 == undefined || $rootScope.parametrosITFBUSQUEDAA1 == "undefined") {

        } else {
            $rootScope.parametrosITFBUSQUEDAA1 = $rootScope.parametrosITFBUSQUEDAA1;

        }

        $scope.mostrarLeyendaLineamientos=false;

        var esAdmin = MenuService.getRolId() == AdminMT; // MenuService.getMenuMT()[0].idRol == AdminMT;

        $scope.idPublico = 1; //mapearlo con MT.cat_TipoAcceso

        var tipoInformacion = 21; //20: ITF

        var personaId = $scope.authentication.userprofile.clavePersona;

        toastr.clear();

        $scope.nombreUnidad = "";
        $scope.unidadPadre = "";
     
       
        $scope.msgDefault = "Informaci&oacute;n no registrada";
        $scope.idRol = MenuService.getRolId();
       
        $scope.msg = function () {
           
            return "/Descargas.html#/q";
        }

        $scope.itfToProyects = function () {   
            if($rootScope.origenITFPag == "undefined" || $rootScope.origenITFPag == null || $rootScope.origenITFPag == ""){
                $window.history.back();
            }else{
                $state.go( $rootScope.origenITFPag);
            }         
        }

        $scope.ITFPublico = false;

        $scope.path = $rootScope.nameState;

        if ($rootScope.detallesItf != undefined && $rootScope.detallesItf === true) {
            $scope.detalles = true
        } else {
            $scope.detalles = false;
        }

        $scope.autoresITF = [];
        $scope.proyecto = {};
        $scope.listEstadoITF = [{ id: 'null', name: "Seleccione..." },{ id: "3", name: "Rechazado" }, { id: "4", name: "Publicado" }];

        $scope.estadoITF = 'null';
        $scope.txtGuardar = "Siguiente";

        $scope.debug = false;
        $scope.click = false;

        //DATOS DE LECCIONES APRENDIDAS

        $scope.var1 = "";
        $scope.var2 = "";
        $scope.var3 = "";
        $scope.var4 = "";
        $scope.var5 = "";
        $scope.var6 = "";
        $scope.var7 = "";
        $scope.var8 = "";
        $scope.var9 = "";
        $scope.var10 = "";
        $scope.var11 = "";
        $scope.var12 = "";

        $scope.textoResumenFormateado = "";

        
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.tieneAdjuntos = false;

        if ($rootScope.isAdminMT != undefined && $rootScope.isAdminMT === true) {
            $scope.fromAdminMT = true;
        } else {
            $scope.fromAdminMT = false;
        }


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
            if ($rootScope.nameState.indexOf(".satisfCliente")>0) {
                $scope.activarTab(3);
            }
            if ($rootScope.nameState.indexOf(".resultados")>0) {
                $scope.activarTab(2);
            }
            if ($rootScope.nameState.indexOf(".proyFuturos")>0) {
                $scope.activarTab(2);
            }
            if ($rootScope.nameState.indexOf(".evaluaciones")>0) {
                $scope.activarTab(4); //  $scope.activarTab(6);
            }
            if ($rootScope.nameState.indexOf(".leccionesAprend")>0) {
                $scope.activarTab(5); //$scope.activarTab(7);
            }
            if ($rootScope.nameState.indexOf(".insumos")>0) {
                $scope.activarTab(6); //$scope.activarTab(8);
            }

        } catch (e) { }


        $scope.newTAB = function () {
            $scope.startTab();
            $scope.activarTab($scope.tab);
          
        }

        $scope.existeITF = false;
        ////toastr.success("$stateParams.id:" + $stateParams.id);

        $scope.adjuntosITFList = [];

        $scope.revision = function () {
            toastr.success("El Informe T&eacute;cnico Final fue enviado a revisi&oacute;n");
            $state.go("itfs");
        };

        $scope.ocultarGuardar = false;
        $scope.ocultarSolicitarAcceso = false;
        $scope.permisoAccesoVigente = false;
        $scope.esJefeHiperonimo = false;
        $scope.cliente = "NO DISPONIBLE";

        $scope.isJefeHiperonimo = function () {
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



            $scope.esJefeHiperonimo = esAdmin;

            if (($scope.itf.proyecto.numjefeProyecto != null && $scope.itf.proyecto.numjefeProyecto == personaId) || esAdmin) {
                $scope.esJefeHiperonimo = true;
                $scope.publico = true;

            } else {


                var Jerarquia = {
                    EmpleadoId: $scope.itf.proyecto.numjefeProyecto,
                    JefeHiperonimo: AuthService.authentication.userprofile.clavePersona
                };

                itfsService.isJefeHiperonimo(Jerarquia).then(
                function (result) {
                    $scope.esJefeHiperonimo = result.data;

                    if ($scope.esJefeHiperonimo == true) {
                        $scope.ITFPublico = true;
                    }


                    if ($scope.ITFPublico == false) {


                        comunService.existeSolicitudAcceso($scope.authentication.userprofile.clavePersona, $scope.itf.informeTecnicoFinalId, 8).then(
                            function (result) {
                                $scope.ocultarSolicitarAcceso = result.data;
                            },
                            function (error) {

                            }
                        );

                        comunService.Solicitud($scope.authentication.userprofile.clavePersona, $scope.itf.informeTecnicoFinalId, 10).then(
                          function (result) {

                              $scope.solicitudRegistro = result.data;  

                              if ($scope.solicitudRegistro != null) {

                                  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                                  var fechaHoy = new Date();


                                  console.log($scope.solicitudRegistro);

                                  var fechaRegistroSolicitud = new Date(result.data.fechaSolicitud);

                                  var utc1 = Date.UTC(fechaRegistroSolicitud.getFullYear(), fechaRegistroSolicitud.getMonth(), fechaRegistroSolicitud.getDate());
                                  var utc2 = Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate());

                                  var res = Math.floor((utc2 - utc1) / _MS_PER_DAY);

                                  var meses = res / 31;


                                  if (meses > 6) {
                                      $scope.permisoAccesoVigente = false;
                                      $scope.ITFPublico = false;

                                      comunService.borrarSolicitud(result.data.solicitudAccesoId);


                                      toastr.warning("El tiempo de acceso al documento ITF y anexos ha concluido, deber&aacute; solicitar nuevamente acceso a los mismos si as&iacute; lo requiere");
                                  } else {
                                      if (meses < 6) {
                                          $scope.permisoAccesoVigente = true;
                                          $scope.ITFPublico = true;
                                          $scope.verificaPermisoDescargaITF();
                                      }
                                  }

                              } 



                          },
                          function (error) { }
                        );
                    }
                },
                function (error) { }
                );
            }
        };

        $scope.logo = logoINEELrepot_;
        $scope.AutorizadorGerente = {};

        itfsService.GetGerenteAutorizadorByIDITF($stateParams.id).then(
            function (result) { $scope.AutorizadorGerente = result.data;},
            function (error) { }
        );


        itfsService.GetByID_Collections($stateParams.id).then(
            function (result) {
                
               
                $scope.existeITF = true;
                $scope.itf = result.data;
                
                if ($scope.itf.estadoITFFlujoId == 2 && $scope.idRol==2) {
                    $scope.fromAdminMT = true;
                }
                $scope.proyecto=$scope.itf.proyecto;
                $scope.ITFPublico = false;

                if ($scope.fromAdminMT == false) {
                   
                        //toastr.warning("Registrando consulta en Bitácora");
                        //var BitacoraITFConsulta ={
                        //    ClavePersona: AuthService.authentication.userprofile.clavePersona,
                        //    InformeTecnicoFinalId: $scope.itf.informeTecnicoFinalId
                        //};
                        //itfsService.BitacoraITFConsulta_Create(BitacoraITFConsulta).then(
                        //    function (result) {
                        //        console.log(result);
                        //    },
                        //    function (error) {
                        //        console.log(error);
                        //    }
                        //    );                                                                 
                    
                }


                if (($scope.itf.informeTecnicoFinalId.itFgeneralId != null && $scope.itf.informeTecnicoFinalId.itFgeneral != null)
                    && ($scope.itf.itFgeneral.accesoTipo == $scope.idPublico ||
                    $scope.fromAdminMT === true/* || 
                    $scope.itf.e*/
                    )
                ) {
                   
                    $scope.ITFPublico = true;
                  
                } else {
                    if ($scope.itf.proyecto.numjefeProyecto == AuthService.authentication.userprofile.clavePersona
                        || $scope.idRol == 2 || $scope.idRol == 4 || $scope.idRol==5) {
                       
                        $scope.ITFPublico = true;
                    }else{
                        $scope.ITFPublico = false;
                    }
                }
                
               
                $scope.isJefeHiperonimo();
                
                //$scope.path = $location.path();
                try{ 
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
                //
                if (result.data === null) {
                    ////////////////
                    $scope.existeITF = false;
                    //$scope.SetNewITF();
                } else {
                    $scope.startITF();
                }
               


            },
            function (err) {
                //////
                $scope.existeITF = false;
                //$scope.SetNewITF();
            });


        //
        $scope.startITF = function () {
            $scope.loading = true;
            $scope.editarEval = false;
            //
            if (($scope.itf.evaluaciones != null && $scope.itf.evaluaciones.length > 0)) {
                $scope.editarEval = true;
            }
            $scope.foo = $stateParams.foo | 1;
            $scope.agrega = false;
            $scope.formData = {};
            $scope.fileNameNew = "";
            $scope.fileNameChaged = function () {
              
            };
            $scope.siguienteIG = false;
            $scope.saveIG = function () {
                //////////////
                $scope.siguienteIG = true;
            };


            $scope.tasklist = [];
            $scope.tasklistInsumos = [];

            $scope.resultadosEconomicos = [];
            $scope.CalificacionCliente = [];
            $scope.CalificacionPersonal = [];
            $scope.PersonalProyecto = [];
            //$scope.itf = {};
            //////
            if (!$scope.itf.evaluaciones || $scope.itf.evaluaciones === null) {
                $scope.itf.evaluaciones = [];
            }
            if (!$scope.itf.insumos || $scope.itf.insumos === null) {
                $scope.itf.insumos = {};
            }
            $scope.selectTipo = [
          { id: true, name: 'Público' },
          { id: false, name: 'Privado' }
            ];



            //console.log("idp:" + $stateParams.id);
            //console.log("edit:" + $stateParams.edit);

            //$scope.proyectoId = $stateParams.id;
            $scope.edit = $stateParams.edit;

            //#region carga de catalogos
            CalifResultadosFinancierosService.getAll().then(
                function (result) {
                    $scope.resultadosEconomicos = result.data;
                },
                function (err) {
                    console.error(err);
                });
            CalificacionClienteService.getAll().then(
                function (result) {
                    $scope.CalificacionCliente = result.data;
                },
                function (err) {
                    console.error(err);
                });

            CalificacionPersonalService.getAll().then(
                function (result) {
                    $scope.CalificacionPersonal = result.data;
                },
                function (err) {
                    console.error(err);
                });
            itfsService.getAllAutores($scope.itf.informeTecnicoFinalId).then(
                function (result) {
                    $scope.autoresITF = result.data;
                },
                function (err) {
                    console.error(err);
                });
            //PersonalProyectoService.getProyPersonas($scope.proyectoId).then(
            //    function (result) {
            //        $scope.PersonalProyecto = result.data;
            //    },
            //    function (err) {
            //        console.error(err);
            //    });
            //#endregion carga de catalogos
            if ($scope.itf === null) {
                toastr.error("Error en la solicitud3");
                $location.path("/ListaItf")
            }
            //alert($scope.itf.proyecto.unidadOrganizacionalId);
             
           /***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/
            


             if( $scope.itf.proyecto.facturacionReal==null){
                 
                  $scope.mensajefactura = "NO DISPONIBLE";
             }else{
                    $scope.sefacturo = true;   
                    $scope.mensajefactura = $scope.itf.proyecto.facturacionReal;
             }

            comunService.UnidadOrganizacional.GetNameById($scope.itf.proyecto.unidadOrganizacionalId).then(
                function (result) {
                    $scope.nombreUnidad = result.data;
                },
                function (error) {
                }
            );



            comunService.UnidadOrganizacional.GetPadreById($scope.itf.proyecto.unidadOrganizacionalId).then(
                function (result) {
                    $scope.unidadPadre = result.data;
                },
                function (error) {
                }
            );



            $scope.loading = false;
        }



        $scope.datoscompletos = function (paso, next) {
            $scope.click = true;
            $scope.tab = paso + 1;
            $scope.newTAB();
            $state.go(next);
        }
        //$scope.PublicaRechazaAdminMT = function () {
        //    alert("falta guardar la clasificacionSignatura");
        //    //y dentro de function result, llamar a $scope.PublicaRechazaAdmin();
        //}
        $scope.PublicaRechazaAdminMT = function () {
            $scope.modalResult = {};
            $scope.datosDeModal = {
                msg1: "Publicar ITF",
                msg2: "Regresar solicitud",
                titulo: "Responder a solicitud de publicación de ITF"
            }
            $scope.result = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/MT/GenericoMT/SolicitudConJustificacionClasificacion.html',
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
                $scope.postModalPublicaRechazaAdminMT($scope.modalResult);
            });

        }
        //$scope.cambiaEstado = function () {
        $scope.postModalPublicaRechazaAdminMT = function (deModal) {
            var msg = "";
            
                var AprobacionRechazoData = {
                    IdElemento:$scope.itf.informeTecnicoFinalId,
                    ClavePersonaLogeada:$scope.authentication.userprofile.clavePersona,
                    Aprobacion:false,
                    Rechazo:false,
                    JustificacionOcomentarios: deModal.justificacion,
                    ClasificacionSignatura: deModal.clasificacionSignatura,
                    NumInforme: deModal.numInforme,
                    NumInventario: deModal.numInventario
                };
                if (deModal.ok1 == true) {
                    AprobacionRechazoData.Aprobacion = true;
                    msg = "publicado";
                } else if (deModal.ok2 == true) {
                    AprobacionRechazoData.Rechazo = true;
                    msg = "rechazado";
                }
                
                itfsService.PublicarITF(AprobacionRechazoData).then(
                    function (result) {
                      
                    toastr.success("ITF "+msg);
                    //= result.data;
                    var attrs={
                        estadoFlujoId:2,
                        tipoInformacionId: 21,
                        informacionId: $scope.itf.informeTecnicoFinalId
                    };
                   
                    itfsService.GetBySolicitudAttrs(attrs).then(
                        function (result) {
                          
                           
                            if (result.data != null) {

                                var registro = {
                                    "solicitudId": result.data.solicitudId,
                                    "estadoFlujoId": 3
                                }
                            
                            itfsService.updateSolicitud(registro).then( //actualiza el estadoFlujoId de la tabla solicitud
                                function (result) {
                                   
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,                                        
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado: " + AprobacionRechazoData.JustificacionOcomentarios,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 2
                                    }
                                    if (AprobacionRechazoData.Rechazo) {
                                        Bitacora.Descripcion = "Rechazado: " + AprobacionRechazoData.JustificacionOcomentarios;
                                            Bitacora.EstadoFlujoId = 2;
                                    }
                                    itfsService.AddBitacoraSolicitud(Bitacora).then(
                                        function (result) {  $state.go("SolicitudesITFsMT");},
                                        function (error) {  $state.go("SolicitudesITFsMT");}
                                    );
                                    //Mail.Estado = "Aprobada" //corre en back
                                    //itfsService.mailNotificacion(Mail).then(
                                    //    function (result) {
                                    //        Mail.TipoCorreo = "NotificacionGerenteviaAdmin"
                                    //        itfsService.mailNotificacion(Mail);
                                    //        //$state.go("solicitudesrh");
                                    //    });
                                },
                                function (error) {
                                   
                                    $state.go("SolicitudesITFsMT");
                                }
                            );
                            } else {
                                $state.go("SolicitudesITFsMT");
                            }
                            
                        },
                        function (error) {
                            $state.go("SolicitudesITFsMT");
                        }
                    );
                   
                },
                    function (err) {
                       
                    toastr.error("Error al publicar");
                    console.error(err);
                });
              
                //alert("registrar publicacion de MT");
            
        }

        $scope.verificaPermisoDescargaITF=function(){
            comunService.GetRegistroBitacora($scope.solicitudRegistro.solicitudAccesoId).then(
                function(res){
                    if(res.data.permisoDescarga=="PENDIENTE"){
                        $scope.mostrarLeyendaLineamientos=true;
                    }
                },function(err){
                    toastr.error("Error al obtener la solicitud del registro");
                    console.log(err);
                }
            );
        }

        $scope.AceptaResponsabilidadDescargaUsuario=function(){
            var registro={
                "iditf": $scope.itf.informeTecnicoFinalId,
                "idSolicitud": $scope.solicitudRegistro.solicitudAccesoId,
                "claveSolicitante" : $scope.authentication.userprofile.clavePersona,
                "permisoDescarga": "ACEPTADO",
            }
            comunService.UpdatePermisoDescarga(registro).then(
                function(res){  
                    toastr.success("Permiso para descargar el archivo concedido");
                    $state.reload();
                },function(err){
                    toastr.error("Sucedió un error en los permisos de descarga del archivo");
                    console.log(err);
                }
            );
        }
        

        //Registra una copia de la solicitud para descargar el itf
        $scope.RegistraPermisoDescargaITF=function(obj){
            var registro={
                "iditf":$scope.itf.informeTecnicoFinalId,
                "idsolicitud": obj.solicitudAccesoId,
                "permisoDescarga": "PENDIENTE",
                "claveSolicitante": $scope.authentication.userprofile.clavePersona,
                "fechaRegistro": new Date()
            };
            comunService.CreateRegistroBitacoraSolicitudes(registro).then(
                function(res){

                },function(err){
                    console.log(err);
                }
            );
        }

        $scope.GuardarBitacoraAcceso = function (idNewSolicitudAcceso, justificacion, Tipo, Texto, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            var bitacora = {
                "solicitudAccesoId": idNewSolicitudAcceso,
                "fechaMovimiento": new Date(),
                "clavePersona": personaId,
                "descripcion": "Se envió la solicitud",
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": $scope.itf.proyecto.unidadOrganizacionalId,
                "justificacion":justificacion
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) {
                    $scope.ocultarSolicitarAcceso = true;
                    $scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                },
                function (error) { }
            );
        }
        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.authentication.userprofile.nombreCompleto,
                "Seccion": "MT / ITF",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": $scope.itf.proyecto.unidadOrganizacionalId,
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            comunService.mailNotificacion(Mail);
        }
        $scope.GuardarSolicitudAcceso = function (justificacion, Tipo, Texto, estado) {
            var solicitud = {
                "clavePersonaSolicitante": personaId,
                "tipoInformacionId": tipoInformacion,
                "informacionOCId": $scope.itf.informeTecnicoFinalId,
                "fechaSolicitud": new Date(),
                "unidadAutorizadoraId": $scope.itf.proyecto.unidadOrganizacionalId,
                "estadoFlujoId": estado,
                "moduloId": "MT"
            };
            //TODO:AQUI me quede
            comunService.solicitarAcceso(solicitud).then(
                function (result) {
                    toastr.success("Solicitud enviada");
                    $scope.GuardarBitacoraAcceso(result.data.solicitudAccesoId, justificacion, Tipo, Texto, estado);
                    $scope.RegistraPermisoDescargaITF(result.data);
                    //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);

                    $scope.solicitudExistente = true;

                },
                function (err) {
                    toastr.error("Problema al enviar la solicitud");
                    console.error(err);
                });
        }

        $scope.solicitarAcceso = function () {
            var dProyecto = $scope.itf.proyecto.proyectoId.concat(" - ").concat($scope.itf.proyecto.nombre)
            $scope.message = "Acceso al OC ITF con el t&iacute;tulo <b>" + $scope.itf.titulo + "</b> del proyecto " + dProyecto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/SolicitarAccesoGenerico.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function (justificacion) {
                        $scope.var = modalInstance.result;
                        //Enviar Correo     
                        var Tipo = "accesoGEN";
                        var estado = 8;// 8,9,10
                        //var Texto = "solicita descargar los archivos adjuntos de cursos relacionadas al proyecto <b> ";
                        //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                        $uibModalInstance.dismiss('cancel');
                        var Texto = $scope.message + "<br/>";

                        $scope.GuardarSolicitudAcceso(justificacion, Tipo, Texto, estado);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
       
        $scope.jsPDF_ExportPDF = function (divID, file, alto) {
            //$scope.itf.divCaratula = true;
           
            //toastr.info("Generando car&aacute;tula de ITF");
            //$timeout(function () {
                              
            //    ExportJsPDF.toPDF(divID, file + $scope.itf.informeTecnicoFinalId, alto).then(function (response) {
            //        $scope.itf.divCaratula = false;
            //        toastr.clear();
            //    },
            //        function (error) { }
            //    );                   
            //}, 1000);
            
        }
        $scope.jsPDF_ExportPDFficha = function (divID, file, alto) {
          
            toastr.info("Generando ficha ITF");

            var doc = new jsPDF('p', 'pt', 'letter');

            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 50, 40, 150, 31);
            doc.addImage(imageHeader, 'JPGE', 40, 20, 150, 77);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Ficha blibliográfica resumida', 230, 60);


            //RESULTADOS ECONÓMICOS 
            var columns = ["Información general"];
            var data = [[""]];

            doc.autoTable(columns, data, {
                theme: 'grid',
                startY: 90,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 16, fontSize: 12,
                    textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
                },
                bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 500 }
                }
            });         

            var proyId = "";
            if ($scope.proyecto == null) {
                proyId = "";
            } else {
                proyId = $scope.proyecto.proyectoId;
            }

            var proyNom = "";
            if ($scope.proyecto == null) {
                proyNom = "";
            } else {
                proyNom = $scope.proyecto.nombre;
            }

            var columns = ["",""];
            var data = [["Título : ", proyId + " " + proyNom]];

             doc.autoTable(columns,data, {
                theme: 'plain',
                startY: doc.autoTableEndPosY() + 10,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 0, fontSize: 10,
                    textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                },
                bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 100 },
                    1: { columnWidth: 400 }
                }
            });


             var resumen  = "";
             var resumen1 = "";
             var resumen2 = "";
             var resumen3 = "";
             if ($scope.itf  != null) {
                 resumen = $scope.itf.itFgeneral.resumen;

                 console.log(resumen.length);
                
                 if ( resumen.length <= 1000) {
                     resumen1 = resumen;
                 }


                 if (resumen.length <= 2000) {
                     resumen1 = resumen;
                 }

                 if (resumen.length >= 2000) {


                     if (resumen.length < 2500) {
                         resumen1 = resumen;
                     } else {
                         resumen1 = resumen.substring(0, 2035);
                     }
                     
                 }


                 if (resumen.length >= 3000) {

                     if (resumen.length < 4500) {
                         resumen2 = resumen.substring(2036, resumen.length);
                     } else {
                         resumen2 = resumen.substring(2036, 4000);
                     }
                    
                 }



                 if (resumen.length >= 4000) {
                     resumen3 = resumen.substring(4001, resumen.length);
                 }


             } else {
                 resumen = "";
             }


             if (resumen1.length > 0) {

                 var columns = ["", ""];
                 var data = [["Resumen : ", resumen1]];

                 doc.autoTable(columns, data, {
                     theme: 'plain',
                     startY: doc.autoTableEndPosY() + 10,
                     styles: { cellPadding: 2, overflow: 'linebreak' },
                     headerStyles: {
                         rowHeight: 0, fontSize: 10,
                         textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                     },
                     bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                     margin: { left: 40 },
                     columnStyles: {
                         0: { columnWidth: 100 },
                         1: { columnWidth: 400 }
                     }
                 });

             }

             if (resumen2.length > 0) {

                 var columns = ["", ""];
                 var data = [[" ", resumen2]];

                 doc.autoTable(columns, data, {
                     theme: 'plain',
                     startY: doc.autoTableEndPosY() + 10,
                     styles: { cellPadding: 2, overflow: 'linebreak' },
                     headerStyles: {
                         rowHeight: 0, fontSize: 10,
                         textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                     },
                     bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                     margin: { left: 40 },
                     columnStyles: {
                         0: { columnWidth: 100 },
                         1: { columnWidth: 400 }
                     }
                 });

             }


             if (resumen3.length > 0) {

                 var columns = ["", ""];
                 var data = [[" ", resumen3]];

                 doc.autoTable(columns, data, {
                     theme: 'plain',
                     startY: doc.autoTableEndPosY() + 10,
                     styles: { cellPadding: 2, overflow: 'linebreak' },
                     headerStyles: {
                         rowHeight: 0, fontSize: 10,
                         textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                     },
                     bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                     margin: { left: 40 },
                     columnStyles: {
                         0: { columnWidth: 100 },
                         1: { columnWidth: 400 }
                     }
                 });

             }

            var nomun = "";
            if ($scope.nombreUnidad == null) {
                nomun = "";
            } else {
                nomun = $scope.nombreUnidad;
            }

            var unidad = "";
            if ($scope.unidadPadre == null) {
                unidad = "";
            } else {
                unidad = $scope.unidadPadre.claveUnidadPadre.nombreUnidad;
            }

            var noInf = "";
            if ($scope.itf == null) {
                noInf = "";
            } else {
                noInf = $scope.itf.numInforme;
            }

            var clasif = "";
            if ($scope.itf == null) {
                clasif = "";
            } else {
                clasif = $scope.itf.clasificacionSignatura;
            }

            var anio = "";
            if ($scope.itf == null) {
                anio = "";
            } else {
                anio = $scope.itf.anioElaboracion;
            }

            var columns = ["", ""];
            var data = [
                ["Número de informe : ", noInf],
                ["Clave única de identificación : ", clasif],
                ["Año de elaboración : ", anio],
                ["División : ", unidad],
                ["Gerencia : ", nomun],
            ];

            //var res = doc.autoTableHtmlToJson(document.getElementById("tablaPadre"));
            doc.autoTable(columns, data, {
                theme: 'plain',
                startY: doc.autoTableEndPosY() + 10,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 0, fontSize: 10,
                    textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                },
                bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 100 },
                    1: { columnWidth: 400 }
                }
            });

            var cadenaAutores = "";
            if ($scope.autoresITF != null) {
                for (var obj in $scope.autoresITF) {
                    cadenaAutores = cadenaAutores + " " + $scope.autoresITF[obj].nombreCompleto + ", ";
                }
                cadenaAutores = cadenaAutores.substring(0, cadenaAutores.length - 2);
            } else {
                cadenaAutores = "";
            }
                   
            var columns = ["Autores"];
            var data = [[""]];

            doc.autoTable(columns, data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 20,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 16, fontSize: 12,
                    textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
                },
                bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 500 }
                }
            });
                       
            var columns = ["", ""];
            var data = [ ["Autores : ", cadenaAutores] ];
            doc.autoTable(columns, data, {
                theme: 'plain',
                startY: doc.autoTableEndPosY() + 10,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 0, fontSize: 10,
                    textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                },
                bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 100 },
                    1: { columnWidth: 400 }
                }
            });

            var columns = ["Seguridad"];
            var data = [ [""] ];
            doc.autoTable(columns, data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 20,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 16, fontSize: 12,
                    textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
                },
                bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 500 }
                }
            });






            var acceso = "";
            if ($scope.itf.itFgeneral == null) {
                acceso = "";
            } else {
                acceso = $scope.itf.itFgeneral.tipoAcceso.nombre;
            }


            var columns = ["", ""];
            var data = [
                ["Tipo de acceso : ", acceso],

            ];

            //var res = doc.autoTableHtmlToJson(document.getElementById("tablaPadre"));
            doc.autoTable(columns, data, {
                theme: 'plain',
                startY: doc.autoTableEndPosY() + 10,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 0, fontSize: 10,
                    textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
                },
                bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 40 },
                columnStyles: {
                    0: { columnWidth: 100 },
                    1: { columnWidth: 400 }
                }
            });

            

            toastr.clear();

            doc.save('fichaITF.pdf');

            $scope.itf.divCaratula = false;

        }

        $scope.exportGrafica = function () {

           // $scope.itf.divCaratula = true;


            toastr.info("Generando car&aacute;tula de ITF");

            var doc = new jsPDF('p', 'pt', 'letter');


            var listaInsumos = [];
            var listaEvaluacionPersonal = [];
            var listaEvaluacionJefe = [];

            for (var obj in $scope.itf.listaInsumos) {
                var item = [];
                item.push($scope.itf.listaInsumos[obj].nombreIns);
                item.push($scope.itf.listaInsumos[obj].descripcionIns);
                item.push($scope.itf.listaInsumos[obj].responsableIns);
                item.push($scope.itf.listaInsumos[obj].tipoAcceso.nombre);
                listaInsumos.push(item);
            }


            var cadenaAutores = "";

            if ($scope.autoresITF != null) {
                for (var obj in $scope.autoresITF) {
                    
                    cadenaAutores = cadenaAutores + " " + $scope.autoresITF[obj].nombreCompleto + ", ";
                }
                cadenaAutores = cadenaAutores.substring(0, cadenaAutores.length - 2);
            }
            
           



            for (var obj in $scope.itf.evaluaciones) {
                var item = [];

                var cad = "";
                if ($scope.itf.evaluaciones[obj].califPer == "3")
                    cad = "Excedió";

                if ($scope.itf.evaluaciones[obj].califPer == "2")
                    cad = "Cumplió";

                if ($scope.itf.evaluaciones[obj].califPer == "1")
                    cad = "Deficiente";


                if ($scope.itf.evaluaciones[obj].personalProyecto.clavePersona != $scope.proyecto.numjefeProyecto) {
                    item.push($scope.itf.evaluaciones[obj].personalProyecto.persona.nombreCompleto);
                    item.push("");
                    item.push(cad);
                    listaEvaluacionPersonal.push(item);
                } else {
                    if ($scope.itf.evaluaciones[obj].personalProyecto.clavePersona == $scope.proyecto.numjefeProyecto) {
                        item.push($scope.itf.evaluaciones[obj].personalProyecto.persona.nombreCompleto);
                        item.push("");
                        item.push(cad);
                        listaEvaluacionJefe.push(item);
                    }
                }

               
            }


            var fechaHoy = new Date();

            var dd = fechaHoy.getDate();
            var mm = fechaHoy.getMonth() + 1; //January is 0!
            var yyyy = fechaHoy.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            } 

            var fechaImprime =  dd + "/" + mm + "/" + yyyy;

            
            //var today3 = $filter('date')(new Date(fechaHoy.now), 'dd/MM/yyyy');

           var today1 = $filter('date')(new Date($scope.proyecto.fechaInicio), 'dd/MM/yyyy');
           var today2 = $filter('date')(new Date($scope.proyecto.fechaFin), 'dd/MM/yyyy');
           

         
            var imageHeader = "data:image/jpeg;base64,/9j/4QzqRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAcAAAAcgEyAAIAAAAUAAAAjodpAAQAAAABAAAApAAAANAAD0JAAAAnEAAPQkAAACcQQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzADIwMTc6MTA6MDQgMTQ6MzM6MTYAAAAAA6ABAAMAAAAB//8AAKACAAQAAAABAAAFjqADAAQAAAABAAABVgAAAAAAAAAGAQMAAwAAAAEABgAAARoABQAAAAEAAAEeARsABQAAAAEAAAEmASgAAwAAAAEAAgAAAgEABAAAAAEAAAEuAgIABAAAAAEAAAu0AAAAAAAAAEgAAAABAAAASAAAAAH/2P/tAAxBZG9iZV9DTQAB/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAJgCgAwEiAAIRAQMRAf/dAAQACv/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A9AsFFeHl9QyXXubjm+x4rutb7Ki/211strr/AJti5931z6KzplXVn4PVm4F9hqqyDbo54n27ft/qfmPbv2emuitax/R89tlYtY77UHVOf6QcCbd1bsj/AAG//Tf4JcdU/wCsFtVZw8HDyel3+l0uro/qjOxsb09l2P1HLto9Rtu15t9f+at2fZv5z9GrXL44TiTIXRG8uD0/uj+sxzkQaB6dres6Lb07rXTKep4pymU5G7Y22+0PGxzqXbgzIsb9Kv8AfV79m4/79/8A7EX/APpZYvTeoGnpmFVi39PrD/tGmJRY3HcKbLPVOI1hd6ezY/1N2/1rf5pHHWLWBr7Mul1YeGvc2i3WYO38/Zt/6f8AN/ovTUGSNTkAKAkaB7WxnmscTRO1WbgBtxfpSdP9m4/79/8A7EX/APpZL9m4/wC/f/7EX/8ApZZbes5DrnUHLxjYNxa1tV0kND3ulvu/0e72f8X+fXYtTCOeQ45hqcCAazUHt/rb227k0il2PmIZDUbPQ/LLh/vcMlfs3H/fv/8AYi//ANLJfs3H/fv/APYi/wD9LK0kgzNX9m4/79//ALEX/wDpZL9m4/79/wD7EX/+llaSSU1f2bj/AL9//sRf/wClkv2bj/v3/wDsRf8A+llaSSU52dgVV4WQ+uy9r21PLHevcYIadpj1VlP6viM3j7NkvLXPa0s6hTDtjnM9vqdSrd+Y/wBTez9FYx7FudTMdNyz4U2f9S5YHV6fRzraza23dV6ry84Vbqmuea6rmtyMN7rPQ2txq32O2el/OMsv/SWpS+R1Gu0OpwGZPrl1fpvbm02EsI32vrot6lts9Kxv2W71PT/nvUx/VQsJ3U8q0U15WTvDXOdufjv9rfouLcXqdj/030Wv2el/xKhVXkZV5qxRFoa02V02dPs2ssArdk7TiOs2Wurss2/o/Wsfai09N61hW2fZqbmbpLrcd3T2bydzt0HArfvd7PU9T/Cf6T+ctSk/2LrZLKm25bTI3ZDthb79p91X25trfs3v37P5z/rau1dG6g3IY+3qVluOJ30xY0u0/wBMzI3M937rVWvH1kNpbW3KDW7mCxluGAQT+itc27Gtdv8A3v8AqLEwP1lDdvp5Rgkh5uwgTBrdt9uLt2u9N7Gf8fd6n+A9JKdf9m4/79//ALEX/wDpZDfjMx8nFdU+332OY4Ptse0j0rn/AELbHt+kxqjXmdXcTv6cKx6W8E3sP6Ta13oHa39/1KvW/wDSn6Odj7Xnp77q/StdZNlU7trjRfvr3j6ex356Sn//0PRmYteZ07Lw7SRXkuyanlsBwa91lbtu4O93uWH07/F7hdKqyKundTzsdmZX6WQGuo9zQC32zi/o7Pe7bbX+kXQ4RLaLSAXEXXENESf0j9Bu2tWT/wA5OpGmt1fSLrLrGElg9RrW2F4ZVjusyMah270m32XW+n9npfXVV6v6x6qlxzyiJjA+kkcQ04fD5lkuC7lu2On/AFbp6b07G6diZeTXRiB4aQ5ku3vNzvUioN9rn+za1WWdLtY5h+35Tgwg7XOYQ6Oz/wBH7tyot6/1S1rzT0p5czYRvc9jXg1WW2+k77Nu31ZVLsTZZXXv30X/AOGTv+stwqtfX03Ite1zTRUGWB1lJc7fke+lvp7Ka7LPQf8ApHv9Kn/D1ISjkJJOpJs7byWGOIm9ftmNm4elWElxz8oEiBD2gDx2t9P/AKpXamGutjC4vLWhpe76RgRudH5zli5n1hzsfNfjV9NsuqbbXWLx6m0Ne1rza+Mdzfz9jPRsv/m7PtH2b9Gyx7+vdTZlWY1PSLrIs9Oq4ktrcN7anvc/0v0W1j23/wCjtr9T9L+iQ4Jaba+ITH24k1d7H5pO4kuff9Y+qh5bX0e14BeHOLntDdv82x27H91rn+1/2f7Rjf6HJyP03oE6f1/qOblfZ39LtxA6t9lb8gvbJaS1jH/oNle6Nzvel7cqvT7Qu9yN1Z+wu4kuep+sfVHWRd0x9QnHEfpnBvrM9e17nsxd7vTc5mLsbj/0n+fsq/wc6vrH1F/pB/SL6S9zG2b95Ddwa52x1VFm/wCn+ie/0qP+5d+Gl7cu34hXuR7/AIF3klhU9f6nbjMub0qwPdY9j2EvbtYyv1/V/SUMe79J+qen6f8ASP5n160M/WfqDay53RskPaX72w8jaGb8d7XMpd6n2i11VO1rPVo/TetX+gS9uXb8Qr3I9/wLsdS/5Oyv+Js8/wA1y5rM6mxmRk1P6k2gPF1bC7qFNbWv9X/B/qz76rK693+k+zv/AFT/AIVdDnWsu6Pk21zsfj2ObILTBY7ljw17f7StWMqexzLGtcx4Ie1wBBBEEOB+l7Uxe8c7qgId6uazHdtL6j+06mgA1Vensb9nbRZXc9tX5uQyl+TY+v6fpqP7S9G9os6mC6sNdbVb1Slh3Mh2RU+s4rHbKvd7/Z61X/BrtJYe4PYJEs7kJKePruuIc12e8mm2puQG9Srd6bLD6TrnbcVtm5n6D06LNn2h9ymzMve185Xtuxn11WDqTSHP9IObYz08X9FY/wBTGs+0/wCB9X1vR/03WzWe4P3JgKpJAbJ54k9v++JKcvAw+ofaqLco31tprdDftPqsc4xT6d9Qpq9X9HUzKZd/3IvyK/5v0ley/wCfw/8Ajj/55vVgFvYhV8r+fwv+OP8A55vSU//R9Gxn5LG2NrqbY31rSHh8cvcfouZ+b9FG9bN/7jD/ALcH/kV8vJJKfqH1s3/uMP8Atwf+RS9bN/7jD/twf+RXy8kkp+ofWzf+4w/7cH/kUvWzf+4w/wC3B/5FfLySSn6h9bN/7jD/ALcH/kUvWzf+4w/7cH/kV8vJJKfqH1s3/uMP+3B/5FL1s3/uMP8Atwf+RXy8kkp+ofWzf+4w/wC3B/5FL1s3/uMP+3B/5FfLySSn6Z6hZlu6fktdQ1jTTYC42aD2u9x2sc7/AKK5XqL6f2leW1Ul/qPMF/UR7t7fWY/7K2zF3b/R/SV/n/4L/CLxBJJT7c97PUv3VYs+g/cMmzqAZ9kO37LvN9Rq+3t93qbP1r/QoYfR9jyAKmx+gk7+qfR3M27Bs9f1PU+yel9m/wAD/P8A6FeKpJKfbcp/tf8AaKsfd6lhOx/Uojfb9taPSr+h639Fez9Bs9X0a/TUHPp9KrfVUWj149/VNxf+i9An9H6rK/U9P1PU3/o/S+yrxVJJT7M57Np9SqmIPFnVf5vcPUn9H9L9/wD9I+9dB0A3GukPa1rBlOLXB2UQf1dwaypvUmer9H3/AKL9V/6+vnlJJT//2f/tFBpQaG90b3Nob3AgMy4wADhCSU0EJQAAAAAAEAAAAAAAAAAAAAAAAAAAAAA4QklNBDoAAAAAAJMAAAAQAAAAAQAAAAAAC3ByaW50T3V0cHV0AAAABQAAAABDbHJTZW51bQAAAABDbHJTAAAAAFJHQkMAAAAASW50ZWVudW0AAAAASW50ZQAAAABJbWcgAAAAAE1wQmxib29sAQAAAA9wcmludFNpeHRlZW5CaXRib29sAAAAAAtwcmludGVyTmFtZVRFWFQAAAABAAAAOEJJTQQ7AAAAAAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBZAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAAZAAAAAEAAgBkAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA00AAAAGAAAAAAAAAAAAAAFWAAAFjgAAAAwAUwBpAG4AIAB0AO0AdAB1AGwAbwAtADEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAABY4AAAFWAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAFWAAAAAFJnaHRsb25nAAAFjgAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAABVgAAAABSZ2h0bG9uZwAABY4AAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAAAApsZWZ0T3V0c2V0bG9uZwAAAAAAAAAMYm90dG9tT3V0c2V0bG9uZwAAAAAAAAALcmlnaHRPdXRzZXRsb25nAAAAAAA4QklNBCgAAAAAAAwAAAACP/AAAAAAAAA4QklNBBQAAAAAAAQAAAACOEJJTQQMAAAAAAvQAAAAAQAAAKAAAAAmAAAB4AAAR0AAAAu0ABgAAf/Y/+0ADEFkb2JlX0NNAAH/7gAOQWRvYmUAZIAAAAAB/9sAhAAMCAgICQgMCQkMEQsKCxEVDwwMDxUYExMVExMYEQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQ0LCw0ODRAODhAUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAmAKADASIAAhEBAxEB/90ABAAK/8QBPwAAAQUBAQEBAQEAAAAAAAAAAwABAgQFBgcICQoLAQABBQEBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgsQAAEEAQMCBAIFBwYIBQMMMwEAAhEDBCESMQVBUWETInGBMgYUkaGxQiMkFVLBYjM0coLRQwclklPw4fFjczUWorKDJkSTVGRFwqN0NhfSVeJl8rOEw9N14/NGJ5SkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2N0dXZ3eHl6e3x9fn9xEAAgIBAgQEAwQFBgcHBgU1AQACEQMhMRIEQVFhcSITBTKBkRShsUIjwVLR8DMkYuFygpJDUxVjczTxJQYWorKDByY1wtJEk1SjF2RFVTZ0ZeLys4TD03Xj80aUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9ic3R1dnd4eXp7fH/9oADAMBAAIRAxEAPwD0CwUV4eX1DJde5uOb7Hiu61vsqL/bXWy2uv8Am2Ln3fXPorOmVdWfg9WbgX2GqrINujnifbt+3+p+Y9u/Z6a6K1rH9Hz22Vi1jvtQdU5/pBwJt3VuyP8AAb/9N/glx1T/AKwW1VnDwcPJ6Xf6XS6uj+qM7GxvT2XY/Ucu2j1G27Xm31/5q3Z9m/nP0atcvjhOJMhdEby4PT+6P6zHORBoHp2t6zotvTutdMp6ninKZTkbtjbb7Q8bHOpduDMixv0q/wB9Xv2bj/v3/wDsRf8A+lli9N6gaemYVWLf0+sP+0aYlFjcdwpss9U4jWF3p7Nj/U3b/Wt/mkcdYtYGvsy6XVh4a9zaLdZg7fz9m3/p/wA3+i9NQZI1OQAoCRoHtbGeaxxNE7VZuAG3F+lJ0/2bj/v3/wDsRf8A+lkv2bj/AL9//sRf/wClllt6zkOudQcvGNg3FrW1XSQ0Pe6W+7/R7vZ/xf59di1MI55DjmGpwIBrNQe3+tvbbuTSKXY+YhkNRs9D8suH+9wyV+zcf9+//wBiL/8A0sl+zcf9+/8A9iL/AP0srSSDM1f2bj/v3/8AsRf/AOlkv2bj/v3/APsRf/6WVpJJTV/ZuP8Av3/+xF//AKWS/ZuP+/f/AOxF/wD6WVpJJTnZ2BVXhZD67L2vbU8sd69xghp2mPVWU/q+IzePs2S8tc9rSzqFMO2Ocz2+p1Kt35j/AFN7P0VjHsW51Mx03LPhTZ/1LlgdXp9HOtrNrbd1XqvLzhVuqa55rqua3Iw3us9Da3GrfY7Z6X84yy/9JalL5HUa7Q6nAZk+uXV+m9ubTYSwjfa+ui3qW2z0rG/ZbvU9P+e9TH9VCwndTyrRTXlZO8Nc525+O/2t+i4txep2P/TfRa/Z6X/EqFVeRlXmrFEWhrTZXTZ0+zaywCt2TtOI6zZa6uyzb+j9ax9qLT03rWFbZ9mpuZukutx3dPZvJ3O3QcCt+93s9T1P8J/pP5y1KT/YutksqbbltMjdkO2Fvv2n3Vfbm2t+ze/fs/nP+tq7V0bqDchj7epWW44nfTFjS7T/AEzMjcz3futVa8fWQ2ltbcoNbuYLGW4YBBP6K1zbsa12/wDe/wCosTA/WUN2+nlGCSHm7CBMGt2324u3a703sZ/x93qf4D0kp1/2bj/v3/8AsRf/AOlkN+MzHycV1T7ffY5jg+2x7SPSuf8AQtse36TGqNeZ1dxO/pwrHpbwTew/pNrXegdrf3/Uq9b/ANKfo52Pteenvur9K11k2VTu2uNF++vePp7HfnpKf//Q9GZi15nTsvDtJFeS7JqeWwHBr3WVu27g73e5YfTv8XuF0qrIq6d1POx2ZlfpZAa6j3NALfbOL+js97tttf6RdDhEtotIBcRdcQ0RJ/SP0G7a1ZP/ADk6kaa3V9IususYSWD1GtbYXhlWO6zIxqHbvSbfZdb6f2el9dVXq/rHqqXHPKImMD6SRxDTh8PmWS4LuW7Y6f8AVunpvTsbp2Jl5NdGIHhpDmS7e83O9SKg32uf7NrVZZ0u1jmH7flODCDtc5hDo7P/AEfu3Ki3r/VLWvNPSnlzNhG9z2NeDVZbb6Tvs27fVlUuxNllde/fRf8A4ZO/6y3Cq19fTci17XNNFQZYHWUlzt+R76W+nsprss9B/wCke/0qf8PUhKOQkk6kmztvJYY4ib1+2Y2bh6VYSXHPygSIEPaAPHa30/8AqldqYa62MLi8taGl7vpGBG50fnOWLmfWHOx81+NX02y6pttdYvHqbQ17WvNr4x3N/P2M9Gy/+bs+0fZv0bLHv691NmVZjU9Iusiz06riS2tw3tqe9z/S/RbWPbf/AKO2v1P0v6JDglptr4hMfbiTV3sfmk7iS59/1j6qHltfR7XgF4c4ue0N2/zbHbsf3Wuf7X/Z/tGN/ocnI/TegTp/X+o5uV9nf0u3EDq32VvyC9slpLWMf+g2V7o3O96Xtyq9PtC73I3Vn7C7iS56n6x9UdZF3TH1CccR+mcG+sz17XuezF3u9NzmYuxuP/Sf5+yr/Bzq+sfUX+kH9IvpL3MbZv3kN3BrnbHVUWb/AKf6J7/So/7l34aXty7fiFe5Hv8AgXeSWFT1/qduMy5vSrA91j2PYS9u1jK/X9X9JQx7v0n6p6fp/wBI/mfXrQz9Z+oNrLndGyQ9pfvbDyNoZvx3tcyl3qfaLXVU7Ws9Wj9N61f6BL25dvxCvcj3/Aux1L/k7K/4mzz/ADXLmszqbGZGTU/qTaA8XVsLuoU1ta/1f8H+rPvqsrr3f6T7O/8AVP8AhV0Oday7o+TbXOx+PY5sgtMFjuWPDXt/tK1Yyp7HMsa1zHgh7XAEEEQQ4H6XtTF7xzuqAh3q5rMd20vqP7TqaADVV6exv2dtFldz21fm5DKX5Nj6/p+mo/tL0b2izqYLqw11tVvVKWHcyHZFT6zisdsq93v9nrVf8Gu0lh7g9gkSzuQkp4+u64hzXZ7yabam5Ab1Kt3pssPpOudtxW2bmfoPTos2faH3KbMy97Xzle27GfXVYOpNIc/0g5tjPTxf0Vj/AFMaz7T/AIH1fW9H/TdbNZ7g/cmAqkkBsnniT2/74kpy8DD6h9qotyjfW2mt0N+0+qxzjFPp31Cmr1f0dTMpl3/ci/Ir/m/SV7L/AJ/D/wCOP/nm9WAW9iFXyv5/C/44/wDnm9JT/9H0bGfksbY2uptjfWtIeHxy9x+i5n5v0Ub1s3/uMP8Atwf+RXy8kkp+ofWzf+4w/wC3B/5FL1s3/uMP+3B/5FfLySSn6h9bN/7jD/twf+RS9bN/7jD/ALcH/kV8vJJKfqH1s3/uMP8Atwf+RS9bN/7jD/twf+RXy8kkp+ofWzf+4w/7cH/kUvWzf+4w/wC3B/5FfLySSn6h9bN/7jD/ALcH/kUvWzf+4w/7cH/kV8vJJKfpnqFmW7p+S11DWNNNgLjZoPa73Haxzv8Aorleovp/aV5bVSX+o8wX9RHu3t9Zj/srbMXdv9H9JX+f/gv8IvEEklPtz3s9S/dViz6D9wybOoBn2Q7fsu831Gr7e33eps/Wv9Chh9H2PIAqbH6CTv6p9HczbsGz1/U9T7J6X2b/AAP8/wDoV4qkkp9tyn+1/wBoqx93qWE7H9SiN9v21o9Kv6Hrf0V7P0Gz1fRr9NQc+n0qt9VRaPXj39U3F/6L0Cf0fqsr9T0/U9Tf+j9L7KvFUklPszns2n1KqYg8WdV/m9w9Sf0f0v3/AP0j710HQDca6Q9rWsGU4tcHZRB/V3BrKm9SZ6v0ff8Aov1X/r6+eUklP//ZOEJJTQQhAAAAAABVAAAAAQEAAAAPAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwAAAAEwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAUwA1AAAAAQA4QklNBAYAAAAAAAcAAQEBAAEBAP/hDc9odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMC0wNFQxNDozMzoxNi0wNTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0xMC0wNFQxNDozMzoxNi0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTAtMDRUMTQ6MzM6MTYtMDU6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUU0RDI5OUQzOEE5RTcxMThGQzhGNUZEQTk3NEM0QzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUQ0RDI5OUQzOEE5RTcxMThGQzhGNUZEQTk3NEM0QzgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxRDREMjk5RDM4QTlFNzExOEZDOEY1RkRBOTc0QzRDOCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iQWRvYmUgUkdCICgxOTk4KSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MUQ0RDI5OUQzOEE5RTcxMThGQzhGNUZEQTk3NEM0QzgiIHN0RXZ0OndoZW49IjIwMTctMTAtMDRUMTQ6MzM6MTYtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MUU0RDI5OUQzOEE5RTcxMThGQzhGNUZEQTk3NEM0QzgiIHN0RXZ0OndoZW49IjIwMTctMTAtMDRUMTQ6MzM6MTYtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iAkBJQ0NfUFJPRklMRQABAQAAAjBBREJFAhAAAG1udHJSR0IgWFlaIAfPAAYAAwAAAAAAAGFjc3BBUFBMAAAAAG5vbmUAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtQURCRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmNwcnQAAAD8AAAAMmRlc2MAAAEwAAAAa3d0cHQAAAGcAAAAFGJrcHQAAAGwAAAAFHJUUkMAAAHEAAAADmdUUkMAAAHUAAAADmJUUkMAAAHkAAAADnJYWVoAAAH0AAAAFGdYWVoAAAIIAAAAFGJYWVoAAAIcAAAAFHRleHQAAAAAQ29weXJpZ2h0IDE5OTkgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQAAABkZXNjAAAAAAAAABFBZG9iZSBSR0IgKDE5OTgpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAA81EAAQAAAAEWzFhZWiAAAAAAAAAAAAAAAAAAAAAAY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAWFlaIAAAAAAAAJwYAABPpQAABPxYWVogAAAAAAAANI0AAKAsAAAPlVhZWiAAAAAAAAAmMQAAEC8AAL6c/+4AIUFkb2JlAGSAAAAAAQMAEAMCAwYAAAAA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MQ8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatWtNWLnDTMIYInPbCp5bTrEbpzG8VLXu/wCGnAyMwVha8RDzuP8ASF0bR+FR+rX9FT+bZ9ELKZxQ5Wy4zU1t/ZKVbc/0VfNYMpVsqfKn+23UK9rWfdNDRsHyQULYJUru1O4isZN+UIjQkJgrGC2fRBQl2+it7M1qEZETk0VyzfH2aEDPQJbQK1Za0bsxzyQLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpguamC5qYLmpgtNWwQR1fnkhEE3zHpVPNqS1cRA2zS1ybw4/gjISyah1rkVyiCm3CJ3jDoy2qZtCdwn184h0WlfWuRWjP6Zsan2IyW2vwrXZeSXUo+G0RZua31mNPPuw5c4DfhiD3pTAdB5Re6sb9bskOSOp9ShX5XSmzThpLOZ4vZ2CIldCXP3pXNZcskDHyBbQMXloel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel3mgel97y0PVTyqP/aAAgBAgABBQD/ALbAgqIeWVzyyueWVzyyuCgqUPlIMD6KqAkUJE/EhwOXDfQfr8ohgfR+t3jcB4MFuA4b6D9flIz1MCfyc3lQ8EQMmbzCueOr8qeWWxm2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luI5SMGMalc3j+bere2zzRxWrB0VEKgsOXNoadR73lmnM8IwRcjbMeFkyVJctLcrtSSURSqYnvU2VJZW8spjjxwLIxbh+7Xt88k6yHDMEVlV8PzNCp93I8skFwczh0LHwcugnV8ihdwy3EkiDBNopcJ2fm0poZXdkcFWBjbAg0t5HJcOyEsiupaND4Eez5NXkhkmc3+O1zITgG1kh0NBKSRbi7JjYMuIOGic+XLstWpLqee52shBzAMMuH5fm6ewhMjRSAiQvGxaTH818tJcCW5kyNmVHUtHjydDZ8in30JpzcOmzIKHIF8FMng0b6aW4SRgAwjUqr+FJ5upN1CSZ7eU5jmRiwP8NslG4gknklwwVpELGPsfNpU+7hJNJDcMXfOhY5m+4upyKW5EtxKU1VkUsgPfZNmlT70jmmNxca2ZGKr2Oho1MLWaZjO5kcuhJzHxUTRrrZPRtU8Ecjl5InVfNtrMrItW/wBr9N/mHb5dnys+GX7+fRr3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1de7err3b1dD2fLs/oyYZf7mj8v//Z";
            var imageninterior = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MzRBMUQ0QUE5REMxMUU3OUUwMkFBQTMwNzgwOEIwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MzRBMUQ0QkE5REMxMUU3OUUwMkFBQTMwNzgwOEIwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjczNEExRDQ4QTlEQzExRTc5RTAyQUFBMzA3ODA4QjA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjczNEExRDQ5QTlEQzExRTc5RTAyQUFBMzA3ODA4QjA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AIUFkb2JlAGTAAAAAAQMAEAMCAwYAAAzHAAAXuQAAOs7/2wCEABAL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qROXUXIejmOPwQlEWL/FvinGQPF68GQjG0fWSRQovowPN7pgH3X+1EENQHxRA0jk6ZqWdSESaM3BWG/AKo4gcwicaB/co2DyCFNwJHdx9q1si7dq8uv1Wmn0XU3eqM6LX1Rsz15qBej9I7UbPqqY396Nu1U9P//aAAgBAQEGPwBTkzxw6r6e8dUvbltqIrx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96narx2PvU7VeOx96naopjZEUzgXKxurkD22UmvIMfJjWaGR8kPGwuD/LU7fziuHQdQVw6DqCuHQdQVw6DqCu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9S40m86abWt8t6SWbzGBJ49izxTqkltvw6geTbUpw8uGU7XcLMjzSt9pbbWX5xkZMGJG5IgikkQNdvmNr0uTL5lDFkKNPew5Cxsw/wCog0fL4szE+mcfzFMqHWdl2Y32k2qOb/yMUvdbY45clXjT2aVJ5qHmQ8ziiyQVLGPIVQxQ3GoX28gp5z5jFC0v9UQ5KoshuTdwDt5aHljZ+NHiLpskcyKRp2jbc1Hjx+ZY3dxKEW8yE2At7a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmuJY29TpriWNvU6a4ljb1OmppsOZMiIeWhS8bB11CYbLj7axuF8r8W5P3f6X/wBX5q9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStela9K16Vr0rXpWvStelak4L/SPC/63zL8/wD0f52r/9k=";

            doc.addImage(imageHeader, 'JPEG', 38, 20, 508, 100);


            var anioelab = "";
            if ($scope.itf.anioElaboracion == null) {
                anioelab = "";
            } else {
                anioelab = $scope.itf.anioElaboracion;
            }

            var nomun = "";
            if ($scope.nombreUnidad == null) {
                nomun = "";
            } else {
                nomun = $scope.nombreUnidad;
            }

            var jefeproy = "";
            if ($scope.proyecto.nombreJefeProyecto == null) {
                jefeproy = "";
            } else {
                jefeproy = $scope.proyecto.nombreJefeProyecto;
            }

            var columns = ["", ""];
            var data = [
                ["Proyecto:", $scope.proyecto.proyectoId + " " + $scope.proyecto.nombre],
                ["Jefe de proyecto:", jefeproy],
                ["División", $scope.unidadPadre.claveUnidadPadre.nombreUnidad],
                ["Gerencia", nomun],
                ["Temas", ""],
                ["Autores", cadenaAutores],
                ["Año de elaboración", anioelab],
            ];

            doc.autoTable(columns, data, {
               theme: 'grid',
               startY: 120,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: 255, fillColor: [255, 255, 255], fontStyle: 'normal'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left', left:10 },
               columnStyles: {
                   0: { columnWidth: 100},
                   1: { columnWidth: 400 },
                  
               }
           });

            var columns = ["Fecha de inicio"];
            var data = [ [""] ];
                 
           doc.autoTable(columns,data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 200 }
                   
               }
           });

           var columns = ["Programada", "Real"];
           var data = [["Programada", "Real"], [today1, today1]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'center' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 100 },
                   1: { columnWidth: 100 }
               }
           });

           var columns = ["Fecha de término"];
           var data = [ [""] ];
          
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: 270,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 340 },
               columnStyles: {
                   0: { columnWidth: 200 }
                  
               }
           });

           var columns = ["Programada", "Real"];
           var data = [["Programada", "Real"], [today2,today2]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: 286,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'center' },
               margin: { left: 340 },
               columnStyles: {
                   0: { columnWidth: 100 },
                   1: { columnWidth: 100 }
               }
           });


           var resfinABC = "";
           if ($scope.proyecto.facturacionPlaneada == null) {
               resfinABC = "";
           } else {
               resfinABC = $scope.proyecto.facturacionPlaneada;
           }

           var columns = ["", ""];
           var data = [["Cliente : ", $scope.cliente], ["Monto contratado : $", resfinABC]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10, 
               styles: { cellPadding: 2 },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 100 },
                   1: { columnWidth: 400 }
               }
           });





            //RESULTADOS ECONÓMICOS 
           var columns = ["I. Resultados económicos:"];
           var data = [[""]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10, 
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


          
           var resfin = "";
           if ($scope.itf.resultadosE == null) {
               resfin = "";
           } else {
               resfin = $scope.itf.resultadosE.califResultadosFinancieros.nombre;
           }


           var ingre = "";
           if ($scope.proyecto.facturacionReal == null) {
               ingre = "";
           } else {
               ingre = $scope.proyecto.facturacionReal;
           }


           var egre = "";
           if ($scope.proyecto.egresos == null) {
               egre = "";
           } else {
               egre = $scope.proyecto.egresos;
           }


           var columns = ["", ""];
           var data = [
               ["Ingresos: $", ingre],
               ["Egresos: $", egre],
               ["Calificación de Resultados Económicos (RE)", resfin]
           ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 300 },
                   1: { columnWidth: 200 }
               }
           });


           //II. Satisfacción del cliente
           var columns = ["II. Satisfacción del cliente:"];
           var data = [[""]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


          
           var calclie = "";
           if ($scope.itf.satisCte  == null) {
               calclie = "";
           } else {
               calclie = $scope.itf.satisCte.calificacionCliente.nombre;
           }

           var columns = [""];
           var data = [["Calificación de satisfacción del cliente (SC): " +  calclie]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });



          
           var justclie = "";
           if ($scope.itf.satisCte == null) {
               justclie = "";
           } else {
               justclie = $scope.itf.satisCte.justificacion;
           }

           var columns = [""];
           var data = [ ["Justificación: \n " + justclie] ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 40, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


           doc.addPage();
           doc.addImage(imageninterior, 'JPEG', 38, 10, 500, 50);

           doc.setFontSize(10);
           doc.setTextColor(40);
           doc.text($scope.itf.proyecto.proyectoId, 430, 56);
           doc.setFontSize(10);
           doc.setTextColor(40);

           //III. Resumen de resultados m&aacute;s relevantes:
           var columns = ["III. Resumen de resultados más relevantes:"];
           var data = [ [""] ];
           //var res = doc.autoTableHtmlToJson(document.getElementById("seccion7"));
           doc.autoTable(columns,data, {
               theme: 'grid',
               startY: 70,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


           var descrip = "";
           if ($scope.itf.resultados == null) {
               descrip = "";
           } else {
               descrip = $scope.itf.resultados.descripcion;
           }
           var columns = [""];
           var data = [[descrip]];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 80, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


            //POSIBLES PROYECTOS FUTUROS 
            
           // IV. Posibles proyectos futuros derivados de este proyecto:
           var columns = [" IV. Posibles proyectos futuros derivados de este proyecto:"];
           var data = [[""]];
           //var res = doc.autoTableHtmlToJson(document.getElementById("seccion8"));
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


           var descrip1 = "";
           if ($scope.itf.proyFuturo == null) {
               descrip1 = "";
           } else {
               descrip1 = $scope.itf.proyFuturo.descripcion;
           }

           var columns = [""];
           var data = [[descrip1] ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 1, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'bold', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 80, fontSize: 10, valign: 'top', halign: 'left' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


           // V. Evaluaci&oacute;n del personal:
           var columns = [" V. Evaluación del personal:"];
           var data = [ [""] ];
           
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });

          
           var columns = ["Nombre", "H-H Trabajadas", "Calificación"];
           doc.autoTable(columns, listaEvaluacionPersonal, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [224, 233, 244], fontStyle: 'normal', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 300 },
                   1: { columnWidth: 100 },
                   2: { columnWidth: 100 },
               }
           });


           // VI. Evaluaci&oacute;n del jefe del proyecto:
           var columns = ["VI. Evaluación del jefe del proyecto:"];
           var data = [ [""] ];
          
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });

          
           //var res = doc.autoTableHtmlToJson(document.getElementById("seccion12"));
           var columns = ["Nombre", "H-H Trabajadas", "Calificación"];
           doc.autoTable(columns, listaEvaluacionJefe, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [224, 233, 244], fontStyle: 'normal', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 16, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 300 },
                   1: { columnWidth: 100 },
                   2: { columnWidth: 100 },
               }
           });


           doc.addPage();
           doc.addImage(imageninterior, 'JPEG', 38, 10, 500, 50);

           doc.setFontSize(10);
           doc.setTextColor(40);
           doc.text($scope.itf.proyecto.proyectoId, 430, 56);
           doc.setFontSize(10);
           doc.setTextColor(40);


           // VII. Lecciones aprendidas:
           var columns = ["VII. Lecciones aprendidas:"];
           var data = [ [""] ];
          
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: 70,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }
               }
           });


           var dato1 = "";
           if ($scope.itf.lActe == null) {
               dato1 = "";
           } else {
               dato1 = $scope.itf.lActe.negociacion;
           }

           var dato2 = "";
           if ($scope.itf.lActe == null) {
               dato2 = "";
           } else {
               dato2 = $scope.itf.lActe.desarrollo ;
           }

           var dato3 = "";
           if ($scope.itf.lActe == null) {
               dato3 = "";
           } else {
               dato3 = $scope.itf.lActe.cierre;
           }

           var daton = "";
           if ($scope.itf.lActe == null) {
               daton = "";
           } else {
               daton = $scope.itf.lAproy.clave;
           }

           var dato4 = "";
           if ($scope.itf.lAproy == null) {
               dato4 = "";
           } else {
               dato4 = $scope.itf.lAproy.insumos;
           }

           var dato5 = "";
           if ($scope.itf.lAproy == null) {
               dato5 = "";
           } else {
               dato5 = $scope.itf.lAproy.equipo;
           }

           var dato6 = "";
           if ($scope.itf.lAproy == null) {
               dato6 = "";
           } else {
               dato6 = $scope.itf.lAproy.gestion;
           }

           var dato7 = "";
           if ($scope.itf.lAproy== null) {
               dato7 = "";
           } else {
               dato7 = $scope.itf.lAproy.cumplimiento;
           }

           var dato8 = "";
           if ($scope.itf.lAcap == null) {
               dato8 = "";
           } else {
               dato8 = $scope.itf.lAcap.instalaciones;
           }

           var dato9 = "";
           if ($scope.itf.lAcap == null) {
               dato9 = "";
           } else {
               dato9 = $scope.itf.lAcap.servicios;
           }

           
           var columns = ["",""];
           var data = [
               ["Relación con el cliente:\n\n - En la negociación\n - En el desarrollo\n - En el cierre ", "\n\n" + " - " + dato1 + "\n" + " - " + dato2 + "\n" + " - " + dato3],
               ["Desarrollo del proyecto:\n\n - Insumos tecnólogicos\n - Equipo de trabajo\n - Gestión del proyecto\n - Cumplimiento del tiempo, costo y alcance   original\n - Palabras clave", "\n\n" + " - " +  dato4 + "\n" + " - " + dato5 + "\n" + " - " + dato6 + "\n" + " - " + dato7  + "\n" + " - " + daton],
               ["Capacidad del INEEL:\n\n - en sus instalaciones\n - Servicios de apoyo y administrativos", "\n\n" + " - " + dato8 + "\n" + " - " + dato9]
           ];
                       
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 0, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [255, 255, 255], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 80, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 200 },
                   1: { columnWidth: 300 },
                   
               }
           });
                 

           // VIII. Insumos del proyecto:
           var columns = ["VIII. Insumos del proyecto:"];
           var data = [ [""]  ];
          
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() +  10,
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 0, fontSize: 10, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 500 }

               }
           });
            
         
           var columns = ["Nombre del insumo", "Descripción", "Responsable (Ubicación)","Tipo acceso(Público o reservado)"];
           doc.autoTable(columns, listaInsumos, {
               theme: 'grid',
               startY: doc.autoTableEndPosY(),
               styles: { cellPadding: 2, overflow: 'linebreak' },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [0, 0, 0], fillColor: [224, 233, 244], fontStyle: 'normal', valign: 'top', halign: 'left'
               },
               bodyStyles: { rowHeight: 30, fontSize: 8, valign: 'top', halign: 'left' },
               columnStyles: {
                   0: { columnWidth: 150 },
                   1: { columnWidth: 150 },
                   2: { columnWidth: 100 },
                   3: { columnWidth: 100}

               }
           });


           var columns = ["Elaboró"];
           var data = [
               ["\n\n\n " + "________________\nJefe de proyecto\n"  + fechaImprime],
           ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() + 10,
               styles: { cellPadding: 2 },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'bold', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 30, fontSize: 10, valign: 'top', halign: 'center' },
               margin: { left: 40 },
               columnStyles: {
                   0: { columnWidth: 140 }
               }
           });


           var columns = ["Revisó"];
           var data = [
               ["\n\n\n " + "________________\nGerente" + "\n" + fechaImprime],
           ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() -102 ,
               styles: { cellPadding: 2 },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'bold', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 30, fontSize: 10, valign: 'top', halign: 'center' },
               margin: { left: 220 },
               columnStyles: {
                   0: { columnWidth: 140 }
               }
           });

           var columns = ["Aprobó"];
           var data = [
               ["\n\n\n " + "________________\nDirector de División" + "\n" + fechaImprime],
           ];
           doc.autoTable(columns, data, {
               theme: 'grid',
               startY: doc.autoTableEndPosY() -102,
               styles: { cellPadding: 2 },
               headerStyles: {
                   rowHeight: 16, fontSize: 10,
                   textColor: [255, 255, 255], fillColor: [102, 153, 204], fontStyle: 'bold', valign: 'top', halign: 'center'
               },
               bodyStyles: { rowHeight: 30, fontSize: 10, valign: 'top', halign: 'center' },
               margin: { left: 400 },
               columnStyles: {
                   0: { columnWidth: 140 }
               }
           });

   
           toastr.clear();
            
            doc.save('caratulaITF.pdf');


            $scope.itf.divCaratula = false;

        };




        $scope.registraAcceso = function () {



            var datos = {
                "claveEmpleado": $scope.ClavePersonaLogin,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "ITF"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();


    }






})();