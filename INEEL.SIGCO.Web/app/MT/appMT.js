//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function () {
    "use strict";
    angular
        .module("ineelMT", ['ui.router',
            'LocalStorageModule',
            'ui.bootstrap',
            'ineel.MT.services',
            'ineel.services',
            'ineelMT.withResponsive',
            'datatables',
            'datatables.directive',
            'datatables.columnfilter',
            'GlobalINEEL',
            'angucomplete-alt', "ui.tree", "ui.select", "ngSanitize", "blockUI",
            'mdo-angular-cryptography',
            'directivasSIGCO',
            'ngLocale',
            'ineel.controllers'
        ])
        .constant('AdminMT', 2)
        .constant('Gerente', 4)
        .config(["$stateProvider", "$urlRouterProvider", RouterProvider])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        }).config(function (blockUIConfig) {
            // Disable auto body block
            //blockUIConfig.autoInjectBodyBlock = false;
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
            blockUIConfig.requestFilter = function (config) {
                //Perform a global, case-insensitive search on the request url for 'noblockui' ...
                //
                // console.log("config.url");

                if (config.url.indexOf("/coun") > 0) {
                    return false; // ... don't block it.
                }
                if (config.url.indexOf("/Coun") > 0) {
                    return false; // ... don't block it.
                }
                if (config.url.indexOf("/header/") > 0) {
                    return false; // ... don't block it.
                }
                if (config.url.indexOf("/Descarga/getUrl") > 0) {
                    return false; // ... don't block it.
                }
                if (config.url.indexOf("/NuevoOC/GetTopByMODULO") > 0) {
                    return false; // ... don't block it.
                }

                if (config.url.indexOf("/home") > 0) {
                    return false; // ... don't block it.
                }
                blockUIConfig.requestFilter = function (config) {
                    if (config.url.indexOf("block=no") > 0) {
                        return false; // ... don't block it.
                    }
                };
            };
        })

        .run(function (DTDefaultOptions) {
            DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
            DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
            DTDefaultOptions.setOption('searchHighlight', 'true');
            DTDefaultOptions.setOption('bStateSave', true);
            DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
            DTDefaultOptions.setDisplayLength(5);
        })
        .filter('encriptar', function (DescargasService) {
            return function (x) {
                return DescargasService.encriptar(x);
            };
        })
        .filter('underscoreless', function () {
            return function (input) {
                if (input == null) {
                    return input;
                }
                return input.replace(/_/g, ' ');
            };
        })
        .filter('BlackListOC', function () {
            return function (oCsRolesBlackList, idRol) {
                //
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
        .filter('getAutoresPersonas', function () {
            return function (autores) {

                if (autores == undefined || autores == null || autores.length < 1) {
                    return null;
                }
                var result = "";
                for (var i = 0; i < autores.length - 1; i++) {
                    result = result.concat(autores[i].nombreCompleto, ", ");
                }
                result = result.concat(autores[i].nombreCompleto);
                return result;
            };
        })
        .filter('trim', function () {
            return function (value) {
                if (!angular.isString(value)) {
                    return value;
                }

                return value.replace(/^\s\s*/g, '').replace(/\s\s*$/g, '');//TODO: pendiente validar la función
            };
        })
        .run(function ($rootScope, $location, AuthService, MenuService, PermisosService, $window, $uibModal, $state) {
            $rootScope.openProfile = function (personaId) {
                
                $rootScope.personaIDSearch =  personaId;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: "app/vistasGenericas/_details/personal/PersonalComunProfile.html",
                    controller: "PersonaProfileComunCtrl",
                });
            }
            $rootScope.globalError = function (err) {
                try {
                    toastr.error(err.data.innerException.innerException.exceptionMessage);
                } catch (e) { toastr.error("Problema al recuperar informaci&oacute;n del servidor"); }
                console.error(err);
            }
            $rootScope.go = function (authentication) {
                if (!authentication.isAuth) {
                    window.location = "/index.html#/login";
                }

            }
            $rootScope.setGlobalGo = function (id) {
                $state.go(id);
            }
            $rootScope.anioActual = anioActual();
            $rootScope.globalRegresar = function () {
                //
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

            $rootScope.cancel = function ($uibModalInstance) {
                $uibModalInstance.dismiss('cancel');
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
            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

                $rootScope.nameState = to.name;
                $rootScope.toState = to;
                $rootScope.fromState = from;
                var continuar = false;


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
                                if (to.url == "/infoGral") {
                                    to.url = "/ITFdetalles/" + toParams.id + "/" + toParams.edit + "/" + toParams.foo + "/infoGral";
                                }
                            } catch (ex) { }
                            try {
                                to.url = to.url.replace(":id2", toParams.id2);
                                to.url = to.url.replace(":id", toParams.id);
                            } catch (ex) { }

                            console.log("/indexMT.html#" + to.url);
                            MenuService.setReturnUrl("/indexMT.html#" + to.url);
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
                        var permitir = PermisosService.verificaPermisos(next, "MT");
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
                // intento de autovalidacion
                //$(document).ready(function () {
                //    var form = $('form.validar').attr('name');
                //    if (form !=undefined){
                //    $("form.validar .inp").each(function () {
                //        var n = jQuery(this).attr('name'); // <- This works
                //        jQuery(this).parent('div').parent('div').attr('ng-class', "{ 'has-error': " + form + "." + n + ".$invalid }");
                //        jQuery(this).attr('ng-class', "{ 'has-error': " + form + "." + n + ".$invalid }");
                //        alert(n);
                //    });
                //    console.log('inp');
                //    console.log(inp);
                //    }
                //});

                window.scrollTo(0, 0);
            });
        });

    //#region RouterProvider
    function RouterProvider($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
        //     $urlRouterProvider.otherwise("menuitfs");

        $stateProvider
            .state("pendiente", {
                url: "/pendiente",
                templateUrl: "app/MT/home/pendiente.html"
            })
            .state("home", {
                url: "/home",
                templateUrl: "app/MT/home/homeMT.html",
                controller: "CargaControllerMT as showCase"
            })
            .state("proyectosMT", {
                url: "/proyectosMT",
                templateUrl: "app/MT/informetf/proyectoItfGet.html",
                controller: "ProyectosItfGetCtrl"
            })
            .state("menuitfs", {
                url: "/menuitfs",
                templateUrl: "app/MT/informetf/menuitfs.html"
            })
            .state("menuCatalogos", {
                url: "/menuCatalogos",
                templateUrl: "app/MT/home/menuCatalogos.html"
            })
            .state("itfs", {
                url: "/informes-tecnicos-finales",
                templateUrl: "app/MT/informetf/ProyectoItfGet.html",
                controller: "ProyectosItfGetCtrl"
            })
            .state("AddITF", {
                url: "/AddITF",
                templateUrl: "app/MT/informetf/nuevoITF.html",
                controller: "NuevoItfGetCtrl"
            })
            .state("ListaItf", {
                url: "/ListaItf",
                templateUrl: "app/MT/informetf/informestfsGet.html",
                controller: "informestfsGetCtrl as showCase"
            })
            .state("consultaitfs", {
                url: "/consultaitfs",
                templateUrl: "app/MT/informetf/informestfsGet.html", //pendiente...
                controller: "itfsCtrl"
            })

            .state('detalleInsumoITF', {
                url: '/detalleInsumoITF/',
                templateUrl: 'app/MT/informetf/wizardAdditf/detalleInsumo.html',
                controller: 'detalleInsumoITFCtrl'
            })
            .state('editarInsumoITF', {
                url: '/editarInsumoITF/',
                templateUrl: 'app/MT/informetf/wizardAdditf/editarInsumo.html',
                controller: 'editarInsumoITFCtrl'
            })
            .state('ITF', {
                url: '/ITF/:id/:edit/:foo',
                templateUrl: 'app/MT/informetf/wizardAdditf/form.html',
                controller: 'informetfAdd'
            })
            // nested states
            // each of these sections will have their own view
            // url will be nested (/form/infoGral)
            .state('ITF.infoGral', {
                url: '/infoGral',
                templateUrl: 'app/MT/informetf/wizardAdditf/infoGeneral.html'
            })
            // url will be /form/resultadosP
            .state('ITF.resultadosP', {
                url: '/resultadosP',
                templateUrl: 'app/MT/informetf/wizardAdditf/resultadosPesos.html'
            })
            // url will be /form/satisfCliente
            .state('ITF.satisfCliente', {
                url: '/satisfCliente',
                templateUrl: 'app/MT/informetf/wizardAdditf/satisfCliente.html'
            })
            .state('ITF.resultados', {
                url: '/resultados',
                templateUrl: 'app/MT/informetf/wizardAdditf/resultados.html'
            })
            .state('ITF.proyFuturos', {
                url: '/proyFuturos',
                templateUrl: 'app/MT/informetf/wizardAdditf/proyFuturos.html'
            })
            .state('ITF.evaluaciones', {
                url: '/evaluaciones',
                templateUrl: 'app/MT/informetf/wizardAdditf/evaluaciones.html'
            })
            .state('ITF.leccionesAprend', {
                url: '/leccionesAprend',
                templateUrl: 'app/MT/informetf/wizardAdditf/leccionesAprend.html'
            })
            .state('ITF.insumos', {
                url: '/insumos',
                templateUrl: 'app/MT/informetf/wizardAdditf/insumos.html'
            })
            .state("employee", {
                url: "/employee/:id",
                templateUrl: "app/employees/employee.html",
                controller: "EmployeeCtrl"
            })
            .state('ITF.detallesItf', {
                url: '/detallesItf',
                templateUrl: 'app/MT/informetf/wizardAdditf/detallesItf.html'
            })

            .state('CursoAdd', {  //Los controladores de curso estan en app/CH
                url: '/CursoAdd',
                templateUrl: 'app/MT/CursosPersonal/CursosPersonalAdd.html',
                controller: 'cursointernoAddCtrl'
            }).state('Cursos', {
                url: '/Cursos',
                templateUrl: 'app/MT/CursosPersonal/CursosPersonalGet.html',
                controller: 'cursointernoCtrlGet'
            }).state('CursoEdit', {
                url: '/CursoEdit/',
                templateUrl: 'app/MT/CursosPersonal/CursosPersonalEdit.html',
                controller: 'cursointernoEditCtrl'
            }).state('CursoDetails', {
                url: '/CursoDetails/:id',
                templateUrl: 'app/MT/CursosPersonal/CursosPersonalDetails.html',
                controller: 'cursointernoDetailsCtrl'
            }).state('CursoDelete', {
                url: '/CursoDelete',
                templateUrl: 'app/MT/CursosPersonal/CursosPersonalDelete.html',
                controller: 'CursosPersonalDeleteCtrl'
            }).state('SoftwarePersonal', {
                url: '/SoftwarePersonal',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonal.html',
                controller: 'softwarePersonal'
            })
            .state('SoftwarePersonalAdd', {
                url: '/SoftwarePersonalAdd',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalAdd.html',
                controller: 'softwarePersonalAdd'
            }).state('SoftwarePersonalGet', {
                url: '/SoftwarePersonalGet',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalGet.html',
                controller: 'SoftwarePersonalGetCtrl as showCase'
            }).state('SoftwarePersonalEdit', {
                url: '/SoftwarePersonalEdit/',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalEdit.html',
                controller: 'SoftwarePersonalEditCtrl'
            }).state('SoftwarePersonalDetails', {
                url: '/SoftwarePersonalDetails/:id',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalDetails.html',
                controller: 'SoftwarePersonalDetails'
            }).state('SoftwarePersonalDelete', {
                url: '/SoftwarePersonalDelete',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalDelete.html',
                controller: 'SoftwarePersonalDelete'
            }).state('SoftwarePersonalAdminEdit', {
                url: '/SoftwarePersonalAdminEdit/',
                templateUrl: 'app/MT/SoftwarePersonal/SoftwarePersonalAdminEdit.html',
                controller: 'SoftwarePersonalAdminEditCtrl'
            }).state('TipoCursoAdd', {
                url: '/TipoCursoAdd',
                templateUrl: 'app/MT/tipoCurso/TipoCursoAdd.html',
                controller: 'TipoCursoAddCtrl'
            }).state('TipoCursoGet', {
                url: '/TipoCursoGet',
                templateUrl: 'app/MT/tipoCurso/TipoCursoGet.html',
                controller: 'TipoCursoGetCtrl'
            }).state('TipoCursoEdit', {
                url: '/TipoCursoEdit/:id',
                templateUrl: 'app/MT/tipoCurso/TipoCursoEdit.html',
                controller: 'TipoCursoEditCtrl'
            }).state("TipoCursoDetails", {
                url: "/TipoCursoDetails/:id",
                templateUrl: "app/MT/tipoCurso/TipoCursoDetails.html",
                controller: "TipoCursoDetailsCtrl"
            }).state('TipoSoftwareGet', {
                url: '/TipoSoftwareGet',
                templateUrl: 'app/MT/tipoSoftware/TipoSoftwareGet.html',
                controller: 'TipoSoftwareGetCtrl'
            }).state('TipoSoftwareAdd', {
                url: '/TipoSoftwareAdd',
                templateUrl: 'app/MT/tipoSoftware/TipoSoftwareAdd.html',
                controller: 'TipoSoftwareAddCtrl'
            }).state("TipoSoftwareEdit", {
                url: "/TipoSoftwareEdit/:id",
                templateUrl: "app/MT/tipoSoftware/TipoSoftwareEdit.html",
                controller: "TipoSoftwareEditCtrl"
            }).state("TipoSoftwareDetails", {
                url: "/TipoSoftwareDetails/:id",
                templateUrl: "app/MT/tipoSoftware/TipoSoftwareDetails.html",
                controller: "TipoSoftwareDetailsCtrl"
            }).state('CalifResultadosFinancierosGet', {
                url: '/CalifResultadosFinancierosGet',
                templateUrl: 'app/MT/califResultadosFinancieros/CalifResultadosFinancierosGet.html',
                controller: 'CalifResultadosFinancierosGetCtrl'
            }).state('CalifResultadosFinancierosAdd', {
                url: '/CalifResultadosFinancierosAdd',
                templateUrl: 'app/MT/califResultadosFinancieros/CalifResultadosFinancierosAdd.html',
                controller: 'CalifResultadosFinancierosAddCtrl'
            }).state("CalifResultadosFinancierosEdit", {
                url: "/CalifResultadosFinancierosEdit/:id",
                templateUrl: "app/MT/califResultadosFinancieros/CalifResultadosFinancieroseEdit.html",
                controller: "CalifResultadosFinancierosEditCtrl"
            }).state("CalifResultadosFinancierosDetails", {
                url: "/CalifResultadosFinancierosDetails/:id",
                templateUrl: "app/MT/califResultadosFinancieros/CalifResultadosFinancierosDetails.html",
                controller: "CalifResultadosFinancierosDetailsCtrl"
            }).state('CalificacionClienteGet', {
                url: '/CalificacionClienteGet',
                templateUrl: 'app/MT/calificacionCliente/CalificacionClienteGet.html',
                controller: 'CalificacionClienteGetCtrl'
            }).state('CalificacionClienteAdd', {
                url: '/CalificacionClienteAdd',
                templateUrl: 'app/MT/calificacionCliente/CalificacionClienteAdd.html',
                controller: 'CalificacionClienteAddCtrl'
            }).state("CalificacionClienteEdit", {
                url: "/CalificacionClienteEdit/:id",
                templateUrl: "app/MT/calificacionCliente/CalificacionClienteEdit.html",
                controller: "CalificacionClienteEditCtrl"
            }).state("CalificacionClienteDetails", {
                url: "/CalificacionClienteDetails/:id",
                templateUrl: "app/MT/calificacionCliente/CalificacionClienteDetails.html",
                controller: "CalificacionClienteDetailsCtrl"
            }).state('CalificacionPersonalGet', {
                url: '/CalificacionPersonalGet',
                templateUrl: 'app/MT/calificacionPersonal/CalificacionPersonalGet.html',
                controller: 'CalificacionPersonalGetCtrl'
            }).state('CalificacionPersonalAdd', {
                url: '/CalificacionPersonalAdd',
                templateUrl: 'app/MT/calificacionPersonal/CalificacionPersonalAdd.html',
                controller: 'CalificacionPersonalAddCtrl'
            }).state("CalificacionPersonalEdit", {
                url: "/CalificacionPersonalEdit/:id",
                templateUrl: "app/MT/calificacionPersonal/CalificacionPersonalEdit.html",
                controller: "CalificacionPersonalEditCtrl"
            }).state("CalificacionPersonalDetails", {
                url: "/CalificacionPersonalDetails/:id",
                templateUrl: "app/MT/calificacionPersonal/CalificacionPersonalDetails.html",
                controller: "CalificacionPersonalDetailsCtrl"
            })
            .state("pruebaBuscarPersonas", {
                url: "/pruebaBuscarPersonas",
                templateUrl: "app/MT/_pruebas/BuscarPersonasBorrar.html",
                controller: "PersonasFilterCtrlBorrar"
            })
            .state("pruebaBuscarProyectos", {
                url: "/pruebaBuscarProyectos",
                templateUrl: "app/MT/_pruebas/BuscarProyectosBorrar.html",
                controller: "ProyectosFilterCtrlBorrar"
            })
            .state("EstructuraOrganizacional", {
                url: "/EstructuraOrganizacional",
                templateUrl: "app/vistasGenericas/EstructuraOrganizacional.html",
                controller: "EstructuraOrganizacionalCtrl"
            }).state("pruebaBuscarEO", {
                url: "/pruebaBuscarEO",
                templateUrl: "app/MT/_pruebas/BuscarEOBorrar.html",
                controller: "EstructuraOrganizacionalCtrlBorrar"
            })
            .state("BuscarInsumos", {
                url: "/BuscarInsumos",
                templateUrl: "app/MT/BuscarInsumos/buscarInsumo.html",
                controller: "InsumosFilterGetCtrl as showCase"
            }).state("BuscarInsumosDetails", {
                url: "/BuscarInsumosDetails/:id/:id2",
                templateUrl: "app/MT/BuscarInsumos/buscarInsumoDetails.html",
                controller: "BuscarInsumosDetailsCtrl"
            })
            .state("BuscarLeccionesAprendidas", {
                url: "/BuscarLeccionesAprendidas",
                templateUrl: "app/MT/BuscarLeccionesAprendidas/buscarLA.html",
                controller: "LAFilterGetCtrl as showCase"
            }).state("LeccionesAprendidasCapacidadDetails", {
                url: "/LeccionesAprendidasCapacidadDetails/:id/:id2",
                templateUrl: "app/MT/BuscarLeccionesAprendidas/buscarLAcapDetails.html",
                controller: "BuscarLAcapDetailsCtrl"
            }).state("LeccionesAprendidasProyectosDetails", {
                url: "/LeccionesAprendidasProyectosDetails/:id/:id2",
                templateUrl: "app/MT/BuscarLeccionesAprendidas/buscarLAproyDetails.html",
                controller: "BuscarLAproyDetailsCtrl"
            }).state("LeccionesAprendidasClientesDetails", {
                url: "/LeccionesAprendidasClientesDetails/:id/:id2",
                templateUrl: "app/MT/BuscarLeccionesAprendidas/buscarLActeDetails.html",
                controller: "BuscarLActeDetailsCtrl"
            })
            .state('ITFdetalles', {
                url: '/ITFdetalles/:id/:edit/:foo',
                templateUrl: 'app/MT/informetf/itfDetails/form.html',
                controller: 'informetfDetails'
            })
            .state('ITFdetalles.infoGral', {
                url: '/infoGral',
                templateUrl: 'app/MT/informetf/itfDetails/infoGeneral.html'
            })
            .state('ITFdetalles.resultadosP', {
                url: '/resultadosP',
                templateUrl: 'app/MT/informetf/itfDetails/resultadosPesos.html'
            })
            .state('ITFdetalles.satisfCliente', {
                url: '/satisfCliente',
                templateUrl: 'app/MT/informetf/itfDetails/satisfCliente.html'
            })
            .state('ITFdetalles.resultados', {
                url: '/resultados',
                templateUrl: 'app/MT/informetf/itfDetails/resultados.html'
            })
            .state('ITFdetalles.proyFuturos', {
                url: '/proyFuturos',
                templateUrl: 'app/MT/informetf/itfDetails/proyFuturos.html'
            })
            .state('ITFdetalles.evaluaciones', {
                url: '/evaluaciones',
                templateUrl: 'app/MT/informetf/itfDetails/evaluaciones.html'
            })
            .state('ITFdetalles.leccionesAprend', {
                url: '/leccionesAprend',
                templateUrl: 'app/MT/informetf/itfDetails/leccionesAprend.html'
            })
            .state('ITFdetalles.insumos', {
                url: '/insumos',
                templateUrl: 'app/MT/informetf/itfDetails/insumos.html'
            }).state('EstadoSolicitudAdd', {
                url: '/EstadoSolicitudAdd',
                templateUrl: 'app/MT/EstadoSolicitud/EstadoSolicitudAdd.html',
                controller: 'EstadoSolicitudAddCtrl'
            }).state('EstadoSolicitud', {
                url: '/EstadoSolicitud',
                templateUrl: 'app/MT/EstadoSolicitud/EstadoSolicitudGet.html',
                controller: 'EstadoSolicitudGetCtrl'
            }).state('EstadoSolicitudEdit', {
                url: '/EstadoSolicitudEdit/:id',
                templateUrl: 'app/MT/EstadoSolicitud/EstadoSolicitudEdit.html',
                controller: 'EstadoSolicitudEditCtrl'
            }).state("EstadoSolicitudDetails", {
                url: "/EstadoSolicitudDetails/:id",
                templateUrl: "app/MT/EstadoSolicitud/EstadoSolicitudDetails.html",
                controller: "EstadoSolicitudDetailsCtrl"
            }).state("SolicitudAcceso", {
                url: "/SolicitudesAcceso",
                templateUrl: "app/vistasGenericas/SolicitudAcceso/SolicitudAccesoGet.html",
                controller: "SolicitudesAcceso"
            })
            .state('SolicitudesITFs', {
                url: '/Solicitudes/ITF',
                templateUrl: 'app/MT/SolicitudesMT/SolicitudITFGetGerente.html',
                controller: 'SolicitudesMTCtrl'
            }).state('SolicitudesITFsMT', {
                url: '/Solicitudes/ITFMT',
                templateUrl: 'app/MT/SolicitudesMT/SolicitudITFGetAdminMT.html',
                controller: 'SolicitudesAdminMTCtrl'
            })

            .state('SolicitudesInsumos', {
                url: '/Solicitudes/Insumos',
                templateUrl: 'app/MT/SolicitudInsumo/SolicitudInsumoGet.html',
                controller: 'SolicitudInsumoGetCtrl'
            })
            .state('Bitacora', {
                url: '/Bitacora',
                templateUrl: 'app/vistasGenericas/BitacoraMovimientoGet.html',
                controller: 'BitacoraMovimientoGetCtrl'
            })
            .state('Publicaciones', {  //Los controladores de publicaciones estan ubicados en CH, tambien ponencias y otros OCs compartidos
                url: '/Publicaciones',
                templateUrl: 'app/MT/publicacion/PublicacionGet.html',
                controller: 'publicacionCtrlGet'
            }).state('publicacionAdd', { //Los controladores de publicaciones estan ubicados en CH
                url: '/PublicacionAdd',
                templateUrl: 'app/MT/publicacion/PublicacionAdd.html',
                controller: 'publicacionCtrlAdd'
            }).state("publicacionEdit", { //Los controladores de publicaciones estan ubicados en CH
                url: "/PublicacionEdit/",
                templateUrl: "app/MT/publicacion/PublicacionEdit.html",
                controller: "publicacionCtrlEdit"
            }).state("publicacionDetails", { //Los controladores de publicaciones estan ubicados en CH
                url: "/PublicacionDetails/:id",
                templateUrl: "app/MT/publicacion/PublicacionDetails.html",
                controller: "publicacionCtrlDetails"
            })
            .state('Ponencias', {
                url: '/Ponencias',
                templateUrl: 'app/MT/ponencia/PonenciaGet.html',
                controller: 'ponenciaCtrlGet'
            }).state('ponenciaAdd', {
                url: '/PonenciaAdd',
                templateUrl: 'app/MT/ponencia/PonenciaAdd.html',
                controller: 'ponenciaCtrlAdd'
            }).state("ponenciaEdit", {
                url: "/PonenciaEdit/",
                templateUrl: "app/MT/ponencia/PonenciaEdit.html",
                controller: "ponenciaCtrlEdit"
            }).state("ponenciaDetails", {
                url: "/PonenciaDetails/:id",
                templateUrl: "app/MT/ponencia/PonenciaDetails.html",
                controller: "BuscarPonenciasDetailsCtrl"
            })
            .state('Capitulos', {  //Los controladores de capitulos estan ubicados en app/CH
                url: '/Capitulos',
                templateUrl: 'app/MT/Capitulos/CapitulosGet.html',
                controller: 'capitulosCtrlGet'
            }).state('CapituloAdd', {
                url: '/CapituloAdd',
                templateUrl: 'app/MT/Capitulos/CapitulosAdd.html',
                controller: 'capitulosCtrlAdd'
            }).state("CapituloEdit", {
                url: "/CapituloEdit/:id",
                templateUrl: "app/MT/Capitulos/CapituloEdit.html",
                controller: "capitulosCtrlEdit"
            }).state("CapituloDetails", {
                url: "/CapituloDetails/:id",
                templateUrl: "app/MT/Capitulos/CapitulosDetails.html",
                controller: "capitulosCtrlDetails"
            })
            .state("BuscarArticulos", {
                url: "/BuscarArticulos",
                templateUrl: "app/MT/BuscarArticulos/buscarArticulos.html",
                controller: "ArticulosFilterGetCtrl"
            }).state("BuscarArticulosDetails", {
                url: "/BuscarArticulosDetails/:id",
                templateUrl: "app/MT/BuscarArticulos/buscarArticulosDetails.html",
                controller: "BuscarArticulosDetailsCtrl"
            })
            .state("BuscarCapitulos", {
                url: "/BuscarCapitulos",
                templateUrl: "app/MT/BuscarCapitulos/buscarCapitulos.html",
                controller: "CapitulosFilterGetCtrl"
            }).state("BuscarCapitulosDetails", {
                url: "/BuscarCapitulosDetails/:id",
                templateUrl: "app/MT/BuscarCapitulos/buscarCapitulosDetails.html",
                controller: "buscarCapitulosDetailsCtrl"
            })
            .state("indexITF", {
                url: "/indexITF",
                templateUrl: "app/MT/informetf/index.html",
                //controller: "XCtrl"
            })
            .state("BuscarCursos", {
                url: "/BuscarCursos",
                templateUrl: "app/MT/BuscarCursos/buscarCursos.html",
                controller: "CursosFilterGetCtrl"
            })
            .state("BuscarInformesBecarios", { //states nuevos de becarios
                url: "/BuscarInformesBecarios",
                templateUrl: "app/MT/BuscarInformesBecarios/ConsultaInformesBecarios.html",
                controller: "ConsultaInformesBecariosCtrl as showCase"
            })
            .state('ConsultaBecariosInternos', {
                url: '/ConsultaInformesBecariosInternos',
                templateUrl: 'app/MT/BuscarInformesBecarios/ConsultaBecariosInternosGet.html',
                controller: 'ConsultaBecariosInternosGetCtrl as showCase'
            })
            .state("ConsultaBecarioInternoDetails", {
                url: "/ConsultaBecarioInternoDetails/:id",
                templateUrl: 'app/MT/BuscarInformesBecarios/ConsultaBecariosInternosDetails.html',
                controller: "ConsultaBecariosInternosDetailsCtrl"
            })
            .state("ConsultaBecarioExternoDetails", {
                url: "/ConsultaBecarioExternoDetails/:id",
                templateUrl: 'app/MT/BuscarInformesBecarios/ConsultaBecariosExternosDetails.html',
                controller: "ConsultaBecariosExternosDetailsCtrl"
            })
            .state('ConsultaBecariosExternos', {
                url: '/ConsultaBecariosExternos',
                templateUrl: 'app/MT/BuscarInformesBecarios/ConsultaBecariosExternosGet.html',
                controller: 'ConsultaBecariosExternosGetCtrl as showCase'
            })
            .state("Solicitudes/ITFacceso", {
                url: "/Solicitudes/ITFacceso",
                templateUrl: "app/MT/informetf/SolicitudAccesoITFGerente.html",
                controller: "SolicitudAccesoITFCtrl"
            })
            .state("BuscarCursosDetails", {
                url: "/BuscarCursosDetails/:id",
                templateUrl: "app/MT/BuscarCursos/buscarCursosDetails.html",
                controller: "BuscarCursosDetailsCtrl"

            })
            .state("importarLibros", {
                url: "/importarLibros",
                templateUrl: "app/MT/Libros/importarLibros.html",
                controller: "LibrosRawGet"
            })
            .state("libros", {
                url: "/libros",
                templateUrl: "app/MT/Libros/importarLibros.html",
                controller: "LibrosRawGet"
            })
            .state("BuscarPonencias", {
                url: "/BuscarPonencias",
                templateUrl: "app/MT/BuscarPonencias/buscarPonencias.html",
                controller: "PonenciasFilterGetCtrl"
            })
            .state("BuscarPonenciasDetails", {
                url: "/BuscarPonenciasDetails/:id",
                templateUrl: "app/MT/BuscarPonencias/buscarPonenciasDetails.html",
                controller: "BuscarPonenciasDetailsCtrl"
            }).state("agregarParticipacionProyecto", {
                url: "/agregarParticipacionProyecto",
                templateUrl: "app/MT/informetf/ParticipacionProyectoAdd.html",
                controller: "participacionMTCtrlAdd"
            })
            .state("buscarProyectos", {
                url: "/buscarProyectos",
                templateUrl: "app/vistasGenericas/search/proyectoComun.html",
                controller: "ProyectoSearchCtrlComun as showCase",
                access: "anonymous"
            })
            .state("detalleProyecto", {
                url: "/detalleProyecto/:id",
                templateUrl: "app/vistasGenericas/_details/proyecto/ProyectoComunDetails.html",
                controller: "ProyectoComunDetailsGEN",
                access: "anonymous"
            })
            .state("tipoInsumoGet", {
                url: "/tipoInsumos",
                templateUrl: "app/MT/tipoInsumo/TipoInsumoGet.html",
                controller: "TipoInsumoGetCtrl",
                access: "anonymous"
            })
            .state("tipoInsumoAdd",
                {
                    url: "/addTipoInsumos",
                    templateUrl: "app/MT/tipoInsumo/TipoInsumoAdd.html",
                    controller: "TipoInsumoAddCtrl",
                    access: "anonymous"
                })
            .state("tipoInsumoEdit",
                {
                    url: "/tipoInsumoEdit/:id",
                    templateUrl: "app/MT/tipoInsumo/TipoInsumoEdit.html",
                    controller: "TipoInsumoEditCtrl",
                    access: "anonymous"
                }).state("bitacoraSolicitudesAcceso", {
                    url: "/bitacoraSolicitudesAcceso/:id",
                    templateUrl: "app/vistasGenericas/SolicitudAcceso/bitacorasolicitudesAcceso.html",
                    controller: "BitacoraSolicitudesAccesoCtrl",
                    access: "anonymous"
                }).state("bitacoraSolicitudesDetails", {
                    url: "/bitacorasolicitudes/:id/:id2",
                    templateUrl: "app/CH/BitacoraSolicitudes/bitacorasolicitudesDetails.html",
                    controller: "bitacorasolicitudesDetailsCtrl",
                    access: "anonymous"
                })
            .state("detallederechoautor", {
                url: "/detallesdaexterno/:id",
                templateUrl: "app/CH/DAExterno/DAExternoDetails.html",
                controller: "derechosautordetalleProyectoCtrl",
                access: "anonymous"
            })
            .state("propiedadindustrialdetalle",
                {
                    url: "/propiedadindustrialdetalle/:id",
                    templateUrl: "app/PI/propiedadindustrial/propiedadindustrialdetalle.html",
                    controller: "propiedadindustrialdetalleProyectoCtrl",
                    access: "anonymous"
                })
            .state("productoInnovadorDetails", {
                url: "/detallesproductoInnovador/:id",
                templateUrl: "app/GI/productosInnovadores/productoInnovadorDetails.html",
                controller: "productoInnovadorDetailsProyecto",
                access: "anonymous"
            })
            ;
    };
    //#endregion RouterProvider
    angular.module('ineelMT.withResponsive', []);

}());
