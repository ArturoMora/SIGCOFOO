//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function () {
    "use strict";

    angular.module("ineelCR", ['ui.router',
        'ui.bootstrap',
        'LocalStorageModule',
        "ineel.CR.services",
        'ineel.services',
        'datatables',
        'GlobalINEEL',
        'angucomplete-alt',
        'datatables.buttons',
        'ui.tree',
        'blockUI',
        'mdo-angular-cryptography',
        "chart.js",
        'directivasSIGCO',
        'ineel.controllers',
        'angularFileUpload',
        'textAngular'
    ])
        .filter('BlackListOC', function () {
            return function (oCsRolesBlackList, idRol) {
                //debugger;
                if (idRol == undefined || oCsRolesBlackList == undefined || oCsRolesBlackList == null || oCsRolesBlackList.length < 1) {
                    return false;
                }
                try {
                    var dentro = false;
                    for (var i = 0; i < oCsRolesBlackList.length; i++) {
                        if (oCsRolesBlackList[i].rolId == idRol) {
                            dentro = true;
                            break;
                        }
                    }
                    return dentro;
                } catch (e) { return false; }

                return false;
            };
        })
        .filter('formatoFecha', function() {
            return function(fecha) {
                if(fecha){
                    var text="";
                    var isDecimal=fecha===+fecha && fecha!== (fecha | 0)
                    if(isDecimal){
                        var arrayDate= String(fecha).split(".");
                        var finalMonth= (12 * parseInt(arrayDate[1])/100).toFixed(0);
                        if(arrayDate[0]=="0"){
                            text=finalMonth+" meses";
                        }else{
                            text=arrayDate[0]+" años y "+finalMonth+" meses";
                        }
                        
                    }else{
                        text=fecha+" años";
                    }
                    return text;
                }
            }
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        }).config(function (blockUIConfig) {
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
            blockUIConfig.requestFilter = function (config) {
                if (config.url.indexOf("block=no") > 0) {
                    return false; // ... don't block it.
                }
            };
        })
        .config(function ($provide) {
            // this demonstrates how to register a new tool and add it to the default toolbar
            $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
                taOptions.toolbar = [
                    [],
                  
                ];
                return taOptions;
            }]);
        })
        .config(["$stateProvider", "$urlRouterProvider", routerConfig])
        .run(function (DTDefaultOptions) {
            DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
            DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
            DTDefaultOptions.setOption('searchHighlight', 'true');
            DTDefaultOptions.setOption('bStateSave', true);
            DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
            DTDefaultOptions.setDisplayLength(5);
        })
        .run(function ($rootScope, $location, AuthService, MenuService, PermisosService, $window, $state, $uibModal) {
            //perfil del personal INEEL
            $rootScope.openProfile = function (personaId) {
                $rootScope.personaIDSearch = personaId;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: "app/vistasGenericas/_details/personal/PersonalComunProfile.html",
                    controller: "PersonaProfileComunCtrl",
                });
            }
            $rootScope.idRol = MenuService.getRolId();
            $rootScope.anioActual = anioActual();
            $rootScope.globalRegresar = function () {
                $window.history.back();
                MenuService.removeGlobalID();
                MenuService.removeGlobalID2();
            }
            $rootScope.datePicker = getRangoDeFechaDefault();
            $rootScope.setGlobalGo = function (id) {
                $state.go(id);
            }
            $rootScope.setGlobalID = function (id) {
                MenuService.setGlobalID(id);
            }
            $rootScope.getGlobalID = function () {
                return MenuService.getGlobalID();
            }
            $rootScope.setGlobalID2 = function (id) {
                MenuService.setGlobalID2(id);
            }
            $rootScope.getGlobalID2 = function () {
                return MenuService.getGlobalID2();
            }
            $rootScope.setVariable=function(nombre, valor){
                MenuService.setVariable(nombre,valor);
            }
            $rootScope.getVariable=function(nombre){
                MenuService.getVariable(nombre);
            }

            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
                var continuar = false;
                $rootScope.nameState = to.name;
                $rootScope.toState = to;
                $rootScope.fromState = from;
               
                $rootScope.usuarioLogueado = false;
                AuthService.verificaSesion().then(function (res) {
                    
                    if (res != null) {
                        $rootScope.usuarioLogueado = true;
                    } 

                   
                    if ((typeof to.access != 'undefined') && to.access == "anonymous") {

                        continuar = true;

                    } else {
                       
                        //if (!AuthService.authentication.isAuth && $rootScope.usuarioLogueado) {
                        if ($rootScope.usuarioLogueado==false) {
                            try {
                                to.url = to.url.replace(":id2", toParams.id2);
                                to.url = to.url.replace(":id", toParams.id);
                            } catch (ex) { }
                            console.log("/indexCR.html#" + to.url);
                            MenuService.setReturnUrl("/indexCR.html#" + to.url);
                            window.location = "/sigco.html";
                        }
                        var next = "";
                        if (typeof to.views === "object") {
                            for (var obj in to.views) {
                                next = to.views[obj].url;
                                break;
                            }
                        }
                        if (typeof to.url === "string") {
                            next = to.url;
                        }
                        var permitir = PermisosService.verificaPermisos(next, 'CR');
                        if (!permitir.$$state.value) {
                            toastr.error('No autorizado');
                            window.location = "/index.html#/login";
                            ev.preventDefault();
                        }
                    }
                });

               
            });
            $rootScope.$on('$viewContentLoaded', function (event, viewName, viewContent) {
                $(":file").addClass("filestyle");
                $('.filestyle').each(function () {
                    var $this = $(this), options = {
                        'input': $this.attr('data-input') === 'false' ? false : true,
                        'icon': $this.attr('data-icon') === 'false' ? false : true,
                        'buttonBefore': $this.attr('data-buttonBefore') === 'true' ? true : false,
                        'disabled': $this.attr('data-disabled') === 'true' ? true : false,
                        'size': $this.attr('data-size'),
                        'buttonText': $this.attr('data-buttonText'),
                        'buttonName': $this.attr('data-buttonName'),
                        'iconName': $this.attr('data-iconName'),
                        'badge': $this.attr('data-badge') === 'false' ? false : true,
                        'placeholder': $this.attr('data-placeholder')
                    };
                    $this.filestyle(options);
                });

                // Panel toolbox
                $(document).ready(function () {
                    $('.collapse-link').on('click', function () {
                        var $BOX_PANEL = $(this).closest('.x_panel'),
                            $ICON = $(this).find('i'),
                            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

                        // fix for some div with hardcoded fix class
                        if ($BOX_PANEL.attr('style')) {
                            $BOX_CONTENT.slideToggle(200, function () {
                                $BOX_PANEL.removeAttr('style');
                            });
                        } else {
                            $BOX_CONTENT.slideToggle(200);
                            $BOX_PANEL.css('height', 'auto');
                        }

                        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
                    });

                    $('.close-link').click(function () {
                        var $BOX_PANEL = $(this).closest('.x_panel');

                        $BOX_PANEL.remove();
                    });
                });
                window.scrollTo(0, 0);
            }); //Fin de $viewContentLoaded

        })
        .filter('encriptar', function (DescargasService) {
            return function (x) {
                return DescargasService.encriptar(x);
            };
        })
    ;

    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("home");

        $stateProvider
            .state("homeCR", {
                url: "/home",
                templateUrl: "app/CR/home/homeCR.html",
                controller: "CargaControllerCR"
            })
            .state("homeCatalogosCR", {
                url: "/Catalogos",
                templateUrl: "app/CR/home/homeCatalogosCR.html",
                controller: "indexControllerCR"
            })
            .state("homeClientes", {
                url: "/homeClientes",
                templateUrl: "app/CR/homeClientes/homeClientes.html",
                controller: "homeClientesCRCtrl"
            })
            .state("homeON", {
                url: "/homeON",
                templateUrl: "app/CR/homeOportunidadNegocio/homeON.html",
                controller: "homeONCRCtrl"
            })
            //
            //Oportunidad de negocios
            .state("dashboard", {
                url: "/dashboard",
                templateUrl: "app/CR/homeOportunidadNegocio/dashboard.html",
                controller: "homeONCRCtrl"
            })

            .state("asignarOportunidad", {
                url: "/asignarOportunidad",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Registrar/oportunidadNegociosGet.html",
                controller: "OportunidadNegociosGetCtrl"
            })
            .state("asignarOportunidadEspecialista", {
                url: "/asignarOportunidadEspecialista/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/AsignarEspecialista/asignarEspecialista.html",
                controller: "AsignarEspecialistaCtrl"
            })
            .state("misOportunidadesRegistradas", {
                url: "/misOportunidadesRegistradas",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/MisOportunidadesRegistradas/misOportunidadesGet.html",
                controller: "MisOportunidadesRegistradasGetCtrl"
            })
            .state("misOportunidadesAsignadas", {
                url: "/misOportunidadesAsignadas",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/MisOportunidadesAsignadas/misOportunidadesAsignadasGet.html",
                controller: "MisOportunidadesAsignadasGetCtrl"
            })
            .state("historialOportunidades", {
                url: "/historialOportunidades",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Historial/historialOportunidadesGet.html",
                controller: "HistorialOportunidadesCtrl"
            })
            .state("oportunidadHistorico", {
                url: "/oportunidadHistorico/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Historial/historialOportunidadDetails.html",
                controller: "HistorialOportunidadDetailsCtrl"
            })
            .state("registrarOportunidad", {
                url: "/registrarOportunidad",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Registrar/oportunidadNegocioAdd.html",
                controller: "OportunidadNegocioAddCtrl"
            })
            .state("oportunidadesPorAsignar", {
                url: "/oportunidadesPorAsignar",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/AsignarAInvestigador/OportunidadesPorAsignarGet.html",
                controller: "OportunidadesPorAsignarGetCtrl"
            })
            .state("oportunidadDetails", {
                url: "/detallesOportunidad/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Registrar/oportunidadNegocioDetails.html",
                controller: "OportunidadNegocioDetailsCtrl"
            })
            .state("oportunidadEspecialistaEdit", {
                url: "/editarOportunidadEspecialista/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/AsignarAUnidad/oportunidadEspecialistaEdit.html",
                controller: "OportunidadEspecialistaEditCtrl"
            })
            .state("oportunidadEdit", {
                url: "/editarOportunidad/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/Registrar/oportunidadNegocioEdit.html",
                controller: "OportunidadNegocioEditCtrl"
            })
            .state("crearEspecialista", {
                url: "/crearEspecialista",
                templateUrl: "app/CR/oportunidadNegocio/Especialistas/especialistaGet.html",
                controller: "EspecialistaGetCtrl"
            })
            .state("tiposEventosGet", {
                url: "/tiposEvento",
                templateUrl: "app/CR/oportunidadNegocio/Catalogos/TipoEventos/tipoEventosGet.html",
                controller: "TipoEventosGetCtrl"
            })
            .state("tipoEventoAdd", {
                url: "/agregarTipoEvento",
                templateUrl: "app/CR/oportunidadNegocio/Catalogos/TipoEventos/eventosAdd.html",
                controller: "TipoEventoGetCtrl"
            })
            .state("eventosGet", {
                url: "/eventos",
                templateUrl: "app/CR/oportunidadNegocio/Catalogos/Eventos/EventosGet.html",
                controller: "EventosGetCtrl"
            })
            .state("eventosAdd", {
                url: "/eventosAdd",
                templateUrl: "app/CR/oportunidadNegocio/Catalogos/Eventos/eventoAdd.html",
                controller: "EventoAddCtrl"
            })
             .state("eventosEdit", {
                 url: "/eventosEdit/:id",
                 templateUrl: "app/CR/oportunidadNegocio/Catalogos/Eventos/eventoEdit.html",
                 controller: "EventoEditCtrl"
             })
             .state("eventosDetalle", {
                 url: "/eventosDetalle/:id",
                 templateUrl: "app/CR/oportunidadNegocio/Catalogos/Eventos/eventoDetails.html",
                 controller: "EventoDetailsCtrl"
             })
            //SEGUIMIENTO A MI OPORTUNIDAD
            .state("seguimientoOportunidad", {
                url: "/seguimientoOportunidad",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/seguimientoOportunidadGet.html",
                controller: "SeguimientoOportunidadGetCtrl"
            })
            .state("seguimientoONDetails", {
                url: "/seguimientoONDetails/:id",
                templateUrl: "app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/seguimientoOportunidadDetails.html",
                controller: "SeguimientoOportunidadDetailsCtrl"
            })

            //Contactos
            .state("contactosGet", {
                url: "/Contactos",
                templateUrl: "app/CR/contactos/contacto/contactosGet.html",
                controller: "ContactosGetCtrl"
            })
            .state("contactoDetails", {
                url: "/detalles/:id",
                templateUrl: "app/CR/contactos/contacto/contactoDetails.html",
                controller: "ContactoDetailsCtrl"
            })
            .state("contactoEdit", {
                url: "/editar/:id",
                templateUrl: "app/CR/contactos/contacto/contactoEdit.html",
                controller: "ContactoEditCtrl"
            })
            .state("contactoAdd", {
                url: "/crear",
                templateUrl: "app/CR/contactos/contacto/contactoAdd.html",
                controller: "ContactoAddCtrl"
            })
            .state("contactoGet.perfilCVGet", {
                views: {
                    'perfilCVGet': {
                        url: "/perfilCVGet",
                        templateUrl: "app/CR/contactos/perfil/perfilGet.html",
                        controller: "PerfilGetCtrl"
                    }
                }
            })
            .state("contactoEdit.perfilCV", {
                views: {
                    'perfilCV': {
                        url: "/perfilCV",
                        templateUrl: "app/CR/contactos/perfil/perfilAdd.html",
                        controller: "PerfilAddCtrl"
                    }
                }
            })
            .state("contactoEdit.puestos", {
                views: {
                    'puestos': {
                        url: "/puestos",
                        templateUrl: "app/CR/contactos/puestos/puestoAdd.html",
                        controller: "PuestoAddCtrl"
                    }
                }
            })
            .state("empresasGet", {
                url: "/empresas",
                templateUrl: "app/CR/empresas/empresa/empresasGet.html",
                controller: "EmpresasGetCtrl"
            })
             .state("inicioclientes", {
                url: "/inicioclientes",
                templateUrl: "app/CR/clientes/inicioclientes.html",
                controller: "inicioclientesCtrl"
            })
            .state("consultasGet", {
                url: "/consultas",
                templateUrl: "app/CR/consultas/clientes/clienteGet.html",
                controller: "ClienteGetCtrl"
            })
            .state("consultasClientesGet",{
                url:"/consultasClientes/:id",
                templateUrl: "app/CR/consultas/clientes/clienteGetConsulta.html",
                controller: "ClienteGetConsultaCtrl"
            })
            .state("consultaUnidadCliente",{
                url:"/consultaUnidadOrganizacionalCliente/:id",
                templateUrl: "app/CR/consultas/clientes/unidadClienteGetConsulta.html",
                controller: "UnidadClienteGetConsultaCtrl"
            })
            .state("empresaDetails", {
                url: "/empresaDetails/:id",
                templateUrl: "app/CR/empresas/empresa/empresaDetails.html",
                controller: "EmpresaDetailsCtrl"
            })
            .state("empresaEdit", {
                url: "/empresa/:id",
                templateUrl: "app/CR/empresas/empresa/empresaEdit.html",
                controller: "EmpresaEditCtrl"
            })
            .state("empresaAdd", {
                url: "/empresa",
                templateUrl: "app/CR/empresas/empresa/empresaAdd.html",
                controller: "EmpresaAddCtrl"
            })
            .state("empresaEdit.unidadOrganizacional", {
                views: {
                    'unidadOrganizacional': {
                        url: "/unidadOrganizacional",
                        templateUrl: "app/CR/empresas/unidadOrganizacional/unidadOrganizacionalAdd.html",
                        controller: "UnidadAddCtrl"
                    }
                }
            })
            .state("empresaEdit.proyectos", {
                views: {
                    'proyectos': {
                        url: "/proyectos",
                        templateUrl: "app/CR/empresas/proyectos/proyectosAsignadosGet.html",
                        controller: "ProyectosAsignadosGetCtrl"
                    }
                }
            })
            .state("empresaEdit.propuestas", {
                views: {
                    'propuestas': {
                        url: "/propuestas",
                        templateUrl: "app/CR/empresas/propuestas/propuestasAsignadasGet.html",
                        controller: "PropuestasAsignadasGetCtrl"
                    }
                }
            })
            .state("empresaEdit.iniciativas", {
                views: {
                    'iniciativas': {
                        url: "/iniciativas",
                        templateUrl: "app/CR/empresas/iniciativas/iniciativasAsignadasGet.html",
                        controller: "IniciativasAsignadasGetCtrl"
                    }
                }
            })
            .state("empresaEdit.contactoEmpresaAdd", {
                views: {
                    'contactoEmpresaAdd': {
                        url: "/agregarContactoEmpresa",
                        templateUrl: "app/CR/empresas/contactosEmpresa/contactosEmpresaAdd.html",
                        controller: "ContactosEmpresaAddCtrl"
                    }
                }
            })
            .state("empresaEdit.historialUnidadesEmpresas", {
                views: {
                    'historialUnidadesEmpresas': {
                        url: "/historialUnidadesEmpresa",
                        templateUrl: "app/CR/empresas/historialUnidadesOrganizacionales/historialUnidadesOrganizacionalesEmpresaGet.html",
                        controller: "HistorialUnidadesOrganizacionalesEmpresaGetCtrl"
                    }
                }
            })


            .state("areasInvestigacionGet", {
                url: "/AreasInvestigacion",
                templateUrl: "app/CR/areasInvestigacion/areasInvestigacionGet.html",
                controller: "AreasInvestigacionGetCtrl"
            })
            .state("areaInvestigacionDetails", {
                url: "/detallesAreaInvestigacion/:id",
                templateUrl: "app/CR/areasInvestigacion/areaInvestigacionDetails.html",
                controller: "AreaInvestigacionDetailsCtrl"
            })
            .state("areaInvestigacionEdit", {
                url: "/editarAreaInvestigacion/:id",
                templateUrl: "app/CR/areasInvestigacion/areaInvestigacionEdit.html",
                controller: "AreaInvestigacionEditCtrl"
            })
            .state("areaInvestigacionAdd", {
                url: "/crearAreaInvestigacion",
                templateUrl: "app/CR/areasInvestigacion/areaInvestigacionAdd.html",
                controller: "AreaInvestigacionAddCtrl"
            })
            .state("lineasDesarrolloTecnologicoGet", {
                url: "/LineasDesarrolloTecnologico",
                templateUrl: "app/CR/lineasDesarrolloTecnologico/lineasDesarrolloTecnologicoGet.html",
                controller: "LineasDesarrolloTecnologicoGetCtrl"
            })
            .state("lineaDesarrolloTecnologicoDetails", {
                url: "/detallesLineaDesarrolloTecnologico/:id",
                templateUrl: "app/CR/lineasDesarrolloTecnologico/lineaDesarrolloTecnologicoDetails.html",
                controller: "LineaDesarrolloTecnologicoDetailsCtrl"
            })
            .state("lineaDesarrolloTecnologicoEdit", {
                url: "/editarLineaDesarrolloTecnologico/:id",
                templateUrl: "app/CR/lineasDesarrolloTecnologico/lineaDesarrolloTecnologicoEdit.html",
                controller: "LineaDesarrolloTecnologicoEditCtrl"
            })
            .state("lineaDesarrolloTecnologicoAdd", {
                url: "/crearLineaDesarrolloTecnologico",
                templateUrl: "app/CR/lineasDesarrolloTecnologico/lineaDesarrolloTecnologicoAdd.html",
                controller: "LineaDesarrolloTecnologicoAddCtrl"
            })
            .state("naturalezasInteraccionGet", {
                url: "/NaturalezasInteraccion",
                templateUrl: "app/CR/naturalezasInteraccion/naturalezasInteraccionGet.html",
                controller: "NaturalezasInteraccionGetCtrl"
            })
            .state("naturalezaInteraccionDetails", {
                url: "/detallesNaturalezaInteraccion/:id",
                templateUrl: "app/CR/naturalezasInteraccion/naturalezaInteraccionDetails.html",
                controller: "NaturalezaInteraccionDetailsCtrl"
            })
            .state("naturalezaInteraccionEdit", {
                url: "/editarNaturalezaInteraccion/:id",
                templateUrl: "app/CR/naturalezasInteraccion/naturalezaInteraccionEdit.html",
                controller: "NaturalezaInteraccionEditCtrl"
            })
            .state("naturalezaInteraccionAdd", {
                url: "/crearNaturalezaInteraccion",
                templateUrl: "app/CR/naturalezasInteraccion/naturalezaInteraccionAdd.html",
                controller: "NaturalezaInteraccionAddCtrl"
            })
            .state("productosGet", {
                url: "/Productos",
                templateUrl: "app/CR/productos/productosGet.html",
                controller: "ProductosGetCtrl"
            })
            .state("productoDetails", {
                url: "/detallesProducto/:id",
                templateUrl: "app/CR/productos/productoDetails.html",
                controller: "ProductoDetailsCtrl"
            })
            .state("productoEdit", {
                url: "/editarProducto/:id",
                templateUrl: "app/CR/productos/productoEdit.html",
                controller: "ProductoEditCtrl"
            })
            .state("productoAdd", {
                url: "/crearProducto",
                templateUrl: "app/CR/productos/productoAdd.html",
                controller: "ProductoAddCtrl"
            })
            .state("segmentosMercadoGet", {
                url: "/SegmentosMercado",
                templateUrl: "app/CR/segmentosMercado/segmentosMercadoGet.html",
                controller: "SegmentosMercadoGetCtrl"
            })
            .state("segmentoMercadoDetails", {
                url: "/detallesSegmentoMercado/:id",
                templateUrl: "app/CR/segmentosMercado/segmentoMercadoDetails.html",
                controller: "SegmentoMercadoDetailsCtrl"
            })
            .state("segmentoMercadoEdit", {
                url: "/editarSegmentoMercado/:id",
                templateUrl: "app/CR/segmentosMercado/segmentoMercadoEdit.html",
                controller: "SegmentoMercadoEditCtrl"
            })
            .state("segmentoMercadoAdd", {
                url: "/crearSegmentoMercado",
                templateUrl: "app/CR/segmentosMercado/segmentoMercadoAdd.html",
                controller: "SegmentoMercadoAddCtrl"
            })
            .state("serviciosGet", {
                url: "/Servicios",
                templateUrl: "app/CR/servicios/serviciosGet.html",
                controller: "ServiciosGetCtrl"
            })
            .state("servicioDetails", {
                url: "/detallesServicio/:id",
                templateUrl: "app/CR/servicios/servicioDetails.html",
                controller: "ServicioDetailsCtrl"
            })
            .state("servicioEdit", {
                url: "/editarServicio/:id",
                templateUrl: "app/CR/servicios/servicioEdit.html",
                controller: "ServicioEditCtrl"
            })
            .state("servicioAdd", {
                url: "/crearServicio",
                templateUrl: "app/CR/servicios/servicioAdd.html",
                controller: "ServicioAddCtrl"
            })
            .state("tipoRelacionGetAll", {
                url: "/TipoRelaciones",
                templateUrl: "app/CR/tipoRelacion/tipoRelacionGet.html",
                controller: "TipoRelacionGetCtrl"
            })
            .state("tipoRelacionDetails", {
                url: "/tipoRelacionDetails/:id",
                templateUrl: "app/CR/tipoRelacion/tipoRelacionDetails.html",
                controller: "TipoRelacionDetailsCtrl"
            })
            .state("tipoRelacionEdit", {
                url: "/tipoRelacionEdit/:id",
                templateUrl: "app/CR/tipoRelacion/tipoRelacionEdit.html",
                controller: "TipoRelacionEditCtrl"
            })
            .state("tipoRelacionAdd", {
                url: "/tipoRelacionAdd",
                templateUrl: "app/CR/tipoRelacion/tipoRelacionAdd.html",
                controller: "TipoRelacionAddCtrl"
            })
            .state("tipoProductoServicioAdd", {
                url: "/tipoProductoServicioAdd",
                templateUrl: "app/CR/tipoProductoServicio/tipoProductoServicioAdd.html",
                controller: "TipoProductoServicioAddCtrl"
            })
            .state("tipoProductoServicioGetAll", {
                url: "/TipoProductoServicio",
                templateUrl: "app/CR/tipoProductoServicio/tipoProductoServicioGet.html",
                controller: "TipoProductoServicioGetCtrl"
            })
            .state("tipoProductoServicioDetails", {
                url: "/tipoProductoServicioDetails/:id",
                templateUrl: "app/CR/tipoProductoServicio/tipoProductoServicioDetails.html",
                controller: "TipoProductoServicioDetailsCtrl"
            })
            .state("tipoProductoServicioEdit", {
                url: "/tipoProductoServicioEdit/:id",
                templateUrl: "app/CR/tipoProductoServicio/tipoProductoServicioEdit.html",
                controller: "TipoProductoServicioEditCtrl"
            })
            .state("tipoFuenteFinanciamientoAdd", {
                url: "/tipoFuenteFinanciamientoAdd",
                templateUrl: "app/CR/tipoFuenteFinanciamiento/tipoFuenteFinanciamientoAdd.html",
                controller: "TipoFuenteFinanciamientoAddCtrl"
            })
            .state("tipoFuenteFinanciamientoGet", {
                url: "/TipoFuenteFinanciamiento",
                templateUrl: "app/CR/tipoFuenteFinanciamiento/tipoFuenteFinanciamientoGet.html",
                controller: "TipoFuenteFinanciamientoGetCtrl"
            })
            .state("tipoFuenteFinanciamientoDetails", {
                url: "/tipoFuenteFinanciamientoDetails/:id",
                templateUrl: "app/CR/tipoFuenteFinanciamiento/tipoFuenteFinanciamientoDetails.html",
                controller: "TipoFuenteFinanciamientoDetailsCtrl"
            })
            .state("tipoFuenteFinanciamientoEdit", {
                url: "/tipoFuenteFinanciamientoEdit/:id",
                templateUrl: "app/CR/tipoFuenteFinanciamiento/tipoFuenteFinanciamientoEdit.html",
                controller: "TipoFuenteFinanciamientoEditCtrl"
            })
            .state("tipoConvenioAdd", {
                url: "/tipoConvenioAdd",
                templateUrl: "app/CR/tipoConvenio/tipoConvenioAdd.html",
                controller: "TipoConvenioAddCtrl"
            })
            .state("tipoConvenioGet", {
                url: "/TipoConvenio",
                templateUrl: "app/CR/tipoConvenio/tipoConvenioGet.html",
                controller: "TipoConvenioGetCtrl"
            })
            .state("tipoConvenioDetails", {
                url: "/tipoConvenioDetails/:id",
                templateUrl: "app/CR/tipoConvenio/tipoConvenioDetails.html",
                controller: "TipoConvenioDetailsCtrl"
            })
            .state("tipoConvenioEdit", {
                url: "/tipoConvenioEdit/:id",
                templateUrl: "app/CR/tipoConvenio/tipoConvenioEdit.html",
                controller: "TipoConvenioEditCtrl"
            })
            .state("tematicaAdd", {
                url: "/tematicaAdd",
                templateUrl: "app/CR/tematica/tematicaAdd.html",
                controller: "TematicaAddCtrl"
            })
            .state("tematicaGet", {
                url: "/Tematica",
                templateUrl: "app/CR/tematica/tematicaGet.html",
                controller: "TematicaGetCtrl"
            })
            .state("tematicaDetails", {
                url: "/tematicaDetails/:id",
                templateUrl: "app/CR/tematica/tematicaDetails.html",
                controller: "TematicaDetailsCtrl"
            })
            .state("tematicaEdit", {
                url: "/tematicaEdit/:id",
                templateUrl: "app/CR/tematica/tematicaEdit.html",
                controller: "TematicaEditCtrl"
            })
            .state("tamanoEmpresaAdd", {
                url: "/tamanoEmpresaAdd",
                templateUrl: "app/CR/tamanoEmpresa/tamanoEmpresaAdd.html",
                controller: "TamanoEmpresaAddCtrl"
            })
            .state("tamanoEmpresaGet", {
                url: "/TamanoEmpresa",
                templateUrl: "app/CR/tamanoEmpresa/tamanoEmpresaGet.html",
                controller: "TamanoEmpresaGetCtrl"
            })
            .state("tamanoEmpresaDetails", {
                url: "/tamanoEmpresaDetails/:id",
                templateUrl: "app/CR/tamanoEmpresa/tamanoEmpresaDetails.html",
                controller: "TamanoEmpresaDetailsCtrl"
            })
            .state("tamanoEmpresaEdit", {
                url: "/tamanoEmpresaEdit/:id",
                templateUrl: "app/CR/tamanoEmpresa/tamanoEmpresaEdit.html",
                controller: "TamanoEmpresaEditCtrl2"
            })
            .state("sitioWebFondoProgramaAdd", {
                url: "/sitioWebFondoProgramaAdd",
                templateUrl: "app/CR/sitioWebFondoPrograma/sitioWebFondoProgramaAdd.html",
                controller: "SitioWebFondoProgramaAddCtrl"
            })
            .state("sitioWebFondoProgramaGet", {
                url: "/SitioWebFondoPrograma",
                templateUrl: "app/CR/sitioWebFondoPrograma/sitioWebFondoProgramaGet.html",
                controller: "SitioWebFondoProgramaGetCtrl"
            })
            .state("sitioWebFondoProgramaDetails", {
                url: "/sitioWebFondoProgramaDetails/:id",
                templateUrl: "app/CR/sitioWebFondoPrograma/sitioWebFondoProgramaDetails.html",
                controller: "SitioWebFondoProgramaDetailsCtrl"
            })
            .state("sitioWebFondoProgramaEdit", {
                url: "/sitioWebFondoProgramaEdit/:id",
                templateUrl: "app/CR/sitioWebFondoPrograma/sitioWebFondoProgramaEdit.html",
                controller: "SitioWebFondoProgramaEditCtrl"
            })
            .state("inicioconvocatorias", {
                url: "/inicioconvocatorias",
                templateUrl: "app/CR/convocatorias/inicioconvocatorias.html",
                controller: "inicioconvocatoriasCtrl"
            })
            .state("fuentesFinanciamientoGet", {
                url: "/FuentesFinanciamiento",
                templateUrl: "app/CR/fuentesFinanciamiento/fuentesFinanciamientoGet.html",
                controller: "FuentesFinanciamientoGetCtrl"
            })
            .state("fuentesFinanciamientoGetC", {  //al parecer este estado no se utiliza en el actual sigco, queda en revision
                url: "/FuentesFinanciamientoC",
                templateUrl: "app/CR/fuentesFinanciamiento/fuentesFinanciamientoGetConsulta.html",
                controller: "FuentesFinanciamientoGetCtrl"
            })
            .state("fuenteFinanciamientoDetails", {
                url: "/detallesFuenteFinanciamiento/:id",
                templateUrl: "app/CR/fuentesFinanciamiento/fuenteFinanciamientoDetails.html",
                controller: "FuenteFinanciamientoDetailsCtrl"
            })
            .state("fondoProgramaDetailsByFF", { //detalle de un fondo programa
                url: "/detallesFuenteFinanciamientoFP/:id",
                templateUrl: "app/CR/fuentesFinanciamiento/fondoProgramaDetailsByFF.html",
                controller: "FondoProgramaDetailsByFFCtrl"
            })
            .state("fondoProgramaDetailsByC", {
                url: "/detallesFuenteFinanciamientoC/:id",
                templateUrl: "app/CR/fuentesFinanciamiento/fondoProgramaDetailsByC.html",
                controller: "FondoProgramaDetailsByCCtrl"
            })
            .state("fuenteFinanciamientoEdit", {
                url: "/editarFuenteFinanciamiento/:id",
                templateUrl: "app/CR/fuentesFinanciamiento/fuenteFinanciamientoEdit.html",
                controller: "FuenteFinanciamientoEditCtrl"
            })
            .state("fuenteFinanciamientoAdd", {
                url: "/crearFuenteFinanciamiento",
                templateUrl: "app/CR/fuentesFinanciamiento/fuenteFinanciamientoAdd.html",
                controller: "FuenteFinanciamientoAddCtrl"
            })
            .state("fondoProgramaAdd", {
                url: "/fondoProgramaAdd",
                templateUrl: "app/CR/fondosPrograma/fondoProgramaAdd.html",
                controller: "FondoProgramaAddCtrl"
            })
            .state("fondosProgramaGet", {
                url: "/FondosPrograma",
                templateUrl: "app/CR/fondosPrograma/fondosProgramaGet.html",
                controller: "FondosProgramaGetCtrl"
            })
            .state("fondosProgramaGetC", {
                url: "/FondosProgramaC",
                templateUrl: "app/CR/fondosPrograma/fondosProgramaGetConsulta.html",
                controller: "FondosProgramaGetCtrl"
            })
            .state("fondoProgramaDetails", {
                url: "/fondoProgramaDetails/:id",
                templateUrl: "app/CR/fondosPrograma/fondoProgramaDetails.html",
                controller: "FondoProgramaDetailsCtrl"
            })
            .state("fondoProgramaEdit", {
                url: "/fondoProgramaEdit/:id",
                templateUrl: "app/CR/fondosPrograma/fondoProgramaEdit.html",
                controller: "FondoProgramaEditCtrl"
            })
            .state("convocatoriaDetailsByFP", {
                url: "/detallesFondoProgramaC/:id",
                templateUrl: "app/CR/fondosPrograma/convocatoriaDetailsByFP.html",
                controller: "ConvocatoriaDetailsByFPCtrl"
            })
            .state("alumnoGetAll", {
                url: "/Alumnos",
                templateUrl: "app/CR/alumno/alumnoGet.html",
                controller: "AlumnoGetCtrl"
            })
            .state("alumnoAdd", {
                url: "/AlumnosAdd",
                templateUrl: "app/CR/alumno/alumnoAdd.html",
                controller: "AlumnoAddCtrl"
            })
            .state("alumnoEdit", {
                url: "/AlumnosEdit/:id",
                templateUrl: "app/CR/alumno/alumnoEdit.html",
                controller: "AlumnoEditCtrl"
            })
            .state("alumnoDetails", {
                url: "/AlumnosDetails/:id",
                templateUrl: "app/CR/alumno/alumnoDetails.html",
                controller: "AlumnoDetailsCtrl"
            })
            .state("menuItemGet", {
                url: "/UnidadesOrganizacionales",
                templateUrl: "app/CR/menuItem/menuItemGet.html",
                controller: "menuItemGetCtrl"
            })
            .state("convocatoriasGet", {
                url: "/Convocatorias",
                templateUrl: "app/CR/convocatorias/convocatoriasGet.html",
                controller: "ConvocatoriasGetCtrl"
            })
            .state("convocatoriasGetC", {
                url: "/ConvocatoriasC",
                templateUrl: "app/CR/convocatorias/convocatoriasGetConsulta.html",
                controller: "ConvocatoriasGetCtrl"
            })
            .state("convocatoriaDetails", {
                url: "/detallesConvocatoria/:id",
                templateUrl: "app/CR/convocatorias/convocatoriaDetails.html",
                controller: "ConvocatoriaDetailsCtrl"
            })
            .state("convocatoriaEdit", {
                url: "/editarConvocatoria/:id",
                templateUrl: "app/CR/convocatorias/convocatoriaEdit.html",
                controller: "ConvocatoriaEditCtrl"
            })
            .state("convocatoriaAdd", {
                url: "/crearConvocatoria",
                templateUrl: "app/CR/convocatorias/convocatoriaAdd.html",
                controller: "ConvocatoriaAddCtrl"
            })
            .state("personasPartIntGet", {
                url: "/PersonaPartInt",
                templateUrl: "app/CR/personasPartInt/personasPartIntGet.html",
                controller: "PersonasPartIntGetCtrl"
            })
            .state("personasPartIntGetC", {
                url: "/PersonaPartIntC",
                templateUrl: "app/CR/personasPartInt/personasPartIntGetConsulta.html",
                controller: "PersonasPartIntGetCtrl"
            })
            .state("personaPartIntDetails", {
                url: "/detallesPersonaPartInt/:id",
                templateUrl: "app/CR/personasPartInt/personaPartIntDetails.html",
                controller: "PersonaPartIntDetailsCtrl"
            })
            .state("personaPartIntDetailsC", {
                url: "/detallesPersonaPartIntC/:id",
                templateUrl: "app/CR/personasPartInt/personaPartIntDetailsConsulta.html",
                controller: "PersonaPartIntDetailsCtrl"
            })
            .state("personaPartIntEdit", {
                url: "/editarPersonaPartInt/:id",
                templateUrl: "app/CR/personasPartInt/personaPartIntEdit.html",
                controller: "PersonaPartIntEditCtrl"
            })
            .state("personaPartIntAdd", {
                url: "/crearPersonaPartInt",
                templateUrl: "app/CR/personasPartInt/personaPartIntAdd.html",
                controller: "PersonaPartIntAddCtrl"
            })
            .state("gruposColegiadoPartIntGet", {
                url: "/GrupoColegiadoPartInt",
                templateUrl: "app/CR/gruposColegiadoPartInt/gruposColegiadoPartIntGet.html",
                controller: "GruposColegiadoPartIntGetCtrl"
            })
            .state("grupoColegiadoPartIntDetails", {
                url: "/detallesGrupoColegiadoPartInt/:id",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoPartIntDetails.html",
                controller: "GrupoColegiadoPartIntDetailsCtrl"
            })
            .state("gruposColegiadoPartIntGetC", {
                url: "/GrupoColegiadoPartIntC",
                templateUrl: "app/CR/gruposColegiadoPartInt/gruposColegiadoPartIntGetConsulta.html",
                controller: "GruposColegiadoPartIntGetCtrl"
            })
            .state("grupoColegiadoPartIntDetailsC", {
                url: "/detallesGrupoColegiadoPartIntC/:id",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoPartIntDetailsConsulta.html",
                controller: "GrupoColegiadoPartIntDetailsCtrl",
                access:"anonymous"
            })
            .state("grupoColegiadoPartIntEdit", {
                url: "/editarGrupoColegiadoPartInt/:id",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoPartIntEdit.html",
                controller: "GrupoColegiadoPartIntEditCtrl"
            })
            .state("intGrupoColegiadoPartIntDetails", {
                url: "/detallesIntGrupoColegiadoPartInt/:id",
                templateUrl: "app/CR/gruposColegiadoPartInt/intGrupoColegiadoPartIntDetails.html",
                controller: "IntGrupoColegiadoPartIntDetailsCtrl"
            })
            .state("intGrupoColegiadoPartIntEdit", {
                url: "/editarIntGrupoColegiadoPartInt/:id",
                templateUrl: "app/CR/gruposColegiadoPartInt/intGrupoColegiadoPartIntEdit.html",
                controller: "IntGrupoColegiadoPartIntEditCtrl"
            })
            .state("grupoColegiadoPartIntAdd", {
                url: "/crearGrupoColegiadoPartInt",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoPartIntAdd.html",
                controller: "GrupoColegiadoPartIntAddCtrl"
            })
            .state("grupoColegiadoInicio", {
                url: "/inicioGP",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoInicio.html",
                controller: "GruposColegiadosInicioCtrl"
            })
            .state("partesInteresadasAdmInicio", {
                url: "/inicioPIAdm",
                templateUrl: "app/CR/gruposColegiadoPartInt/grupoColegiadoInicioAdm.html",
                controller: "GruposColegiadosInicioAdmCtrl"
            })
            .state("proveedorGet", {
                url: "/Proveedor",
                templateUrl: "app/CR/proveedores/proveedoresGet.html",
                controller: "ProveedoresGetCtrl"
            })
            .state("proveedorDetails", {
                url: "/detallesProveedor/:id",
                templateUrl: "app/CR/proveedores/proveedorDetails.html",
                controller: "ProveedorDetailsCtrl"
            })
            .state("proveedorEdit", {
                url: "/editarProveedor/:id",
                templateUrl: "app/CR/proveedores/proveedorEdit.html",
                controller: "ProveedorEditCtrl"
            })
            .state("proveedorAdd", {
                url: "/crearProveedor",
                templateUrl: "app/CR/proveedores/proveedorAdd.html",
                controller: "ProveedorAddCtrl"
            })
            .state("competidorGet", {
                url: "/Competidor",
                templateUrl: "app/CR/competidores/competidoresGet.html",
                controller: "CompetidoresGetCtrl"
            })
            .state("competidorDetails", {
                url: "/detallescompetidor/:id",
                templateUrl: "app/CR/competidores/competidorDetails.html",
                controller: "CompetidorDetailsCtrl"
            })
            .state("competidorEdit", {
                url: "/editarCompetidor/:id",
                templateUrl: "app/CR/competidores/competidorEdit.html",
                controller: "CompetidorEditCtrl"
            })
            .state("competidorAdd", {
                url: "/crearCompetidor",
                templateUrl: "app/CR/competidores/competidorAdd.html",
                controller: "CompetidorAddCtrl"
            })
            .state("ppsConvocatoriaGet", {
                url: "/PPsConvocatoria",
                templateUrl: "app/CR/ppsConvocatoria/ppsConvocatoriaGet.html",
                controller: "PPsConvocatoriaGetCtrl"
            })
            .state("ppConvocatoriaDetails", {
                url: "/detallesPPConvocatoria/:id",
                templateUrl: "app/CR/ppsConvocatoria/ppConvocatoriaDetails.html",
                controller: "PPConvocatoriaDetailsCtrl"
            })
            .state("ppConvocatoriaEdit", {
                url: "/editarPPConvocatoria/:id",
                templateUrl: "app/CR/ppsConvocatoria/ppConvocatoriaEdit.html",
                controller: "PPConvocatoriaEditCtrl"
            })
            .state("ppConvocatoriaAdd", {
                url: "/crearPPConvocatoria",
                templateUrl: "app/CR/ppsConvocatoria/ppConvocatoriaAdd.html",
                controller: "PPConvocatoriaAddCtrl"
            })
            .state("proyectosEmpresaGet", {
                url: "/proyectosEmpresa",
                templateUrl: "app/CR/proyectosEmpresa/proyectosEmpresaGet.html",
                controller: "ProyectosEmpresaGetCtrl"
            })
            .state("proyectosEmpresaAdd", {
                url: "/asignarProyecto/:id",
                templateUrl: "app/CR/proyectosEmpresa/proyectosEmpresaAdd.html",
                controller: "ProyectosEmpresaAddCtrl"
            })
            .state("propuestasEmpresaGet", {
                url: "/propuestasEmpresa",
                templateUrl: "app/CR/propuestasEmpresa/propuestasEmpresaGet.html",
                controller: "PropuestasEmpresaGetCtrl"
            })
            .state("propuestasEmpresaAdd", {
                url: "/asignarPropuesta/:id",
                templateUrl: "app/CR/propuestasEmpresa/propuestasEmpresaAdd.html",
                controller: "PropuestasEmpresaAddCtrl"
            })
            .state("iniciativasEmpresaGet", {
                url: "/iniciativasEmpresa",
                templateUrl: "app/CR/iniciativasEmpresa/iniciativasEmpresasGet.html",
                controller: "IniciativasEmpresaGetCtrl"
            })
            .state("iniciativasEmpresaAdd", {
                url: "/asignarIniciativa/:id",
                templateUrl: "app/CR/iniciativasEmpresa/iniciativasEmpresaAdd.html",
                controller: "IniciativasEmpresaAddCtrl"
            })
            .state("inicioaliados", {
                url: "/inicioaliados",
                templateUrl: "app/CR/aliados/aliado/inicioaliados.html",
                controller: "inicioaliadosCtrl"
            })
            .state("aliadosGet", {
                url: "/Aliados",
                templateUrl: "app/CR/aliados/aliado/aliadosNoVigentesGet.html",
                controller: "AliadosGetCtrl"
            })
            .state("aliadosVigentesGet", {
                url: "/AliadosVigentes",
                templateUrl: "app/CR/aliados/aliado/aliadosVigentesGet.html",
                controller: "AliadosVigentesGetCtrl",
            })
            .state("aliadoDetails", {
                url: "/detallesAliado/:id",
                templateUrl: "app/CR/aliados/aliado/aliadoDetails.html",
                controller: "AliadoDetailsCtrl"
            })
            .state("aliadoEdit", {
                url: "/editarAliado/:id",
                templateUrl: "app/CR/aliados/aliado/aliadoEdit.html",
                controller: "AliadoEditCtrl"
            })
            .state("aliadoAdd", {
                url: "/crearAliado",
                templateUrl: "app/CR/aliados/aliado/aliadoAdd.html",
                controller: "AliadoAddCtrl"
            })
            .state("conveniosGet", {
                url: "/Convenios",
                templateUrl: "app/CR/aliados/convenios/conveniosGet.html",
                controller: "ConveniosGetCtrl"
            })
            .state("convenioDetails", {
                url: "/detallesConvenio/:id",
                templateUrl: "app/CR/aliados/convenios/convenioDetails.html",
                controller: "ConvenioDetailsCtrl"
            })
            .state("convenioEdit", {
                url: "/editarConvenio/:id",
                templateUrl: "app/CR/aliados/convenios/convenioEdit.html",
                controller: "ConvenioEditCtrl"
            })
            .state("convenioAdd", {
                url: "/crearConvenio/:id",
                templateUrl: "app/CR/aliados/convenios/convenioAdd.html",
                controller: "ConvenioAddCtrl"
            })
            .state("actividadesAdicionalGet", {
                url: "/ActividadesAdicional",
                templateUrl: "app/CR/aliados/actividadesAdicionales/actividadesAdicionalGet.html",
                controller: "ActividadesAdicionalGetCtrl"
            })
            .state("actividadAdicionalDetails", {
                url: "/detallesActividadAdicional/:id",
                templateUrl: "app/CR/aliados/actividadesAdicionales/actividadAdicionalDetails.html",
                controller: "ActividadAdicionalDetailsCtrl"
            })
            .state("actividadAdicionalEdit", {
                url: "/editarActividadAdicional/:id",
                templateUrl: "app/CR/aliados/actividadesAdicionales/actividadAdicionalEdit.html",
                controller: "ActividadAdicionalEditCtrl"
            })
            .state("actividadAdicionalAdd", {
                url: "/crearActividadAdicional/:id",
                templateUrl: "app/CR/aliados/actividadesAdicionales/actividadAdicionalAdd.html",
                controller: "ActividadAdicionalAddCtrl"
            })
            .state("ListaAlianzas", {
                url: "/ListaAlianzas",
                templateUrl: "app/CR/Reportes/reporteAliados.html",
                controller: "reporteAliadosCtrl"
            })
            .state("ResultadosAlianza", {
                url: "/ResultadosAlianza",
                templateUrl: "app/CR/Reportes/reporteResultadosAliadosDetalle.html",
                controller: "reporteResultadosAliadosDetalleCtrl"
            })
            .state("RepProyFF", {
                url: "/RepProyFF",
                templateUrl: "app/CR/Reportes/reporteProyectosFF.html",
                controller: "reporteProyectosCtrl"
            })
            .state("RepPropFF", {
                url: "/RepPropFF",
                templateUrl: "app/CR/Reportes/reportePropuestasFF.html",
                controller: "reportePropuestasCtrl"
            })
            .state("ambitosConvGet", {
                url: "/AmbitosConv",
                templateUrl: "app/CR/ambitosConv/ambitosConvGet.html",
                controller: "AmbitosConvGetCtrl"
            })
            .state("ambitoConvDetails", {
                url: "/detallesAmbitoConv/:id",
                templateUrl: "app/CR/ambitosConv/ambitoConvDetails.html",
                controller: "AmbitoConvDetailsCtrl"
            })
            .state("ambitoConvEdit", {
                url: "/editarAmbitoConv/:id",
                templateUrl: "app/CR/ambitosConv/ambitoConvEdit.html",
                controller: "AmbitoConvEditCtrl"
            })
            .state("ambitoConvAdd", {
                url: "/crearAmbitoConv",
                templateUrl: "app/CR/ambitosConv/ambitoConvAdd.html",
                controller: "AmbitoConvAddCtrl"
            })
            .state("tiposOrganizacionGet", {
                url: "/TiposOrganizacion",
                templateUrl: "app/CR/tiposOrganizacion/tiposOrganizacionGet.html",
                controller: "TiposOrganizacionGetCtrl"
            })
            .state("tipoOrganizacionDetails", {
                url: "/detallesTipoOrganizacion/:id",
                templateUrl: "app/CR/tiposOrganizacion/tipoOrganizacionDetails.html",
                controller: "TipoOrganizacionDetailsCtrl"
            })
            .state("tipoOrganizacionEdit", {
                url: "/editarTipoOrganizacion/:id",
                templateUrl: "app/CR/tiposOrganizacion/tipoOrganizacionEdit.html",
                controller: "TipoOrganizacionEditCtrl"
            })
            .state("tipoOrganizacionAdd", {
                url: "/crearTipoOrganizacion",
                templateUrl: "app/CR/tiposOrganizacion/tipoOrganizacionAdd.html",
                controller: "TipoOrganizacionAddCtrl"
            })
            .state("expertosget", {
                url: "/expertos",
                templateUrl: "app/CR/expertos/expertosGet.html",
                controller: "expertosGetCtrl"
            })
            .state("expertosinvest", {
                url: "/expertosinvest",
                templateUrl: "app/CR/expertos/expertosInvest.html",
                controller: "expertosGetCtrl"
            })
            .state("expertosadd", {
                url: "/expertosadd",
                templateUrl: "app/CR/expertos/expertosAdd.html",
                controller: "expertosAddCtrl"
            })
            .state("expertosedit", {
                url: "/expertosedit/:id",
                templateUrl: "app/CR/expertos/expertosedit.html",
                controller: "expertosEditCtrl"
            })
            .state("expertosdetails", {
                url: "/expertosdetalles/:id",
                templateUrl: "app/CR/expertos/expertosdetails.html",
                controller: "expertosDetailsCtrl"
            })
            .state("estudiosmercado", {
                url: "/estudiosmercado",
                templateUrl: "app/CR/estudiosMercado/estudiosmercadoGet.html",
                controller: "estudiosmercadoCtrlGet"
            })
            .state("estudiomercadoAdd", {
                url: "/agregarestudiomercado",
                templateUrl: "app/CR/estudiosMercado/estudiosmercadoAdd.html",
                controller: "estudiosmercadoCtrlAdd"
            })
            .state("estudiomercadoEdit", {
                url: "/editarestudiomercado/:id",
                templateUrl: "app/CR/estudiosMercado/estudiosmercadoEdit.html",
                controller: "estudiosmercadoCtrlEdit"
            })
            .state("estudiomercadoDetalles", {
                url: "/detallesestudiomercado/:id",
                templateUrl: "app/CR/estudiosMercado/estudiosmercadoDetalles.html",
                controller: "estudiosmercadoCtrlDetalles"
            })
            .state("proyectosvigentes", {
                url: "/proyectosvigentes",
                templateUrl: "app/CR/clientes/proyectosvigentes.html",
                controller: "proyectosvigentesGetCtrl"
            })
            .state("clientesProyectos", {
                url: "/totalProyectos",
                templateUrl: "app/CR/clientes/proyectosGetTotal.html",
                controller: "proyectosGetTotalCtrl"
            })
            .state("clavesEmpresas", {
                url: "/clavesEmpresas",
                templateUrl: "app/CR/empresas/claveEmpresas/claveEmpresasGet.html",
                controller: "ClaveEmpresaGetCtrl"
            })
            .state("propuestasiniciativason", {
                url: "/propuestasiniciativason",
                templateUrl: "app/CR/clientes/propuestasiniciativason.html",
                controller: "propuestasiniciativasonGetCtrl"
            })
            .state("prospectos", {
                url: "/prospectos",
                templateUrl: "app/CR/clientes/prospectos.html",
                controller: "prospectosGetCtrl"
            })
            .state("buscarEmpresas", {
                url: "/buscarEmpresas",
                templateUrl: "app/vistasGenericas/search/empresasComun.html",
                controller: "EmpresasSearchCtrlComun as showCase",
                access: "anonymous"
            })
            .state("detalleEmpresas", {
                url: "/detalleEmpresas/:id",
                templateUrl: "app/vistasGenericas/_details/empresa/EmpresaComunDetails.html",
                controller: "EmpresaDetailsComunCtrl",
                access: "anonymous"
            })
            .state("tituloPersonaGetAll", {
                url: "/tituloPersona",
                templateUrl: "app/CR/tituloPersona/tituloPersonaGet.html",
                controller: "TituloPersonaGetCtrl",
                access: "anonymous"
            })
            .state("tituloPersonaAdd", {
                url: "/crearTituloPersona",
                templateUrl: "app/CR/tituloPersona/tituloPersonaAdd.html",
                controller: "TituloPersonaAddCtrl",
                access: "anonymous"
            })
            .state("tituloPersonaEdit", {
                url: "/editarTituloPersona/:id",
                templateUrl: "app/CR/tituloPersona/tituloPersonaEdit.html",
                controller: "TituloPersonaEditCtrl",
                access: "anonymous"
            })
            .state("detallePersonal", {
             url: "/detallePersonal/:id",
             templateUrl: "app/vistasGenericas/_details/personal/PersonalComunDetails.html",
             controller: "loadDetallePersonalCtrl",
             access: "anonymous"
            })
            .state("consultaConvenios", {
                url: "/consultaConvenios",
                templateUrl: "app/CR/aliados/convenios/consultaConvenios.html",
                controller: "ConsultaConveniosCtrl",
            })
           
        ;

    };
})();
