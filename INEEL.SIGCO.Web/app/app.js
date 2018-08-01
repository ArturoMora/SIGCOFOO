(function() {
    "use strict";

    angular.module("ineel", ['ui.router',
        'LocalStorageModule',
        'ui.bootstrap',
        'datatables',
        "chart.js",
        'ineel.services', "blockUI",
        'GlobalINEEL',
        'ngSanitize',
        'ineel.controllers',
        'directivasSIGCO'
    ])
        .constant('HOST', "localhost")
        //.constant('HOST', "vmsigcop.iie.org.mx")
        .config(["$stateProvider", "$urlRouterProvider", RouterProvider])
        .run(function(DTDefaultOptions) {
            DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
            DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
            DTDefaultOptions.setOption('searchHighlight', 'true');
            DTDefaultOptions.setOption('bStateSave', true);
            DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
            DTDefaultOptions.setDisplayLength(5);
        })
        .filter('BlackListOC', function() {
            return function(oCsRolesBlackList, idRol) {
               
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
        .run(function ($rootScope, MenuService, $window) {
            $rootScope.go = function (authentication) {
                if (!authentication.isAuth) {
                    window.location = "/index.html#/login";
                }

            }
            $rootScope.openProfile = function (personaId) {
                $rootScope.personaIDSearch = personaId;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: "app/vistasGenericas/_details/personal/PersonalComunProfile.html",
                    controller: "PersonaProfileComunCtrl",
                });
            }
            $rootScope.anioActual = anioActual();

            $rootScope.globalRegresar = function() {
                
                $window.history.back();
                MenuService.removeGlobalID();
                MenuService.removeGlobalID2();
            }
            $rootScope.$on('$locationChangeStart', function (event) {
                //try {
                //    endTour();
                //} catch (e) { console.error(e);}
            });
            $rootScope.$on('$viewContentLoaded', function(event, viewName, viewContent) {

                // Panel toolbox
                $(document).ready(function() {
                    $('.collapse-link').on('click', function() {
                        var $BOX_PANEL = $(this).closest('.x_panel'),
                            $ICON = $(this).find('i'),
                            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

                        // fix for some div with hardcoded fix class
                        if ($BOX_PANEL.attr('style')) {
                            $BOX_CONTENT.slideToggle(200, function() {
                                $BOX_PANEL.removeAttr('style');
                            });
                        } else {
                            $BOX_CONTENT.slideToggle(200);
                            $BOX_PANEL.css('height', 'auto');
                        }

                        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
                    });

                    $('.close-link').click(function() {
                        var $BOX_PANEL = $(this).closest('.x_panel');

                        $BOX_PANEL.remove();
                    });
                });

            });
        }
        )
        //.run(function(DTDefaultOptions) {

        //    DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
        //    DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
        //    DTDefaultOptions.setOption('searchHighlight', 'true');
        //    DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
        //    DTDefaultOptions.setDisplayLength(5);
        //})
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        }).config(function(blockUIConfig) {
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
        });

    function RouterProvider($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise("/home");
        $urlRouterProvider.otherwise("/homeAuthorize");


        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "app/home/home.html",
                controller: "cargardatosAnonimo"
            })
            .state("graficach", {
                url: "/graficach",
                templateUrl: "app/home/graficach.html",
                controller: "graficachCtrl"
            })
            .state("cargardatos", {
                url: "/",
                templateUrl: "app/home/cargardatos.html",
                controller: "cargardatosCtrl"
            })
            .state("acercade", {
                url: "/acercade",
                templateUrl: "app/home/Acercade.html"
            })
            .state("homeAuthorize", {
                url: "/homeAuthorize",
                templateUrl: "app/home/homeAuthorize.html",
                controller: "homeauthorizeCtrl"
            })
            .state("login", {
                url: "/login",
                templateUrl: "app/auth/login.html",
                controller: "loginCtrl"
            })
            .state("suscripcion", {
                url: "/suscripcion",
                templateUrl: "app/home/suscripcion/suscripcion.html",
                controller: "suscripcionCtrl"
            }).state("SolicitudAcceso", {
                url: "/SolicitudesAcceso",
                templateUrl: "app/vistasGenericas/SolicitudAcceso/SolicitudAccesoGet.html",
                controller: "SolicitudesAcceso"
            })
            .state("bitacoraSolicitudesAcceso", {
                url: "/bitacoraSolicitudesAcceso/:id",
                templateUrl: "app/vistasGenericas/SolicitudAcceso/bitacorasolicitudesAcceso.html",
                controller: "BitacoraSolicitudesAccesoCtrl"
            })
            .state("recupearapassword", {
                url: "/recupearapassword",
                templateUrl: "app/auth/recuperapassword.html",
                controller: "recuperapasswordCtrl",
                access: "anonymous"
            })
            .state("newpassword", {
                url: "/newpassword/:id/:numemp",
                templateUrl: "app/auth/newpassword.html",
                controller: "newpasswordCtrl",
                access: "anonymous"
            }).state("proyectosPorUnidad", {
                url: "/proyectosPorUnidad/:id",
                templateUrl: "app/vistasGenericas/_details/proyecto/proyectosPorUnidad.html",
                controller: "proyectosPorUnidadCtrl",
                access: "anonymous"
            }).state("facturacionRealPorUnidad", {
                url: "/facturacionRealPorUnidad/:id",
                templateUrl: "app/vistasGenericas/_details/proyecto/facturacionRealPorUnidad.html",
                controller: "facturacionRealPorUnidadCtrl",
                access: "anonymous"
            }).state("facturacionPlaneadaPorUnidad", {
                url: "/facturacionPlaneadaPorUnidad/:id",
                templateUrl: "app/vistasGenericas/_details/proyecto/facturacionPlaneadaPorUnidad.html",
                controller: "facturacionPlaneadaPorUnidadCtrl",
                access: "anonymous"
            })
           .state("ResponsablesModulos", {
               url: "/ResponsablesModulos",
                templateUrl: "app/vistasGenericas/ResponsableModulos/ResponsablesModulos.html",
                controller: "ResponsablesModulosCtrl"
           })

            .state("videotutoriales", {
                url: "/videotutoriales",
                templateUrl: "app/vistasGenericas/videotutoriales/videotutoriales.html",
                controller: "videotutorialesCtrl"
            })
        
            .state("tablero", {
                url: "/tablero",
                templateUrl: "app/vistasGenericas/tablero/tablero.html",
                controller: "tableroCtrl"
                });
    };

} ());

