(function () {
    "use strict";

    angular
        .module("ineelPI", ['ui.router',
            'ui.bootstrap',
            'LocalStorageModule',
            'ineel.PI.services',
            'ineel.services',
            'ineel.GEN.services',
            'datatables',
            'datatables.directive',
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
            'ui.select'

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
                //Perform a global, case-insensitive search on the request url for 'noblockui' ...
                //debugger;
                if (config.url.indexOf("/coun") > 0) {
                    return false; // ... don't block it.
                }
            };
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
                        console.log("/indexPI.html#" + to.url);
                        MenuService.setReturnUrl("/indexPI.html#" + to.url);
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
                    var permitir = PermisosService.verificaPermisos(next, 'PI');
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
                templateUrl: "app/PI/home/homePI.html",
                controller: "HomePICtrl"
            })
            .state("derechosautorget",
            {
                url: "/derechosautor",
                templateUrl: "app/PI/derechosautor/derechosautorget.html",
                controller: "derechosautorCtrl"
            })
            .state("agregarderechoautor",
            {
                url: "/agregarderechoautor",
                templateUrl: "app/PI/derechosautor/derechosautoragregar.html",
                controller: "derechosautoragregarCtrl"
            })
            .state("editarderechoautor",
            {
                url: "/editarderechoautor/:id",
                templateUrl: "app/PI/derechosautor/derechosautoreditar.html",
                controller: "derechosautoreditarCtrl"
            })
            .state("detallederechoautor", {
                url: "/detallesdaexterno/:id",
                templateUrl: "app/CH/DAExterno/DAExternoDetails.html",
                controller: "dechoautordetalleCtrl",
                access: "anonymous"
            })
            .state("ramasget",
            {
                url: "/ramas",
                templateUrl: "app/PI/ramas/ramasget.html",
                controller: "ramasgetCtrl"
            })
            .state("ramasagregar",
            {
                url: "/agregarama",
                templateUrl: "app/PI/ramas/ramasagregar.html",
                controller: "ramasagregarCtrl"
            })
            .state("ramaseditar",
            {
                url: "/editarama/:id",
                templateUrl: "app/PI/ramas/ramaseditar.html",
                controller: "ramaseditarCtrl"
            })
            .state("estadodelprocesoget",
            {
                url: "/estadodelproceso",
                templateUrl: "app/PI/estadodelproceso/estadodelprocesoget.html",
                controller: "estadodelprocesogetCtrl"
            })
            .state("estadoprocesoagregar",
            {
                url: "/estadodelprocesoagregar",
                templateUrl: "app/PI/estadodelproceso/estadodelprocesoagregar.html",
                controller: "estadodelprocesoagregarCtrl"
            })
            .state("estadoprocesoeditar",
            {
                url: "/estadodelprocesoeditar/:id",
                templateUrl: "app/PI/estadodelproceso/estadodelprocesoeditar.html",
                controller: "estadodelprocesoeditarCtrl"
            })
            .state("tipopinget",
            {
                url: "/tipopin",
                templateUrl: "app/PI/tipopropiedadindustrial/tipopropiedadindustrialget.html",
                controller: "tipopingetCtrl"
            })
            .state("tipopinagregar",
            {
                url: "/tipopinagregar",
                templateUrl: "app/PI/tipopropiedadindustrial/tipopropiedadindustrialagregar.html",
                controller: "tipopinagregarCtrl"
            })
            .state("tipopineditar",
            {
                url: "/tipopineditar/:id",
                templateUrl: "app/PI/tipopropiedadindustrial/tipopropiedadindustrialeditar.html",
                controller: "tipopineditarCtrl"
            })
            .state("propiedadindustrialget",
            {
                url: "/propiedadindustrial",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialget.html",
                controller: "propiedadindustrialgetCtrl",
                access: "anonymous"
            })
            .state("propiedadindustrialeditar",
            {
                url: "/propiedadindustrialeditar/:id",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialeditar.html",
                controller: "propiedadindustrialeditarCtrl",
                access: "anonymous"
            })
            .state("propiedadindustrialagregar",
            {
                url: "/propiedadindustrialagregar",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialagregar.html",
                controller: "propiedadindustrialagregarCtrl",
                access: "anonymous"
            })
            .state("propiedadindustrialdetalle",
            {
                url: "/propiedadindustrialdetalle/:id",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialdetalle.html",
                controller: "propiedadindustrialdetalleCtrl",
                access: "anonymous"
            })
            .state("historialpin",
            {
                url: "/historialpin/:id",
                templateUrl: "app/PI/propiedadindustrial/historialpin.html",
                controller: "hitorialinCtrl",
                access: "anonymous"
            })
            .state("historialpinagregar",
            {
                url: "/historialpinagregar/:id",
                templateUrl: "app/PI/propiedadindustrial/historialpinagregar.html",
                controller: "historialpinagregarCtrl",
                access: "anonymous"
            })
             .state("historialpineditar",
            {
                url: "/historialpineditar/:id",
                templateUrl: "app/PI/propiedadindustrial/historialpineditar.html",
                controller: "historialpineditarCtrl",
                access: "anonymous"
            })
             .state("reportepi",
            {
                url: "/reportepropiedadindustrial",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialReporte.html",
                controller: "propiedadindustrialreporteCtrl",
                access: "anonymous"
            })
            .state("reporteda",
            {
                url: "/reportederechoautor",
                templateUrl: "app/PI/derechosautor/derechosautorReporte.html",
                controller: "derechosautorReporteCtrl",
                access: "anonymous"
            })
        ;
    };

})();
