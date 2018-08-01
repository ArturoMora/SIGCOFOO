//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function () {
    "use strict";

    angular
        .module("ineelGEN", ['ui.router',
            'LocalStorageModule',
            'datatables',
            'blockUI',
            'ineel.GEN.services',
            'ineel.services',
            'ineel.controllers',
            'GlobalINEEL', 'ui.bootstrap', "ui.bootstrap.tpls"])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        })
        .config(["$stateProvider", "$urlRouterProvider", RouterProvider])
        .config(function (blockUIConfig) {
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
        })
        .run(function (DTDefaultOptions) {
            DTDefaultOptions.setLanguageSource('/Scripts/DataTables/i18n/Spanish.js');
            DTDefaultOptions.setOption('sPaginationType', 'full_numbers');
            DTDefaultOptions.setOption('searchHighlight', 'true');
            DTDefaultOptions.setOption('bStateSave', true);
            DTDefaultOptions.setOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]]);
            DTDefaultOptions.setDisplayLength(5);
        })
        .run(function ($rootScope, $location, AuthService, MenuService, PermisosService) {
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
                //debugger;
                try {
                    debugger;
                    if ($window.history.length == 1) {
                        $state.go("home");
                    } else
                        $window.history.back();
                } catch (e) {
                    debugger;
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
            $rootScope.setOrigen = function (id) {
                MenuService.setOrigen(id);
            }
            $rootScope.getOrigen = function () {
                return MenuService.getOrigen();
            }
            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

                $rootScope.usuarioLogueado = false;
                AuthService.verificaSesion().then(function (res) {

                    if (res != null) {
                        $rootScope.usuarioLogueado = true;
                    }
             

                    if ($rootScope.usuarioLogueado == false) {
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
                   var permitir = PermisosService.verificaPermisos(next,'ADM');
                   if (!permitir.$$state.value) {
                       toastr.error('No autorizado');
                       window.location = "/index.html#/login";                            
                       ev.preventDefault();
                   }
                });
            });
           });
      
        function RouterProvider($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("home");

        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "app/GEN/home/homeGEN.html"//,
                // controller: 'homeGENCtrl' 
            })

            // REVISADO
            .state("roles", {
                url: "/roles",
                templateUrl: "app/GEN/Roles/RolesGet.html",
                controller: "RolesGetCtrl"
            })
            .state("rolesAdd", {
                 url: "/rolesAdd",
                 templateUrl: "app/GEN/Roles/RolesAdd.html",
                 controller: "RolesAddCtrl"
             })
            .state("rolesEdit", {
                url: "/rolesEdit/:id",
                templateUrl: "app/GEN/Roles/RolesEdit.html",
                controller: "RolesEditCtrl"
            })


            .state("rolpersona", {
                  url: "/rolpersona",
                  templateUrl: "app/GEN/RolPersona/RolPersonaGet.html",
                  controller: "RolPersonaGetCtrl"
            })
            .state("rolpersonaAdd", {
                 url: "/rolpersonaAdd",
                 templateUrl: "app/GEN/RolPersona/RolPersonaAdd.html",
                 controller: "RolPersonaAddCtrl"
            })
            .state("rolpersonaEdit", {
                url: "/rolpersonaEdit/:id",
                templateUrl: "app/GEN/RolPersona/RolPersonaEdit.html",
                controller: "RolPersonaEditCtrl"
            })
            
            //REVISADO
            .state("categorias", {
                url: "/categorias",
                templateUrl: "app/GEN/Categorias/CategoriasGet.html",
                controller: "CategoriasGetCtrl"
            })
            .state("categoriasAdd", {
                 url: "/categoriasAdd",
                 templateUrl: "app/GEN/Categorias/CategoriasAdd.html",
                 controller: "CategoriasAddCtrl"
             })
            .state("categoriasEdit", {
                url: "/categoriasEdit/:id",
                templateUrl: "app/GEN/Categorias/CategoriasEdit.html",
                controller: "CategoriasEditCtrl"
            })

            //REVISADO
            .state("plaza", {
                url: "/plaza",
                templateUrl: "app/GEN/Plaza/PlazaGet.html",
                controller: "PlazaGetCtrl"
            })
            .state("plazaAdd", {
                 url: "/plazaAdd",
                 templateUrl: "app/GEN/Plaza/PlazaAdd.html",
                 controller: "PlazaAddCtrl"
            })
            .state("plazaEdit", {
                url: "/plazaEdit/:id",
                templateUrl: "app/GEN/Plaza/PlazaEdit.html",
                controller: "PlazaEditCtrl"
            })

            //REVISADO
            .state("tipounidad", {
                url: "/tipounidad",
                templateUrl: "app/GEN/TipoUnidad/TipoUnidadGet.html",
                controller: "TipoUnidadGetCtrl"
            })
            .state("tipounidadAdd", {
                 url: "/tipounidadAdd",
                 templateUrl: "app/GEN/TipoUnidad/TipoUnidadAdd.html",
                 controller: "TipoUnidadAddCtrl"
            })
            .state("tipounidadEdit", {
                url: "/tipounidadEdit/:id",
                templateUrl: "app/GEN/TipoUnidad/TipoUnidadEdit.html",
                controller: "TipoUnidadEditCtrl"
            })

            //REVISADO
            .state("modulos", {
                url: "/modulos",
                templateUrl: "app/GEN/Modulos/ModulosGet.html",
                controller: "ModulosGetCtrl"
            })
            .state("modulosAdd", {
                 url: "/modulosAdd",
                 templateUrl: "app/GEN/Modulos/ModulosAdd.html",
                 controller: "ModulosAddCtrl"
             })
            .state("modulosEdit", {
                url: "/modulosEdit/:id",
                templateUrl: "app/GEN/Modulos/ModulosEdit.html",
                controller: "ModulosEditCtrl"
            })

            //REVISADO
            .state("tipopersonal", {
                url: "/tipopersonal",
                templateUrl: "app/GEN/TipoPersonal/TipoPersonalGet.html",
                controller: "TipoPersonalGetCtrl"
            })
            .state("tipopersonalAdd", {
                 url: "/tipopersonalAdd",
                 templateUrl: "app/GEN/TipoPersonal/TipoPersonalAdd.html",
                 controller: "TipoPersonalAddCtrl"
             })
            .state("tipopersonalEdit", {
                url: "/tipopersonalEdit/:id",
                templateUrl: "app/GEN/TipoPersonal/TipoPersonalEdit.html",
                controller: "TipoPersonalEditCtrl"
            })
                        
            // revisar edicion
            .state("funciones", {
                url: "/funciones/:id",
                templateUrl: "app/GEN/Funciones/FuncionesGet.html",
                controller: "FuncionesGetCtrl"
            })
            .state("funcionesAdd", {
                 url: "/funcionesAdd/:id",             
                 templateUrl: "app/GEN/Funciones/FuncionesAdd.html",
                 controller: "FuncionesAddCtrl"
             })
            .state("funcionesEdit", {
                url: "/funcionesEdit/:id",
                templateUrl: "app/GEN/Funciones/FuncionesEdit.html",
                controller: "FuncionesEditCtrl"
            })

            .state("personas", {
                url: "/personas",
                templateUrl: "app/GEN/Personas/PersonasGet.html",
                controller: "PersonasGetCtrl"
            })
            .state("personasAdd", {
                 url: "/personasAdd",
                 templateUrl: "app/GEN/Personas/PersonasAdd.html",
                 controller: "PersonasAddCtrl"
             })
            .state("personasEdit", {
                url: "/personasEdit/:id",
                templateUrl: "app/GEN/Personas/PersonasEdit.html",
                controller: "PersonasEditCtrl"
            })

            .state("unidad", {
                url: "/unidad",
                templateUrl: "app/GEN/Unidad/UnidadGet.html",
                controller: "UnidadGetCtrl"
            })
            .state("unidadAdd", {
                 url: "/unidadAdd",
                 templateUrl: "app/GEN/Unidad/UnidadAdd.html",
                 controller: "UnidadAddCtrl"
             })
            .state("unidadEdit", {
                url: "/unidadEdit/:id",
                templateUrl: "app/GEN/Unidad/UnidadEdit.html",
                controller: "UnidadEditCtrl"
            })
            .state("FiltraPersonal", {
                 url: "/FiltrarPersonal",
                 templateUrl: "app/GEN/Personas/PersonasFilter.html",
                 controller: "PersonasFilterCtrl"
             })
            .state("FiltrarProyecto", {
                  url: "/FiltrarProyecto",
                  templateUrl: "app/GEN/BuscarProyectos/ProyectosFilter.html",
                  controller: "ProyectosFilterCtrl"
             })
            .state("rolfunciones/", {
                url: "/rolfunciones/:id",
                templateUrl: "app/GEN/RolFunciones/RolFuncionesGet.html",
                controller: "RolFuncionesGetCtrl"
             })
            .state("rolfuncionesAdd", {
                 url: "/rolfuncionesAdd/:id",
                 templateUrl: "app/GEN/RolFunciones/RolFuncionesAdd.html",
                 controller: "RolFuncionesAddCtrl"
             })
            .state("rolfuncionesEdit", {
                url: "/rolfuncionesEdit",
                templateUrl: "app/GEN/RolFunciones/RolFuncionesEdit.html",
                controller: "RolFuncionesEditCtrl"
            })


    };
})();