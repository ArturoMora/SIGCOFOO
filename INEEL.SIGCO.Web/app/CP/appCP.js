//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function() {
    "use strict";

    angular
        .module("ineelCP", ['ui.router',
            'ui.bootstrap',
            'LocalStorageModule',
            'ineel.CP.services',
            'ineel.services',
            'ineel.GEN.services',
            'datatables',
            'angularFileUpload',
            'GlobalINEEL',
            'angucomplete-alt',
            'datatables.buttons',
            'ui.tree',
            'blockUI',
            'directivasSIGCO',
            'mdo-angular-cryptography',
            "ngSanitize",
            'ineel.controllers',
            'uiSwitch',
            'ngTagsInput',
            'infinite-scroll',
            'ui.select',
            'textAngular'

        ])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
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
                //Perform a global, case-insensitive search on the request url for 'noblockui' ...
                //
                if (config.url.indexOf("/coun") > 0) {
                    return false; // ... don't block it.
                }
                blockUIConfig.requestFilter = function (config) {
                    if (config.url.indexOf("block=no") > 0) {
                        return false; // ... don't block it.
                    }
                };
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
                try {
                    
                    if ($window.history.length == 1) {
                        $state.go("home");
                    } else
                        $window.history.back();
                } catch (e) {
                    
                    $state.go("home");
                }
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
                        MenuService.setReturnUrl("/indexCP.html#" + to.url);
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
                    var permitir = PermisosService.verificaPermisos(next, 'CP');
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

        });

    function RouterProvider($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("home",
            {
                url: "/home",
                templateUrl: "app/CP/home/homeCP.html",
                controller: "CargaControllerCP"

            })
            .state("categoriasCPGetAll",
            {
                url: "/categoriasComunidades",
                templateUrl: "app/CP/categoriaCP/categoriaCPGet.html",
                controller: "CategoriaCPGetCtrl"

            })
            .state("categoriasCPCreate",
            {
                url: "/crearCategoriaCP",
                templateUrl: "app/CP/categoriaCP/categoriaCPAdd.html",
                controller: "CategoriaCPAddCtrl"

            })
            .state("categoriasCPEdit",
            {
                url: "/editarCategoria/:id",
                templateUrl: "app/CP/categoriaCP/categoriaCPEdit.html",
                controller: "CategoriaCPEditCtrl"

            })
            .state("categoriaSitioGetAll",
            {
                url: "/categoriaSitios",
                templateUrl: "app/CP/categoriaSitio/categoriaSitioGet.html",
                controller: "CategoriaSitioGetCtrl"

            })
            .state("categoriaSitioCreate",
            {
                url: "/crearCategoriaSitio",
                templateUrl: "app/CP/categoriaSitio/categoriaSitioAdd.html",
                controller: "CategoriaSitioAddCtrl"

            })
            .state("categoriaSitioEdit",
            {
                url: "/editarCategoriaSitio/:id",
                templateUrl: "app/CP/categoriaSitio/categoriaSitioEdit.html",
                controller: "CategoriaSitioEditCtrl"

            })
            .state("ListaOcGetAll",
            {
                url: "/listaOcs",
                templateUrl: "app/CP/ListaOC/ListaOcGet.html",
                controller: "ListaOCGetCtrl"

            })
            .state("ListaOcCreate",
            {
                url: "/crearListaOC",
                templateUrl: "app/CP/ListaOC/ListaOcAdd.html",
                controller: "ListaOCAddCtrl"

            })
            .state("ListaOcEdit",
            {
                url: "/editarListaOC/:id",
                templateUrl: "app/CP/ListaOC/ListaOcEdit.html",
                controller: "ListaOCEditCtrl"

            })
            .state("RolesCPGetAll",
            {
                url: "/rolesComunidad",
                templateUrl: "app/CP/RolesCP/rolesComunidadGet.html",
                controller: "RolesCPGetCtrl"

            })
            .state("RolesCPCreate",
            {
                url: "/crearRolCP",
                templateUrl: "app/CP/RolesCP/rolesComunidadAdd.html",
                controller: "RolesCPAddCtrl"

            })
            .state("RolesCPEdit",
            {
                url: "/editarRolesCP/:id",
                templateUrl: "app/CP/RolesCP/rolesComunidadEdit.html",
                controller: "RolesCPEditCtrl"

            })
            .state("TipoDocumentoGetAll",
            {
                url: "/tiposDocumento",
                templateUrl: "app/CP/tipoDocumento/tipoDocumentoGet.html",
                controller: "TipoDocumentoGetCtrl"

            })
            .state("TipoDocumentoCreate",
            {
                url: "/crearTipoDocumento",
                templateUrl: "app/CP/tipoDocumento/tipoDocumentoAdd.html",
                controller: "TipoDocumentoAddCtrl"

            })
            .state("TipoDocumentoEdit",
            {
                url: "/editarTipoDocumento/:id",
                templateUrl: "app/CP/tipoDocumento/tipoDocumentoEdit.html",
                controller: "TipoDocumentoEditCtrl"

            })
            .state("TipoLineamientoGetAll",
            {
                url: "/tiposLineamientos",
                templateUrl: "app/CP/tipoLineamiento/tipoLineamientoGet.html",
                controller: "TipoLineamientoGetCtrl"

            })
            .state("TipoLineamientoCreate",
            {
                url: "/crearTipoLineamiento",
                templateUrl: "app/CP/tipoLineamiento/tipoLineamientoAdd.html",
                controller: "TipoLineamientoAddCtrl"

            })
            .state("TipoLineamientoEdit",
            {
                url: "/editarTipoLineamiento/:id",
                templateUrl: "app/CP/tipoLineamiento/tipoLineamientoEdit.html",
                controller: "TipoLineamientoEditCtrl"

            })
            .state("MapasRutaGetAll",
            {
                url: "/mapasRuta/:id",
                templateUrl: "app/CP/mapasRuta/mapasRutaGet.html",
                controller: "MapasRutaGetCtrl"
            })
            .state("MapasRutaCreate",
            {
                url: "/crearMapasRuta/:id",
                templateUrl: "app/CP/mapasRuta/mapasRutaAdd.html",
                controller: "MapasRutaAddCtrl"

            })
            .state("MapasRutaEdit",
            {
                url: "/editarMapasRuta/:id",
                templateUrl: "app/CP/mapasRuta/mapasRutaEdit.html",
                controller: "MapasRutaEditCtrl"

            })
            .state("MapasRutaDetails",
            {
                url: "/detallesMapaRuta/:id",
                templateUrl: "app/CP/mapasRuta/mapasRutaDetails.html",
                controller: "MapasRutaDetailsCtrl"

            })

            .state("comunidadesGet",
            {
                url: "/comunidades",
                templateUrl: "app/CP/Comunidades/ComunidadesCPGet.html",
                controller: "ComunidadesCPGetCtrl"
            })
            .state("otrascomunidadesGet",
            {
                url: "/otrascomunidades",
                templateUrl: "app/CP/Comunidades/OtrasComunidadesCPGet.html",
                controller: "otrascomunidadesCPGetCtrl"
            })
            .state("comunidadesAdd",
            {
                url: "/comunidadesAdd",
                templateUrl: "app/CP/Comunidades/ComunidadesCPAdd.html",
                controller: "ComunidadesCPAddCtrl"

            })
            .state("comunidadesEdit",
            {
                url: "/comunidadesEdit/:id",
                templateUrl: "app/CP/Comunidades/ComunidadesCPEdit.html",
                controller: "ComunidadesCPEditCtrl"
            })
            .state("miembrosGet",
            {
                url: "/miembros",
                templateUrl: "app/CP/Miembros/MiembrosCPGet.html",
                controller: "MiembrosCPGetCtrl"
            })
            .state("miembrosAdd",
            {
                url: "/miembrosAdd",
                templateUrl: "app/CP/Miembros/MiembrosCPAdd.html",
                controller: "MiembrosCPAddCtrl"

            })
            .state("miembrosEdit",
            {
                url: "/Miembros/:id",
                templateUrl: "app/CP/Miembros/MiembrosCPEdit.html",
                controller: "MiembrosCPEditCtrl"
            })
            .state("EstadoArteGetAll",
            {
                url: "/estadoArte/:id",
                templateUrl: "app/CP/estadoArte/estadoArteGet.html",
                controller: "EstadoArteGetCtrl"
            })
            .state("EstadoArteCreate",
            {
                url: "/crearEstadoArte/:id",
                templateUrl: "app/CP/estadoArte/estadoArteAdd.html",
                controller: "EstadoArteAddCtrl"
            })
            .state("EstadoArteEdit",
            {
                url: "/editarEstadoArte/:id",
                templateUrl: "app/CP/estadoArte/estadoArteEdit.html",
                controller: "EstadoArteEditCtrl"
            })
            .state("EstadoArteDetails",
            {
                url: "/detallesEstadoArte/:id",
                templateUrl: "app/CP/estadoArte/estadoArteDetails.html",
                controller: "EstadoArteDetailsCtrl"
            })
            .state("EstudiosEspecializadosGetAll",
            {
                url: "/estudiosEspecializados/:id",
                templateUrl: "app/CP/estudiosEspecializados/estudiosEspGet.html",
                controller: "EstudiosEspecializadosGetCtrl"
            })
            .state("EstudiosEspecializadosCreate",
            {
                url: "/crearEstudios/:id",
                templateUrl: "app/CP/estudiosEspecializados/estudiosEspAdd.html",
                controller: "EstudiosEspecializadosAddCtrl"
            })
            .state("EstudiosEspecializadosEdit",
            {
                url: "/editarEstudios/:id",
                templateUrl: "app/CP/estudiosEspecializados/estudiosEspEdit.html",
                controller: "EstudiosEspecializadosEditCtrl"
            })
            .state("EstudiosEspecializadosDetails",
            {
                url: "/detallesEstudios/:id",
                templateUrl: "app/CP/estudiosEspecializados/estudiosEspDetails.html",
                controller: "EstudiosEspecializadosDetailsCtrl"
            })
             .state("TemasInnovacionGetAll",
            {
                url: "/temasInnovacion/:id",
                templateUrl: "app/CP/temasInnovacion/temasInnovacionGet.html",
                controller: "TemasInnovacionGetCtrl"
            })
            .state("TemasInnovacionCreate",
            {
                url: "/crearTemas/:id",
                templateUrl: "app/CP/temasInnovacion/temasInnovacionAdd.html",
                controller: "TemasInnovacionAddCtrl"
            })
            .state("TemasInnovacionEdit",
            {
                url: "/editarTemas/:id",
                templateUrl: "app/CP/temasInnovacion/temasInnovacionEdit.html",
                controller: "TemasInnovacionEditCtrl"
            })
            .state("TemasInnovacionDetails",
            {
                url: "/detallesTemas/:id",
                templateUrl: "app/CP/temasInnovacion/temasInnovacionDetails.html",
                controller: "TemasInnovacionDetailsCtrl"
            })
            .state("InformeAnualGetAll",
            {
                url: "/informeAnual/:id",
                templateUrl: "app/CP/informeAnual/informeAnualGet.html",
                controller: "InformeAnualGetCtrl"
            })
            .state("InformeAnualCreate",
            {
                url: "/crearinformeAnual/:id",
                templateUrl: "app/CP/informeAnual/informeAnualAdd.html",
                controller: "InformeAnualAddCtrl"
            })
            .state("InformeAnualEdit",
            {
                url: "/editarinformeAnual/:id",
                templateUrl: "app/CP/informeAnual/informeAnualEdit.html",
                controller: "InformeAnualEditCtrl"
            })
            .state("InformeAnualDetails",
            {
                url: "/detallesinformeAnual/:id",
                templateUrl: "app/CP/informeAnual/informeAnualDetails.html",
                controller: "InformeAnualDetailsCtrl"
            })
            .state("PlanAnualGetAll",
            {
                url: "/planAnual/:id",
                templateUrl: "app/CP/planAnual/planAnualGet.html",
                controller: "PlanAnualGetCtrl"
            })
            .state("PlanAnualCreate",
            {
                url: "/crearPlanAnual/:id",
                templateUrl: "app/CP/planAnual/planAnualAdd.html",
                controller: "PlanAnualAddCtrl"
            })
            .state("PlanAnualEdit",
            {
                url: "/editarPlanAnual/:id",
                templateUrl: "app/CP/planAnual/planAnualEdit.html",
                controller: "PlanAnualEditCtrl"
            })
            .state("PlanAnualDetails",
            {
                url: "/detallesPlanAnual/:id",
                templateUrl: "app/CP/planAnual/planAnualDetails.html",
                controller: "PlanAnualDetailsCtrl"
            })
            .state("homeComunidad",
            {
                url: "/homeComunidad/:id",
                templateUrl: "app/CP/homeComunidad/homeComunidad.html",
                controller: "HomeComunidadGetCtrl"
            })
            .state("inicio",
            {
                url: "/inicio",
                templateUrl: "app/CP/homeComunidad/inicio.html",
                controller: "InicioComunidadGetCtrl",
                parent: 'homeComunidad'
            })
            .state("documentos",
            {
                url: "/documentos",
                templateUrl: "app/CP/homeComunidad/documentos.html",
                controller: "DocumentosComunidadGetCtrl"
            })
            .state("resultados",
            {
                url: "/resultados",
                templateUrl: "app/CP/homeComunidad/resultadosCP.html",
                controller: "DocumentosComunidadGetCtrl"
            })
            .state("expertos",
            {
                url: "/expertos",
                templateUrl: "app/CP/homeComunidad/expertosCP.html",
                controller: "ExpertosComunidadCtrl"
            })
            .state("miembros",
            {
                url: "/miembros",
                templateUrl: "app/CP/homeComunidad/miembrosCP.html",
                controller: "MiembrosComunidadCtrl"
            })
            .state("eventos",
            {
                url: "/eventos",
                templateUrl: "app/CP/homeComunidad/eventosCP.html",
                controller: "EventosComunidadCtrl"
            })
            .state("objetos",
            {
                url: "/objetosConocimiento",
                templateUrl: "app/CP/homeComunidad/objetosConocimiento.html",
                controller: "ObjetosComunidadCtrl"
            })
            .state("GestionLineamientos",
            {
                url: "/gestionLineamientos",
                templateUrl: "app/CP/gestionLineamientosComunidad/LineamientosComunidad.html",
                controller: "LineamientosComunidadCtrl"
            })
            .state("LineamientosEdit",
            {
                url: "/editarLineamientoComunidad/:id",
                templateUrl: "app/CP/gestionLineamientosComunidad/EditarLineamientoComunidad.html",
                controller: "EditarLineamientoComunidadCtrl"
            })
            .state("LineamientosCreate",
            {
                url: "/crearLineamientoComunidad",
                templateUrl: "app/CP/gestionLineamientosComunidad/AgregarLineamientoComunidad.html",
                controller: "AgregarLineamientoComunidadCtrl"
            })
            .state("ConsultaLineamientos",
            {
                url: "/consultaLineamientos/:id",
                templateUrl: "app/CP/consultaLineamientos/consultaLineamientosComunidad.html",
                controller: "ConsultaLineamientosComunidadCtrl"
            })
            .state("ComentariosLineamientosCreate",
            {
                url: "/crearComentarioLineamientoComunidad/:id",
                templateUrl: "app/CP/consultaLineamientos/AgregaComentariosLineamientos.html",
                controller: "AgregaComentariosLineamientosCtrl"
            })
            .state("ConsultaComentariosLineamientos",
            {
                url: "/comentariosLineamientoComunidad/:id",
                templateUrl: "app/CP/consultaLineamientos/ComentariosLineamientos.html",
                controller: "ComentariosLineamientoComunidadCtrl"
            })
            .state("consultaCP",
            {
                url: "/informacioncp",
                templateUrl: "app/CP/Consultas/consultaGet.html",
                controller: "consultaCPGetCtrl"
            })
            .state("ConsultaMapasRuta",
            {
                url: "/consultaMapasRuta",
                templateUrl: "app/CP/consultasOCs/mapasRuta/mapasRutaGet.html",
                controller: "MapasRutaGetConsultaCtrl"
            })
            .state("ConsultaEstadoArte",
            {
                url: "/consultaEstadoArte",
                templateUrl: "app/CP/consultasOCs/estadoArte/estadoArteGetConsulta.html",
                controller: "EstadoArteGetConsultaCtrl"
            })
            .state("ConsultaEstudiosEspecializados",
            {
                url: "/consultaEstudiosEspecializados",
                templateUrl: "app/CP/consultasOCs/estudiosEspecializados/estudiosEspGetConsulta.html",
                controller: "EstudiosEspecializadosGetConsultaCtrl"
            })
            .state("ConsultaInformeAnual",
            {
                url: "/consultaInformeAnual",
                templateUrl: "app/CP/consultasOCs/informesAnuales/informeAnualGetConsulta.html",
                controller: "InformeAnualGetConsultaCtrl"
            })
            .state("ConsultaPlanAnual",
            {
                url: "/consultaPlanAnual",
                templateUrl: "app/CP/consultasOCs/planAnual/planAnualGetConsulta.html",
                controller: "PlanAnualGetConsultaCtrl"
            })
            .state("ConsultaTemasInnovacion",
            {
                url: "/consultaTemasInnovacion",
                templateUrl: "app/CP/consultasOCs/temasInnovacion/temasInnovacionGetConsulta.html",
                controller: "TemasInnovacionGetConsultaCtrl"
            })
        ;
    };

})();
    