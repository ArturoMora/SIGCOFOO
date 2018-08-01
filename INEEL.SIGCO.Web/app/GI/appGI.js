//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function () {
    "use strict";

    angular
        .module("ineelGI", ['ui.router',
            'ui.bootstrap',
            'LocalStorageModule',
            'ineel.GI.services',
            'ineel.services',
            'ineel.GEN.services',
            'datatables',
            'GlobalINEEL',
            'angucomplete-alt',
            'datatables.buttons',
            'ui.tree',
            'blockUI',
            'directivasSIGCO',
            'mdo-angular-cryptography',
            "ngSanitize",
            'ineel.controllers',
            'ngTagsInput',
            'ngFabForm',
            'ngMessages'

        ])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        })

        .filter('BlackListOC', function () {
            return function (oCsRolesBlackList, idRol) {
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
            };
        })
        .filter('encriptar', function (DescargasService) {
            return function (x) {
                return DescargasService.encriptar(x);
            };
        })

        .config(function (blockUIConfig) {
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
            blockUIConfig.requestFilter = function (config) {                
                if (config.url.indexOf("block=no") > 0) {
                    return false; // ... don't block it.
                }               
            };
        })
        .config(["$stateProvider", "$urlRouterProvider", RouterProvider])
        .run(function (DTDefaultOptions) {
            DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
            DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
            DTDefaultOptions.setOption('searchHighlight', 'true');
            DTDefaultOptions.setOption('bStateSave', true);
            DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
            DTDefaultOptions.setDisplayLength(5);
        })
        .run(function ($rootScope, $location, AuthService, MenuService, PermisosService, $window, $state, $uibModal) {
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
            $rootScope.datePicker06 = RangoDeFechaStart(); //default 2006
            $rootScope.setGlobalGo = function (id) {
                $state.go(id);
            }
            $rootScope.setGlobalID = function (id) {
                MenuService.setGlobalID(id);
            }
            $rootScope.getGlobalID = function () {
                return MenuService.getGlobalID();
            }
            $rootScope.setVariable = function (clave, value) {
                MenuService.setVariable(clave, value);
            }
            $rootScope.getVariable = function (clave) {
                return MenuService.getVariable(clave);
            }

            $rootScope.setOrigen = function (id) {
                MenuService.setOrigen(id);
            }
            $rootScope.getOrigen = function () {
                return MenuService.getOrigen();
            }

            $rootScope.setGlobalID2 = function (id) {
                MenuService.setGlobalID2(id);
            }
            $rootScope.getGlobalID2 = function () {
                return MenuService.getGlobalID2();
            }
            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
                if ($rootScope.datePicker != undefined && $rootScope.datePicker != null) {
                    if ($rootScope.datePicker.FechaOptions != null) {
                        $rootScope.datePicker.FechaOptions.datepickerMode = 'year';
                    }
                }

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

                    //if (!AuthService.authentication.isAuth) {
                    if ($rootScope.usuarioLogueado == false) {
                        try {
                            to.url = to.url.replace(":id2", toParams.id2);
                            to.url = to.url.replace(":id", toParams.id);
                        } catch (ex) { }
                        console.log("/indexGI.html#" + to.url);
                        MenuService.setReturnUrl("/indexGI.html#" + to.url);
                        window.location = "/index.html#/login";
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
                    var permitir = PermisosService.verificaPermisos(next, 'GI');
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
            });

        })
        .config(function (ngFabFormProvider) {
            ngFabFormProvider.extendConfig({
                validationsTemplate: 'app/vistasGenericas/validacionesTemplate/DefaultMessagesValidation.html'
            });
        });



    function RouterProvider($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("home",
            {
                url: "/home",
                templateUrl: "app/GI/home/homeGI.html",
                controller: "homeCtrlGI"
                //, access: "anonymous"
            })
            .state("buscarIdeaInnovadora", {
                url: "/buscarIdeaInnovadora",
                templateUrl: "app/GI/ideaInnovadora/buscarIdea/buscarIdeaInnovadoraGet.html",
                controller: "buscarIdeaInnovadoraGet"
            })
            .state("buscarIdeaInnovadoraDetalles", {
                url: "/buscarIdeaInnovadoraDetalles/:id",
                templateUrl: "app/GI/ideaInnovadora/buscarIdea/buscarIdeaInnovadoraDetails.html",
                controller: "buscarIdeaInnovadoraDetails"
                //access: "anonymous"
            })
            .state("ideaInnovadora", {
                url: "/ideaInnovadora",
                templateUrl: "app/GI/ideaInnovadora/ideaInnovadoraGet.html",
                controller: "ideaInnovadoraGet"
            })
            .state("ideaInnovadoraAdd", {
                url: "/agregarIdeaInnovadora",
                templateUrl: "app/GI/ideaInnovadora/ideaInnovadoraAdd.html",
                controller: "ideaInnovadoraAdd"
            })
            .state("ideaInnovadoraEdit", {
                url: "/editarIdeaInnovadora",
                templateUrl: "app/GI/ideaInnovadora/ideaInnovadoraEdit.html",
                controller: "ideaInnovadoraEdit"
            })
            .state("ideaInnovadoraDetails", {
                url: "/detallesIdeaInnovadora/:id",
                templateUrl: "app/GI/ideaInnovadora/ideaInnovadoraDetails.html",
                controller: "ideaInnovadoraDetails"
            })
            .state("ideaInnovadoraDetailsPersonal", {
                url: "/detallePersonalIdeaInnovadora/:id",
                templateUrl: "app/GI/ideaInnovadora/ideaInnovadoraDetailsPersona.html",
                controller: "ideaInnovadoraDetailsPersona"
            })
            .state("solicitudesGI",
            {
                url: "/solicitudesGI",
                templateUrl: "app/GI/solicitudesGI/solicitudesGI.html",
                controller: "solicitudesGI"
            })
            .state("validacion",
            {
                url: "/validacion",
                templateUrl: "app/GI/ejemploValidacion/ejemploValidacion.html",
                controller: "ejemploValidacionCtrlGI"

            })
        .state("bitacoraSolicitudesGI", {
            url: "/bitacorasolicitudesGI/:id/:id2",
            templateUrl: "app/GI/bitacoraSolicitudes/bitacorasolicitudes.html",
            controller: "bitacoraSolicitudes"
            })
            .state("carteraPropuestas", {
                url: "/carteraPropuestas",
                templateUrl: "app/GI/CarteraPropuesta/carteraPropuestaGet.html",
                controller: "carteraPropuestaGet"
            })
            .state("carteraPropuestasDetails", {
                url: "/detallescarteraPropuestas/:id",
                templateUrl: "app/GI/carteraPropuesta/carteraPropuestaDetails.html",
                controller: "carteraPropuestaDetail"
            })

        .state("carteraPropuestaAdd", {
            url: "/agregarCarteraPropuesta",
            templateUrl: "app/GI/CarteraPropuesta/carteraPropuestaAdd.html",
            controller: "carteraPropuestaAdd"
            //access: "anonymous"
        })
        .state("carteraPropuestaEdit", {
            url: "/editarcarterapropuesta",
            templateUrl: "app/GI/CarteraPropuesta/carteraPropuestaEdit.html",
            controller: "carteraPropuestaEdit"
        })
        .state("buscarPropuestas", {
            url: "/buscarPropuestas",
            templateUrl: "app/GI/CarteraPropuesta/buscarPropuesta/buscarPropuestaGet.html",
            controller: "buscarPropuestaGet"
        })
        .state("buscarPropuestasDetails", {
            url: "/detallesbuscarPropuestas/:id",
            templateUrl: "app/GI/carteraPropuesta/buscarPropuesta/buscarPropuestaDetail.html",
            controller: "buscarPropuestaDetail"
        })
        .state("planNegocioAdd", {
            url: "/agregarPlanNegocio",
            templateUrl: "app/GI/planNegocioEvolutivo/planNegocioAdd.html",
            controller: "planNegocioAdd"
        })
        .state("planNegocioEvolutivo", {
            url: "/planNegocioEvolutivo",
            templateUrl: "app/GI/planNegocioEvolutivo/planNegocioGet.html",
            controller: "planNegocioGet"
        })
        .state("planNegocioEdit", {
            url: "/editarPlanNegocio",
            templateUrl: "app/GI/planNegocioEvolutivo/planNegocioEdit.html",
            controller: "planNegocioEdit"
        })
        .state("planNegocioDetails", {
            url: "/detallesPlanNegocio/:id",
            templateUrl: "app/GI/planNegocioEvolutivo/planNegocioDetails.html",
            controller: "planNegocioDetail"
        })
        .state("buscarplanNegocio", {
            url: "/buscarPlanNegocio",
            templateUrl: "app/GI/planNegocioEvolutivo/buscarPlanNegocio/buscarPlanNegocio.html",
            controller: "buscarPlanNegocio"
        })
        .state("buscarplanNegocioDetails", {
            url: "/detallePlanNegocio/:id",
            templateUrl: "app/GI/planNegocioEvolutivo/buscarPlanNegocio/buscarPlanNegocioDetalles.html",
            controller: "buscarplanNegocioDetail"            
        })
        .state("bitacoraMovimientos", {
            url: "/bitacoraMovimientos/:id/:id2",
            templateUrl: "app/GI/bitacoraMovimientos/bitacoraMovimientos.html",
            controller: "bitacoraMovimientos"
        })
        .state("productoInnovador", {
            url: "/productoInnovador",
            templateUrl: "app/GI/productosInnovadores/productoInnovadorGet.html",
            controller: "productoInnovadorGet"
        })
        .state("productoInnovadorAdd", {
            url: "/agregarproductoInnovador",
            templateUrl: "app/GI/productosInnovadores/productoInnovadorAdd.html",
            controller: "productoInnovadorAdd"
        })
        .state("productoInnovadorDetails", {
            url: "/detallesproductoInnovador/:id",
            templateUrl: "app/GI/productosInnovadores/productoInnovadorDetails.html",
            controller: "productoInnovadorDetails"
        })
        .state("productoInnovadorEdit", {
            url: "/editarproductoInnovador/:id",
            templateUrl: "app/GI/productosInnovadores/productoInnovadorEdit.html",
            controller: "productoInnovadorEdit"
        })
        .state("buscarProductoInnovador", {
            url: "/buscarProductoInnovador",
            templateUrl: "app/GI/productosInnovadores/buscarProductoInnovador/buscarProductoInnovador.html",
            controller: "buscarProductoInnovador"
        })
        .state("buscarproductoInnovadorDetails", {
            url: "/detalleProductoInnovador/:id",
            templateUrl: "app/GI/productosInnovadores/buscarProductoInnovador/buscarProductoInnovadorDetails.html",
            controller: "buscarProductoInnovadorDetails"
        })
        .state("productoInnovadorDetailsGerente", {
            url: "/detallesProductoInnovadorG/:id",
            templateUrl: "app/GI/productosInnovadores/detallesGerente/productoInnovadorDetailsGerente.html",
            controller: "productoInnovadorDetailsGerente"
        })
        .state("tecnologiaLicenciaAdd", {
            url: "/agregarTecnologiaLicenciada",
            templateUrl: "app/GI/TecnologiaLicencia/tecnologiaLicenciadaAdd.html",
            controller: "tecnologiaLicenciadaAdd"
        })
        .state("tecnologiaLicenciada", {
            url: "/tecnologiaLicenciada",
            templateUrl: "app/GI/TecnologiaLicencia/tecnologiaLicenciadaGet.html",
            controller: "tecnologiaLicenciada"
        })
        .state("tecnologiaLicenciadaDetails", {
            url: "/detallestecnologiaLicenciada/:id",
            templateUrl: "app/GI/TecnologiaLicencia/tecnologiaLicenciadaDetails.html",
            controller: "tecnologiaLicenciadaDetails"
        })
        .state("tecnologiaLicenciadaEdit", {
            url: "/editartecnologiaLicenciada/:id",
            templateUrl: "app/GI/TecnologiaLicencia/tecnologiaLicenciadaEdit.html",
            controller: "tecnologiaLicenciadaEdit"
        })
        .state("buscarTecnologiaLicenciada", {
            url: "/buscartecnologiaLicenciada",
            templateUrl: "app/GI/TecnologiaLicencia/buscarTecnologiaLicenciada/buscarTecnologiaLicenciadaGet.html",
            controller: "buscarTecnologiaLicenciada"
        })
            .state("tecnologiaLicenciadaEditConstant", {//url: "/detalletecnologiaLicenciada/:id",
            url: "/editarDetalletecnologiaLicenciada/:id",
            templateUrl: "app/GI/TecnologiaLicencia/updateTL/tecnologiaLicenciadaEditConstant.html",
            controller: "tecnologiaLicenciadaEditConstant"
            })
            .state("tecnologiaLicenciadaEditAll", {
                url: "/tecnologiaLicenciadaEditAll/:id",
                templateUrl: "app/GI/TecnologiaLicencia/updateTL/tecnologiaLicenciadaEditAll.html",
                controller: "tecnologiaLicenciadaEditAll"
                ,access: "anonymous"
            })
        .state("tecnologiaLicenciadaDetailsGAJ", {
            url: "/detallestecnologiasLicenciadas/:id",
            templateUrl: "app/GI/TecnologiaLicencia/tecnologiaLicenciadaDetailsGAJ.html",
            controller: "tecnologiaLicenciadaDetailsGAJ"
        })
        .state("configuracionPeriodo", {
            url: "/configuracionPeriodo",
            templateUrl: "app/GI/configuracionPeriodo/configuracionPeriodoGet.html?block=no",
            controller: "configuracionPeriodo"
        })
        .state("configuracionPeriodoAdd", {
            url: "/agregarConfiguracionPeriodo",
            templateUrl: "app/GI/configuracionPeriodo/configuracionPeriodoAdd.html",
            controller: "configuracionPeriodoAdd"
        })
        .state("configuracionPeriodoEdit", {
            url: "/editarConfiguracionPeriodo/:id",
            templateUrl: "app/GI/configuracionPeriodo/configuracionPeriodoEdit.html",
            controller: "configuracionPeriodoEdit"
        })
        .state("productoFI", {
            url: "/productoFI",
            templateUrl: "app/GI/productosInnovadores/productoFI/productoFIGet.html",
            controller: "productoFI"
        })
        .state("solicitudFIAgregar", {
            url: "/agregarsolicitudFI",
            templateUrl: "app/GI/productosInnovadores/productoFI/productoFIAdd.html",
            controller: "solicitudFIAgregar",
            // access: "anonymous"
        })
        .state("solicitudFIDetalles", {
            url: "/detallesSolicitudFI/:id",
            templateUrl: "app/GI/productosInnovadores/productoFI/productoFIDetails.html",
            controller: "solicitudFIDetalles"
        })
            .state("solicitudFIEditar", {
                url: "/editarSolicitudFI/:id",
                templateUrl: "app/GI/productosInnovadores/productoFI/productoFIEditar.html",
                controller: "solicitudFIEditar"
            })
        .state("productoInnovadorDetailsEvaluador", {
            url: "/detallesProductoInnovadorE/:id",
            templateUrl: "app/GI/productosInnovadores/detallesEvaluador/productoInnovadorDetailsEvaluador.html",
            controller: "productoInnovadorDetailsEvaluador"
        })
         .state("productoRegistro", {
             url: "/detallesProductoRegistrar/:id",
             templateUrl: "app/GI/productosInnovadores/aprobarDetalles/productoRegistroDetalles.html",
             controller: "productoRegistro"
         })
        .state("creafin", {
            url: "/creafin",
            templateUrl: "app/GI/CREAFIN/creafin.html",
            controller: "creafin"
        })
        .state("tipoPago", {
            url: "/catalogos/tipoPago",
            templateUrl: "app/GI/Catalogos/TipoPagos/TipoPagosGet.html",
            controller: "tipoPago"
        })
        .state("miembrosGI", {
             url: "/miembrosGI",
             templateUrl: "app/GI/Catalogos/MiembrosGI/MiembrosGIGet.html",
             controller: "MiembrosGIGet"
        })
         .state("miembrosGIAdd", {
             url: "/agregaMiembrosGI",
             templateUrl: "app/GI/Catalogos/MiembrosGI/MiembrosGIAdd.html",
             controller: "MiembrosGIAdd"
         })
        .state("miembrosInactivosGI", {
            url: "/miembrosInactivosGI/:id",
            templateUrl: "app/GI/Catalogos/MiembrosGI/MiembrosInactivosGIGet.html",
            controller: "MiembrosInactivosGIGet"
        })
        .state("tipoPagoEdit", {
            url: "/catalogos/editarTipoPago/:id",
            templateUrl: "app/GI/Catalogos/TipoPagos/TipoPagosEdit.html",
            controller: "tipoPagoEdit"
        })
        .state("tipoPagoAgregar", {
            url: "/catalogos/agregarTipoPago",
            templateUrl: "app/GI/Catalogos/TipoPagos/TipoPagosAdd.html",
            controller: "tipoPagoAgregar"
        })
        .state("tipoAcceso", {
            url: "/catalogos/tipoAcceso",
            templateUrl: "app/GI/Catalogos/TipoAcceso/TipoAccesoGet.html",
            controller: "tipoAcceso"
        })
        .state("tipoAccesoEdit", {
            url: "/catalogos/editarTipoAcceso/:id",
            templateUrl: "app/GI/Catalogos/TipoAcceso/TipoAccesoEdit.html",
            controller: "tipoAccesoEdit"
        })
        .state("factorInnovacion", {
            url: "/catalogos/factorInnovacion",
            templateUrl: "app/GI/Catalogos/FactorInnovacion/FactorInnovacionGet.html",
            controller: "factorInnovacion"
        })
        .state("factorInnovacionEdit", {
            url: "/catalogos/editarFactorInnovacion/:id",
            templateUrl: "app/GI/Catalogos/FactorInnovacion/FactorInnovacionEdit.html",
            controller: "factorInnovacionEdit"
        })
        .state("estadoLicenciamiento", {
            url: "/catalogos/estadoLicenciamiento",
            templateUrl: "app/GI/Catalogos/EstadoLicenciamiento/EstadoLicenciamientoGet.html",
            controller: "estadoLicenciamiento"
        })
        .state("estadoLicenciamientoEdit", {
            url: "/catalogos/editarEstadoLicenciamiento/:id",
            templateUrl: "app/GI/Catalogos/EstadoLicenciamiento/EstadoLicenciamientoEdit.html",
            controller: "estadoLicenciamientoEdit"
        })
        .state("comite", {
            url: "/catalogos/comite",
            templateUrl: "app/GI/Catalogos/Comite/ComiteGet.html",
            controller: "comite"
        })
        .state("comiteEdit", {
            url: "/catalogos/editarComite/:id",
            templateUrl: "app/GI/Catalogos/Comite/ComiteEdit.html",
            controller: "comiteEdit"
        })
        .state("comiteAdd", {
            url: "/catalogos/agregarComite",
            templateUrl: "app/GI/Catalogos/Comite/ComiteAdd.html",
            controller: "comiteAdd"
        })
        ;
    };

})();
