//Para mayor informacion sobre los componentes que empiezan con el prefijo "uib", como calendarios y otros https://angular-ui.github.io/bootstrap/
(function () {
    "use strict";

    angular
        .module("ineelCH", ['ui.router',
            'ui.bootstrap',
            'LocalStorageModule',
            'ineel.CH.services',
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
            "chart.js",
            'googlechart',
            'ineel.controllers',
            'easypiechart',
            'uiSwitch',
            'ngTagsInput'
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
        .filter('highlight', function($sce) {
            return function(textoOriginal, palabraBuscada) {
              if (palabraBuscada){
                palabraBuscada=palabraBuscada.replace(/á/g, 'a').replace(/Á/g, 'A')
                                             .replace(/é/g, 'e').replace(/É/g, 'E')
                                             .replace(/í/g, 'i').replace(/Í/g, 'I')
                                             .replace(/ó/g, 'o').replace(/Ó/g, 'O')
                                             .replace(/ú/g, 'u').replace(/Ú/g, 'U');

                textoOriginal=textoOriginal.replace(/á/g, 'a').replace(/Á/g, 'A')
                                             .replace(/é/g, 'e').replace(/É/g, 'E')
                                             .replace(/í/g, 'i').replace(/Í/g, 'I')
                                             .replace(/ó/g, 'o').replace(/Ó/g, 'O')
                                             .replace(/ú/g, 'u').replace(/Ú/g, 'U');
                /*****ajuste */
                var arregloPalabras= palabraBuscada.split(' ');
                arregloPalabras.forEach(function(elemento){
                    textoOriginal = textoOriginal.replace(new RegExp('('+elemento+')', 'gi'),'<span style="background:yellow">$1</span>')    
                })
                /*****end ajuste */
                // textoOriginal = textoOriginal.replace(new RegExp('('+palabraBuscada+')', 'gi'),'<span style="background:yellow">$1</span>')
               
              }
              return $sce.trustAsHtml(textoOriginal)
            }
        })
        .filter('capitalize', function() {
            return function(texto) {
                if(texto)
                texto=texto.toLowerCase();
              return texto.charAt(0).toUpperCase() + texto.replace(texto.charAt(0),'');
            }
        })
        .filter('capitalizarGuiones', function() {
            return function(texto) {
                if(texto)
                texto=texto.toLowerCase();
                var finalText=texto.charAt(0).toUpperCase();
                texto=texto.replace(texto.charAt(0),'');
                var textArray= texto.split("-");
                for(var c=0; c< textArray.length; c++ ){
                    finalText+= textArray[c]+" ";
                }
              return finalText;
            }
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
            $rootScope.globalRegresarAdminCH = function () {
                try {
                    if ($rootScope.origen != undefined && $rootScope.origen != null) {
                        if ($rootScope.origen == "Solicitudes") {
                            window.location = "IndexCH.html#/solicitudesrh";
                        }
                        else {
                            $window.history.back();
                        }
                    }
                } catch (Error) { }
            }
            $rootScope.globalRegresar = function () {

                try {
                    $window.history.back();
                } catch (e) {
                    
                    //$state.go("home");
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

            $rootScope.getRolId=function(clave){
                return MenuService.getRolId(clave)
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
                        console.log("/indexCH.html#" + to.url);
                        MenuService.setReturnUrl("/indexCH.html#" + to.url);
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
                    var permitir = PermisosService.verificaPermisos(next, 'CH');
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
            .state("home", {
                url: "/home",
                templateUrl: "app/CH/home/homeCH.html",
                controller: "homeCHCtrl"
            })
            .state("fichapersonal", {
                url: "/fichapersonal/:seccion",
                templateUrl: "app/CH/inventario/inventarioRH.html",
                controller: "inventarioRHCtrl"
            })
            .state("catalogosrh", {
                url: "/catalogosrh",
                templateUrl: "app/CH/inventario/_template/catalogosrh.html",
                controller: "catalogosRHCtrl"
            })
            .state("fichapersonal.fa", {
                views: {
                    'formacionacademica': {
                        url: "/formacionacademica",
                        templateUrl: "app/CH/formacionacademica/formacionacademicasGet.html",
                        controller: "formacionacademicaGetCtrl"
                    }
                }
            })
            .state("formacionadd", {
                url: "/agregarformacion",
                templateUrl: "app/CH/formacionacademica/formacionacademicaAdd.html",
                controller: "formacionacademicaAddCtrl"
            })
            .state("formacionedit", {
                url: "/editarformacion/",
                templateUrl: "app/CH/formacionacademica/formacionacademicaEdit.html",
                controller: "formacionacdemicaEditCtrl"
            })
            .state("formaciondetail", {
                url: "/detalleformacion/:id/:id2",
                templateUrl: "app/CH/formacionacademica/formacionacademicaDetails.html",
                controller: "formacionacademicaDetailsCtrl"
            })
            .state("fichapersonal.aptitudes", {
                views: {
                    'aptitudes': {
                        url: "/aptitudes",
                        templateUrl: "app/CH/aptitudes/aptitudesGet.html",
                        controller: "aptitudesGetCtrl"
                    }
                },
                access: "anonymous"
            })
            .state("fichapersonal.idiomas", {
                views: {
                    'idiomas': {
                        url: "/idiomas",
                        templateUrl: "app/CH/idiomas/idiomasGet.html",
                        controller: "idiomasGetCtrl"
                    }
                }
            })
            .state("idiomasadd", {
                url: "/agregaridiomas",
                templateUrl: "app/CH/idiomas/idiomasAdd.html",
                controller: "idiomasAddCtrl"
            })
            .state("idiomasedit", {
                url: "/editaridiomas/",
                templateUrl: "app/CH/idiomas/idiomasEdit.html",
                controller: "idiomasEditCtrl"
            })
            .state("idiomadetails", {
                url: "/detalleidiomas/:id/:id2",
                templateUrl: "app/CH/idiomas/idiomasDetails.html",
                controller: "idiomasDetailsCtrl"
            })
            .state("inventariorh.contruccion", {
                url: "/construccion",
                templateUrl: "app/CH/idiomas/construccion.html",
                controller: "homeCHCtrl"
            })
            .state("fichapersonal.sni", {
                views: {
                    'sni': {
                        url: "/sni",
                        templateUrl: "app/CH/sni/sniGet.html",
                        controller: "sniGetCtrl"
                    }
                }
            })
            .state("sniadd", {
                url: "/agregarsni",
                templateUrl: "app/CH/sni/sniAdd.html",
                controller: "sniAddCtrl"
            })
            .state("sniedit", {
                url: "/editarsni/",
                templateUrl: "app/CH/sni/sniEdit.html",
                controller: "sniEditCtrl"
            })
            .state("snidetail", {
                url: "/detallesni/:id/:id2",
                templateUrl: "app/CH/sni/sniDetails.html",
                controller: "sniDetailsCtrl"
            })
            .state("fichapersonal.distincion", {
                views: {
                    'distincion': {
                        url: "/distincion",
                        templateUrl: "app/CH/distincion/distincionGet.html",
                        controller: "distincionGetCtrl"
                    }
                }
            })
            .state("distincionadd", {
                url: "/agregardistincion",
                templateUrl: "app/CH/distincion/distincionAdd.html",
                controller: "distincionAddCtrl"
            })
            .state("distinciondetail", {
                url: "/detalledistincion/:id/:id2",
                templateUrl: "app/CH/distincion/distincionDetails.html",
                controller: "distincionDetailCtrl"
            })
            .state("distincionedit", {
                url: "/editardistincion/",
                templateUrl: "app/CH/distincion/distincionEdit.html",
                controller: "distincionEditCtrl"
            })
            .state("catalogosrh.AmbitoGet", {
                url: "/ambito",
                templateUrl: "app/CH/Ambito/AmbitoGet.html",
                controller: "AmbitoCtrlGet"
            })
            .state("AmbitoEdit", {
                url: "/editarambito/:id",
                templateUrl: "app/CH/Ambito/AmbitoEdit.html",
                controller: "AmbitoCtrlEdit"
            })
            .state("AmbitoAdd", {
                url: "/agregarambito",
                templateUrl: "app/CH/Ambito/AmbitoAdd.html",
                controller: "AmbitoCtrlAdd"
            })
            .state("catalogosrh.AreaSNIGet", {
                url: "/areasni",
                templateUrl: "app/CH/AreaSNI/AreaSNIGet.html",
                controller: "AreaSNICtrlGet"
            })
            .state("AreaSNIEdit", {
                url: "/editarareasni/:id",
                templateUrl: "app/CH/AreaSNI/AreaSNIEdit.html",
                controller: "AreaSNICtrlEdit"
            })
            .state("AreaSNiAdd", {
                url: "/agregarareasni",
                templateUrl: "app/CH/AreaSNI/AreaSNIAdd.html",
                controller: "AreaSNICtrlAdd"
            })
            .state("catalogosrh.AsistenteGet", {
                url: "/asistente",
                templateUrl: "app/CH/Asistente/AsistenteGet.html",
                controller: "AsistenteCtrlGet"
            })
            .state("asistenteEdit", {
                url: "/editarasistente/:id",
                templateUrl: "app/CH/Asistente/AsistenteEdit.html",
                controller: "AsistenteCtrlEdit"
            })
            .state("asistenteAdd", {
                url: "/agregarasistente",
                templateUrl: "app/CH/Asistente/AsistenteAdd.html",
                controller: "AsistenteCtrlAdd"
            })
            .state("catalogosrh.EncargadoDespachoGet", {
                url: "/encargadodespacho",
                templateUrl: "app/CH/EncargadoDespacho/EncargadoDespachoGet.html",
                controller: "EncargadoDespachoCtrlGet"
            })
            .state("EncargadoDespachoEdit", {
                url: "/editarencargadodespacho/",
                templateUrl: "app/CH/EncargadoDespacho/EncargadoDespachoEdit.html",
                controller: "EncargadoDespachoCtrlEdit"
            })
            .state("EncargadoDespachoAdd", {
                url: "/agregarencargadodespacho",
                templateUrl: "app/CH/EncargadoDespacho/EncargadoDespachoAdd.html",
                controller: "EncargadoDespachoCtrlAdd"
            })
            .state("catalogosrh.AsociacionGet", {
                url: "/asociaciones",
                templateUrl: "app/CH/Asociaciones/AsociacionGet.html",
                controller: "AsociacionCtrlGet"
            })
            .state("AsociacionEdit", {
                url: "/editarasociacion/:id",
                templateUrl: "app/CH/Asociaciones/AsociacionEdit.html",
                controller: "AsociacionCtrlEdit"
            })
            .state("AsociacionAdd", {
                url: "/agregarasociacion",
                templateUrl: "app/CH/Asociaciones/AsociacionAdd.html",
                controller: "AsociacionCtrlAdd"
            })
            .state("catalogosrh.CamposGet", {
                url: "/campos",
                templateUrl: "app/CH/Campo/CampoGet.html",
                controller: "CampoCtrlGet"
            })
            .state("CampoEdit", {
                url: "/editarcampo/:id",
                templateUrl: "app/CH/Campo/CampoEdit.html",
                controller: "CampoCtrlEdit"
            })
            .state("CampoAdd", {
                url: "/agregarcampo",
                templateUrl: "app/CH/Campo/CampoAdd.html",
                controller: "CampoCtrlAdd"
            })
            .state("catalogosrh.CarreraGet", {
                url: "/carreras",
                templateUrl: "app/CH/Carrera/CarreraGet.html",
                controller: "CarreraCtrlGet"
            })
            .state("CarreraEdit", {
                url: "/editarcarrera/:id",
                templateUrl: "app/CH/Carrera/CarreraEdit.html",
                controller: "CarreraCtrlEdit"
            })
            .state("CarreraAdd", {
                url: "/agregarcarrera",
                templateUrl: "app/CH/Carrera/CarreraAdd.html",
                controller: "CarreraCtrlAdd"
            })
            .state("catalogosrh.DisciplinaGet", {
                url: "/disciplinas",
                templateUrl: "app/CH/Disciplinas/DisciplinaGet.html",
                controller: "DisciplinaCtrlGet"
            })
            .state("DisciplinaAdd", {
                url: "/agregardisciplina",
                templateUrl: "app/CH/Disciplinas/DisciplinaAdd.html",
                controller: "DisciplinaCtrlAdd"
            })
            .state("DisciplinaEdit", {
                url: "/editardisciplina/:id",
                templateUrl: "app/CH/Disciplinas/DisciplinaEdit.html",
                controller: "DisciplinaCtrlEdit"
            })
            .state("catalogosrh.TipoBecaGet", {
                url: "/tipobecas",
                templateUrl: "app/CH/TipoBeca/TipoBecaGet.html",
                controller: "TipoBecaCtrlGet"
            })
            .state("TipoBecaAdd", {
                url: "/agregartipobeca",
                templateUrl: "app/CH/TipoBeca/TipoBecaAdd.html",
                controller: "TipoBecaCtrlAdd"
            })
            .state("TipoBecaEdit", {
                url: "/editartipobeca/:id",
                templateUrl: "app/CH/TipoBeca/TipoBecaEdit.html",
                controller: "TipoBecaCtrlEdit"
            })
            .state("catalogosrh.BecaInternaGet", {
                url: "/becainterna",
                templateUrl: "app/CH/BecasInternas/BecaInternaGet.html",
                controller: "BecasInternasCtrlGet"
            })
            .state("BecaInternaAdd", {
                url: "/agregarbecainterna",
                templateUrl: "app/CH/BecasInternas/BecaInternaAdd.html",
                controller: "BecasInternasCtrlAdd"
            })
            .state("BecaInternaEdit", {
                url: "/editarbecainterna/:id",
                templateUrl: "app/CH/BecasInternas/BecaInternaEdit.html",
                controller: "BecasInternasCtrlEdit"
            })
            .state("catalogosrh.CongresoGet", {
                url: "/congresos",
                templateUrl: "app/CH/Congreso/CongresoGet.html",
                controller: "CongresoCtrlGet"
            })
            .state("CongresoAdd", {
                url: "/agregarcongreso",
                templateUrl: "app/CH/Congreso/CongresoAdd.html",
                controller: "CongresoCtrlAdd"
            })
            .state("CongresoEdit", {
                url: "/editarcongreso/:id",
                templateUrl: "app/CH/Congreso/CongresoEdit.html",
                controller: "CongresoCtrlEdit"
            })
            .state("catalogosrh.EstadoPublicacionGet", {
                url: "/estadopublicacion",
                templateUrl: "app/CH/EstadoPublicacion/EstadoPublicacionGet.html",
                controller: "EstadoPublicacionCtrlGet"
            })
            .state("EstadoPublicacionAdd", {
                url: "/agregarestadopublicacion",
                templateUrl: "app/CH/EstadoPublicacion/EstadoPublicacionAdd.html",
                controller: "EstadoPublicacionCtrlAdd"
            })
            .state("EstadoPublicacionEdit", {
                url: "/editarestadopublicacion/:id",
                templateUrl: "app/CH/EstadoPublicacion/EstadoPublicacionEdit.html",
                controller: "EstadoPublicacionCtrlEdit"
            })
            .state("catalogosrh.EventoGet", {
                url: "/evento",
                templateUrl: "app/CH/Eventos/EventoGet.html",
                controller: "EventoCtrlGet"
            })
            .state("EventoAdd", {
                url: "/agregarevento",
                templateUrl: "app/CH/Eventos/EventoAdd.html",
                controller: "EventoCtrlAdd"
            })
            .state("EventoEdit", {
                url: "/editarevento/:id",
                templateUrl: "app/CH/Eventos/EventoEdit.html",
                controller: "EventoCtrlEdit"
            })
            .state("catalogosrh.IdiomaGet", {
                url: "/idioma",
                templateUrl: "app/CH/Idioma/IdiomaGet.html",
                controller: "IdiomaCtrlGet"
            })
            .state("IdiomaAdd", {
                url: "/agregaridioma",
                templateUrl: "app/CH/Idioma/IdiomaAdd.html",
                controller: "IdiomaCtrlAdd"
            })
            .state("IdiomaEdit", {
                url: "/editaridioma/:id",
                templateUrl: "app/CH/Idioma/IdiomaEdit.html",
                controller: "IdiomaCtrlEdit"
            })
            .state("catalogosrh.GradoAcademicoGet", {
                url: "/gradoacademico",
                templateUrl: "app/CH/GradoAcademico/GradoAcademicoGet.html",
                controller: "GradoAcademicoCtrlGet"
            })
            .state("GradoAcademicoAdd", {
                url: "/agregargradoacademico",
                templateUrl: "app/CH/GradoAcademico/GradoAcademicoAdd.html",
                controller: "GradoAcademicoCtrlAdd"
            })
            .state("GradoAcademicoEdit", {
                url: "/editargradoacademico/:id",
                templateUrl: "app/CH/GradoAcademico/GradoAcademicoEdit.html",
                controller: "GradoAcademicoCtrlEdit"
            })
            .state("catalogosrh.InstitucionGet", {
                url: "/institucion",
                templateUrl: "app/CH/Institucion/InstitucionGet.html",
                controller: "InstitucionCtrlGet"
            })
            .state("InstitucionAdd", {
                url: "/agregarinstitucion",
                templateUrl: "app/CH/Institucion/InstitucionAdd.html",
                controller: "InstitucionCtrlAdd"
            })
            .state("InstitucionEdit", {
                url: "/editarinstitucion/:id",
                templateUrl: "app/CH/Institucion/InstitucionEdit.html",
                controller: "InstitucionCtrlEdit"
            })
            .state("catalogosrh.NivelCursoGet", {
                url: "/nivelcurso",
                templateUrl: "app/CH/NivelCurso/NivelCursoGet.html",
                controller: "NivelCursoCtrlGet"
            })
            .state("NivelCursoAdd", {
                url: "/agregarnivelcurso",
                templateUrl: "app/CH/NivelCurso/NivelCursoAdd.html",
                controller: "NivelCursoCtrlAdd"
            })
            .state("NivelCursoEdit", {
                url: "/editarnivelcurso/:id",
                templateUrl: "app/CH/NivelCurso/NivelCursoEdit.html",
                controller: "NivelCursoCtrlEdit"
            })
            .state("catalogosrh.NivelPublicacionGet", {
                url: "/nivelpublicacion",
                templateUrl: "app/CH/NivelPublicacion/NivelPublicacionGet.html",
                controller: "NivelPublicacionCtrlGet"
            })
            .state("NivelPublicacionAdd", {
                url: "/agregarnivelpublicacion",
                templateUrl: "app/CH/NivelPublicacion/NivelPublicacionAdd.html",
                controller: "NivelPublicacionCtrlAdd"
            })
            .state("NivelPublicacionEdit", {
                url: "/editarnivelpublicacion/:id",
                templateUrl: "app/CH/NivelPublicacion/NivelPublicacionEdit.html",
                controller: "NivelPublicacionCtrlEdit"
            })
            .state("catalogosrh.NivelSNIGet", {
                url: "/nivelsni",
                templateUrl: "app/CH/NivelSNI/NivelSNIGet.html",
                controller: "NivelSNICtrlGet"
            })
            .state("NivelSNIAdd", {
                url: "/agregarnivelsni",
                templateUrl: "app/CH/NivelSNI/NivelSNIAdd.html",
                controller: "NivelSNICtrlAdd"
            })
            .state("NivelSNIEdit", {
                url: "/editarnivelsni/:id",
                templateUrl: "app/CH/NivelSNI/NivelSNIEdit.html",
                controller: "NivelSNICtrlEdit"
            })
            .state("catalogosrh.PaisGet", {
                url: "/pais",
                templateUrl: "app/CH/Pais/PaisGet.html",
                controller: "PaisCtrlGet"
            })
            .state("PaisAdd", {
                url: "/agregarpais",
                templateUrl: "app/CH/Pais/PaisAdd.html",
                controller: "PaisCtrlAdd"
            })
            .state("PaisEdit", {
                url: "/editarpais/:id",
                templateUrl: "app/CH/Pais/PaisEdit.html",
                controller: "PaisCtrlEdit"
            })
            .state("catalogosrh.RevistaGet", {
                url: "/revista",
                templateUrl: "app/CH/Revista/RevistaGet.html",
                controller: "RevistaCtrlGet"
            })
            .state("RevistaAdd", {
                url: "/agregarrevista",
                templateUrl: "app/CH/Revista/RevistaAdd.html",
                controller: "RevistaCtrlAdd"
            })
            .state("RevistaEdit", {
                url: "/editarrevista/:id",
                templateUrl: "app/CH/Revista/RevistaEdit.html",
                controller: "RevistaCtrlEdit"
            })
            .state("SolicitudAcceso", {
                url: "/SolicitudesAcceso",
                templateUrl: "app/vistasGenericas/SolicitudAcceso/SolicitudAccesoGet.html",
                controller: "SolicitudesAcceso"
            })
            .state("solicitudesrh", {
                url: "/solicitudesrh",
                templateUrl: "app/CH/Admin/solicitudes/SolicitudesGet.html",
                controller: "SolicitudesCtrlGet"
            })
            .state("FormacionAcademicaDetailsAdmin", {
                url: "/detallesformacionacademica/:id/:id2",
                templateUrl: "app/CH/Admin/formacionAcademica/formacionAcademicaDetails.html",
                controller: "formacionacademicaDetallesCtrl"
            })
            .state("IdiomaDetailsAdmin", {
                url: "/detallesidiomas/:id/:id2",
                templateUrl: "app/CH/Admin/idiomas/idiomasDetalles.html",
                controller: "idiomasDetallesCtrl"
            })
            .state("DistincionDetailsAdmin", {
                url: "/detallesdistincion/:id/:id2",
                templateUrl: "app/CH/Admin/distincion/distincionDetalles.html",
                controller: "distincionDetallesCtrl"
            })
            .state("SNIDetailsAdmin", {
                url: "/detallessni/:id/:id2",
                templateUrl: "app/CH/Admin/sni/sniDetalles.html",
                controller: "sniDetallesCtrl"
            })
            .state("fichapersonal.becarioexterno", {
                views: {
                    'becarioexterno': {
                        url: "/becarioexterno",
                        templateUrl: 'app/CH/BecarioExterno/BecarioExternoGet.html',
                        controller: 'BecarioExternoGetCtrl'
                    }
                }
            }).state('BecarioExternoAdd', {
                url: '/BecarioExternoAdd',
                templateUrl: 'app/CH/BecarioExterno/BecarioExternoAdd.html',
                controller: 'BecarioExternoAddCtrl'
            }).state("BecarioExternoEdit", {
                url: "/BecarioExternoEdit/",
                templateUrl: "app/CH/BecarioExterno/BecarioExternoEdit.html",
                controller: "BecarioExternoEditCtrl"
            }).state("BecarioExternoDetails", {
                url: "/BecarioExternoDetails/:id/:id2",
                templateUrl: "app/CH/BecarioExterno/BecarioExternoDetails.html",
                controller: "BecarioExternoDetailsCtrl"
            })
            .state("fichapersonal.asociacion", {
                views: {
                    'Asociaciones': {
                        url: "/asociacion",
                        templateUrl: "app/CH/asociacion/asociacionGet.html",
                        controller: "asociacionGetCtrl"
                    }
                }
            })
            .state("asociacionesAdd", {
                url: "/agregarasociaciones",
                templateUrl: "app/CH/asociacion/asociacionAdd.html",
                controller: "AsociacionesCtrlAdd"
            })
            .state("asociacionesEdit", {
                url: "/editarasociaciones/",
                templateUrl: "app/CH/asociacion/asociacionEdit.html",
                controller: "AsociacionesCtrlEdit"
            })
            .state("asociacionesDetails", {
                url: "/detallesasociacion/:id/:id2",
                templateUrl: "app/CH/asociacion/asociacionDetails.html",
                controller: "asociacionDetailsCtrl"
            })
            .state("AsociacionDetailsAdmin", {
                url: "/detalleasociacion/:id/:id2",
                templateUrl: "app/CH/Admin/asociacion/asociacionDetalles.html",
                controller: "asociacionDetallesCtrl"
            })
            .state("fichapersonal.becariointerno", {
                views: {
                    'becariointerno': {
                        url: "/becariointerno",
                        templateUrl: "app/CH/BecarioInerno/BecarioInernoGet.html",
                        controller: "becariointernoGetCtrl"
                    }
                }
            })
            
            // .state("BecarioInternoDetailsAdmin", {
            //     url: "/detallebecariointerno/:id/:id2",
            //     templateUrl: "app/CH/Admin/BecarioInerno/BecarioInernoDetalles.html",
            //     controller: "becariointernoDetallesCtrl"
            // })
            .state("fichapersonal.tesisdirigida", {
                views: {
                    'tesisdirigida': {
                        url: "/tesisdirigida",
                        templateUrl: "app/CH/TesisDirigida/TesisDirigidaGet.html",
                        controller: "tesisdirigidaGetCtrl"
                    }
                }
            })
            .state("tesisdirigidaAdd", {
                url: "/agregartesisdirigida",
                templateUrl: "app/CH/TesisDirigida/TesisDirigidaAdd.html",
                controller: "tesisdirigidaAddCtrl"
            })
            .state("tesisdirigidaEdit", {
                url: "/editartesisdirigida/",
                templateUrl: "app/CH/TesisDirigida/TesisDirigidaEdit.html",
                controller: "tesisdirigidaEditCtrl"
            })
            .state("tesisdirigidaDetails", {
                url: "/detallestesisdirigida/:id/:id2",
                templateUrl: "app/CH/TesisDirigida/TesisDirigidaDetails.html",
                controller: "tesisdirigidaDetailsCtrl"
            })
            .state("TesisDirigidaDetailsAdmin", {
                url: "/detalletesisdirigida/:id/:id2",
                templateUrl: "app/CH/Admin/tesisDirigida/TesisDirigidaDetalles.html",
                controller: "tesisdirigidaDetallesCtrl"
            })
            .state("BecarioExternoDetailsAdmin", {
                url: "/detallesbecarioexterno/:id/:id2",
                templateUrl: "app/CH/Admin/becarioExterno/BecarioExternoDetalles.html",
                controller: "becarioexternoDetallesCtrl"
            })
            .state("catalogosrh.certificaciones", {
                url: "/certificaciones",
                templateUrl: "app/CH/Certificaciones/CertificacionesGet.html",
                controller: "CertificacionesCtrlGet"
            })
            .state("CertificacionesAdd", {
                url: "/agregarcertificacion",
                templateUrl: "app/CH/Certificaciones/CertificacionesAdd.html",
                controller: "CertificacionesCtrlAdd"
            })
            .state("CertificacionesEdit", {
                url: "/editarcertificacion/:id",
                templateUrl: "app/CH/Certificaciones/CertificacionesEdit.html",
                controller: "CertificacionesCtrlEdit"
            })
            .state("fichapersonal.becariodirigido", {
                views: {
                    'becariodirigido': {
                        url: "/becariodirigido",
                        templateUrl: "app/CH/BecarioDirigido/BecarioDirigidoGet.html",
                        controller: "becariodirigidoCtrlGet"
                    }
                }
            })
            .state("becariodirigidoAdd", {
                url: "/agregarbecariodirigido",
                templateUrl: "app/CH/BecarioDirigido/BecarioDirigidoAdd.html",
                controller: "becariodirigidoCtrlAdd"
            })
            .state("becariodirigidoEdit", {
                url: "/editarbecariodirigido/",
                templateUrl: "app/CH/BecarioDirigido/BecarioDirigidoEdit.html",
                controller: "becariodirigidoCtrlEdit"
            })
            .state("becariodirigidoDetails", {
                url: "/detallesbecariodirigido/:id/:id2",
                templateUrl: "app/CH/BecarioDirigido/BecarioDirigidoDetail.html",
                controller: "becariodirigidoCtrlDetail"
            })
            .state("BecarioDirigidoDetailsAdmin", {
                url: "/detallebecariodirigido/:id/:id2",
                templateUrl: "app/CH/Admin/becarioDirigido/BecarioDirigidoDetails.html",
                controller: "becariodirigidoDetallesCtrl"
            })
            .state("fichapersonal.experienciadocente", {
                views: {
                    'experienciadocente': {
                        url: "/experienciadocente",
                        templateUrl: "app/CH/experienciaDocente/ExperienciaDocenteGet.html",
                        controller: "experienciadocenteCtrlGet"
                    }
                }
            })
            .state("experienciadocenteAdd", {
                url: "/agregarexperienciadocente",
                templateUrl: "app/CH/experienciaDocente/ExperienciaDocenteAdd.html",
                controller: "experienciadocenteCtrlAdd"
            })
            .state("experienciadocenteEdit", {
                url: "/editarexperienciadocente/",
                templateUrl: "app/CH/experienciaDocente/ExperienciaDocenteEdit.html",
                controller: "experienciadocenteCtrlEdit"
            })
            .state("experienciadocenteDetails", {
                url: "/detallesexperienciadocente/:id/:id2",
                templateUrl: "app/CH/experienciaDocente/ExperienciaDocenteDetails.html",
                controller: "experienciadocenteCtrlDetails"
            })
            .state("ExperienciaDocenteDetailsAdmin", {
                url: "/detalleexperienciadocente/:id/:id2",
                templateUrl: "app/CH/Admin/experienciaDocente/ExperienciaDocenteDetails.html",
                controller: "experienciadocenteDetallesCtrl"
            })
            .state("fichapersonal.experienciaexterna", {
                views: {
                    'experienciaexterna': {
                        url: "/experienciaexterna",
                        templateUrl: "app/CH/experienciaExterna/ExperienciaExternaGet.html",
                        controller: "experienciaexternaCtrlGet"
                    }
                }
            })
            .state("experienciaexternaAdd", {
                url: "/agregarexperienciaexterna",
                templateUrl: "app/CH/experienciaExterna/ExperienciaExternaAdd.html",
                controller: "experienciaexternaCtrlAdd"
            })
            .state("experienciaexternaEdit", {
                url: "/editarexperienciaexterna/",
                templateUrl: "app/CH/experienciaExterna/ExperienciaExternaEdit.html",
                controller: "experienciaexternaCtrlEdit"
            })
            .state("experienciaexternaDetails", {
                url: "/detallesexperienciaexterna/:id/:id2",
                templateUrl: "app/CH/experienciaExterna/ExperienciaExternaDetails.html",
                controller: "experienciaexternaCtrlDetails"
            })
            .state("ExperienciaExternaDetailsAdmin", {
                url: "/detalleexperienciaexterna/:id/:id2",
                templateUrl: "app/CH/Admin/experienciaExterna/ExperienciaExternaDetails.html",
                controller: "experienciaexternaDetallesCtrl"
            })
            .state("fichapersonal.publicacion", {
                views: {
                    'publicacion': {
                        url: "/publicacion",
                        templateUrl: "app/CH/publicacion/PublicacionGet.html",
                        controller: "publicacionCtrlGet"
                    }
                }
            }).state("fichapersonal.capitulo", {
                views: {
                    'capitulo': {
                        url: "/capitulo",
                        templateUrl: "app/CH/Capitulos/CapitulosGet.html",
                        controller: "capitulosCtrlGet",
                        access: "anonymous"
                    }
                },
                access: "anonymous"
            })
            .state("publicacionAdd", {
                url: "/agregarpublicacion",
                templateUrl: "app/CH/publicacion/PublicacionAdd.html",
                controller: "publicacionCtrlAdd"
            })
            .state("publicacionEdit", {
                url: "/editarpublicacion/",
                templateUrl: "app/CH/publicacion/PublicacionEdit.html",
                controller: "publicacionCtrlEdit"
            })
            .state("publicacionDetails", {
                url: "/detallespublicacion/:id",
                templateUrl: "app/CH/publicacion/PublicacionDetails.html",
                controller: "publicacionCtrlDetails"
            })
            .state("publicacionGerenteInfo", {
                url: "/informacionpublicacion/:id",
                templateUrl: "app/CH/Admin/publicacion/PublicacionInfo.html",
                controller: "publicacionInfoCtrlDetails"
            })
            .state("PublicacionDetailsAdmin", {
                url: "/detallepublicacion/:id/:id2",
                templateUrl: "app/CH/Admin/publicacion/PublicacionDetails.html",
                controller: "publicacionDetallesCtrl"
            })
            .state("publicacionDetailsGerente", {
                url: "/detallepublicaciones/:id/:id2",
                templateUrl: "app/CH/Admin/publicacion/PublicacionDetailsGerente.html",
                controller: "publicacionCtrlDetailsGerente"
            })
            .state("fichapersonal.ponencia", {
                views: {
                    'ponencia': {
                        url: "/ponencia",
                        templateUrl: "app/CH/ponencia/PonenciaGet.html",
                        controller: "ponenciaCtrlGet"
                    }
                }
            })
            .state("ponenciaAdd", {
                url: "/agregarponencia",
                templateUrl: "app/CH/ponencia/PonenciaAdd.html",
                controller: "ponenciaCtrlAdd"
            })
            .state("ponenciaEdit", {
                url: "/editarponencia/",
                templateUrl: "app/CH/ponencia/PonenciaEdit.html",
                controller: "ponenciaCtrlEdit"
            })
            .state("ponenciaDetails", {
                url: "/detallesponencia/:id",
                templateUrl: "app/CH/ponencia/PonenciaDetails.html",
                controller: "ponenciaCtrlDetails"
            })
            .state("ponenciaGerenteInfo", {
                url: "/informacionponencia/:id",
                templateUrl: "app/CH/Admin/ponencia/PonenciaInfo.html",
                controller: "ponenciaInfoCtrlDetails"
            })
            .state("PonenciaDetailsAdmin", {
                url: "/detalleponencia/:id/:id2",
                templateUrl: "app/CH/Admin/ponencia/PonenciaDetails.html",
                controller: "ponenciaDetallesCtrl"
            })
            .state("ponenciaDetailsGerente", {
                url: "/detalleponencias/:id/:id2",
                templateUrl: "app/CH/Admin/ponencia/PonenciaDetailsGerente.html",
                controller: "ponenciaCtrlDetailsGerente"
            })
            .state("capituloGerenteInfo", {
                url: "/informacioncapitulo/:id",
                templateUrl: "app/CH/Admin/capitulo/CapituloInfo.html",
                controller: "capituloInfoCtrlDetails"
            })
            .state("capituloDetailsAdmin", {
                url: "/detallecapitulo/:id/:id2",
                templateUrl: "app/CH/Admin/capitulo/CapituloDetails.html",
                controller: "capituloDetallesCtrl"
            })
            .state("capituloDetailsGerente", {
                url: "/detallecapitulos/:id/:id2",
                templateUrl: "app/CH/Admin/capitulo/CapituloDetailsGerente.html",
                controller: "capituloCtrlDetailsGerente"
            })
            .state("fichapersonal.participacion", {
                views: {
                    'participacion': {
                        url: "/participacion",
                        templateUrl: "app/CH/participacionProyecto/ParticipacionGet.html",
                        controller: "participacionCtrlGet"
                    }
                }
            })
            .state("participacionAdd", {
                url: "/agregarparticipacion",
                templateUrl: "app/CH/participacionProyecto/ParticipacionAdd.html",
                controller: "participacionCtrlAdd"
            })
            .state("participacionEdit", {
                url: "/editarparticipacion/",
                templateUrl: "app/CH/participacionProyecto/ParticipacionEdit.html",
                controller: "participacionCtrlEdit"
            })
            .state("participacionDetails", {
                url: "/detallesparticipacion/:id/:id2",
                templateUrl: "app/CH/participacionProyecto/ParticipacionDetails.html",
                controller: "participacionCtrlDetails"
            })
            .state("ParticipacionDetailsAdmin", {
                url: "/detalleparticipacion/:id/:id2",
                templateUrl: "app/CH/Admin/participacionProyecto/ParticipacionDetalles.html",
                controller: "participacionDetallesCtrl"
            })
            .state("ParticipacionDetailsGerente", {
                url: "/detallparticipacion/:id/:id2",
                templateUrl: "app/CH/Admin/participacionProyecto/ParticipacionDetallesGerente.html",
                controller: "participacionCtrlDetailsGerente"
            })
            .state("fichapersonal.cursointerno", {
                views: {
                    'cursointerno': {
                        url: "/cursointerno",
                        templateUrl: "app/CH/cursointerno/CursoInternoGet.html",
                        controller: "cursointernoCtrlGet"
                    }
                }
            })
            .state('cursointernoAdd', {
                url: '/agregarcurso',
                templateUrl: 'app/CH/cursointerno/CursosPersonalAdd.html',
                controller: 'cursointernoAddCtrl'
            })
            .state('cursointernoEdit', {
                url: '/editarcurso/',
                templateUrl: 'app/CH/cursointerno/CursosPersonalEdit.html',
                controller: 'cursointernoEditCtrl'
            })
            .state('cursointernoDetails', {
                url: '/detallescursointerno/:id',
                templateUrl: 'app/CH/cursointerno/CursosPersonalDetails.html',
                controller: 'cursointernoDetailsCtrl'
            })
            .state("CatInvestigadores", {
                url: "/catalogoinvestigadores",
                templateUrl: "app/CH/Reportes/catalogoIvestigadores.html",
                controller: "catalogoInvestigadoresCtrl"
            })
            .state("edadpromedio", {
                url: "/edadpromedio",
                templateUrl: "app/CH/Reportes/edadpromedio.html",
                controller: "edadpromedioCtrl"
            })
            .state("perfilcurricularcolectivo", {
                url: "/perfilcurricularcolectivo",
                templateUrl: "app/CH/Reportes/perfilcurricularcolectivo.html",
                controller: "perfilcurricularcolectivoCtrl"
            })
            .state("piramidecategorias", {
                url: "/piramidecategorias",
                templateUrl: "app/CH/Reportes/piramidecategorias.html",
                controller: "piramidecategoriasCtrl"
            })
            .state("investigadoresgerencia", {
                url: "/investigadoresgerencia",
                templateUrl: "app/CH/Reportes/investigadoresgerencia.html",
                controller: "investigadoresgerenciaCtrl"
            })
            .state("investigadoresdisciplina", {
                url: "/investigadoresdisciplina",
                templateUrl: "app/CH/Reportes/investigadoresdisciplina.html",
                controller: "investigadoresdisciplinaCtrl"
            })
            .state("composicionespescialidades", {
                url: "/composicionespescialidades",
                templateUrl: "app/CH/Reportes/composicionespescialidades.html",
                controller: "composicionespescialidadesCtrl"
            })
            .state("gradossni", {
                url: "/gradossni",
                templateUrl: "app/CH/Reportes/gradossni.html",
                controller: "gradossniCtrl"
            })
            .state("evolucionplantilla", {
                url: "/evolucionplantilla",
                templateUrl: "app/CH/Reportes/evolucionplantilla.html",
                controller: "evolucionplantillaCtrl"
            })
            .state("consultascomunidad", {
                url: "/consultascomunidad",
                templateUrl: "app/CH/ConsultasIIE/listaconsultas.html"
            })
            .state("personalinvestigacion", {
                url: "/personalinvestigacion",
                templateUrl: "app/CH/ConsultasIIE/personalinvestigacion.html",
                controller: "personalInvestigacionCtrl"
            })
            .state("personalsni", {
                url: "/personalsni",
                templateUrl: "app/CH/ConsultasIIE/personalsni.html",
                controller: "personalsniCtrl"
            })
            .state("personalsnidatos", {
                url: "/personalsnidatos",
                templateUrl: "app/CH/ConsultasIIE/personalsnidatos.html",
                controller: "personalsnidatosCtrl"
            })
            .state("estudios", {
                url: "/estudios",
                templateUrl: "app/CH/ConsultasIIE/estudios.html",
                controller: 'estudiosCtrl'
            })
            .state("institucioneseducativas", {
                url: "/institucioneseducativas",
                templateUrl: "app/CH/ConsultasIIE/institucioneseducativas.html",
                controller: "institucioneseducativasCtrl"
            })
            .state("personalvigente", {
                url: "/personalvigente",
                templateUrl: "app/CH/ConsultasIIE/personalvigente.html",
                controller: "personalvigenteCtrl"
            })
            .state("analisissni", {
                url: "/analisissni",
                templateUrl: "app/CH/ConsultasIIE/analisissni.html",
                controller: "analisissniCtrl"
            })
            .state("organigrama", {
                url: "/organigrama",
                templateUrl: "app/CH/Reportes/organigrama.html",
                controller: "organigramaCtrl"
            })
            .state("fichapersonal.daexterno", {
                views: {
                    'daexterno': {
                        url: "/daexterno",
                        templateUrl: "app/CH/DAExterno/DAExternoGet.html",
                        controller: "daexternoCtrlGet"
                    }
                }
            })
            .state("daexternoAdd", {
                url: "/agregardaexterno",
                templateUrl: "app/PI/derechosautor/derechosautoragregar.html",
                controller: "derechosautoragregarCtrl"
            })
            .state("daexternoEdit", {
                url: "/editardaexterno/",
                templateUrl: "app/PI/derechosautor/derechosautoreditar.html",
                controller: "derechosautoreditarCtrl"
            })
            .state("daexternoDetails", {
                url: "/detallesdaexterno/:id/:id2",
                templateUrl: "app/CH/DAExterno/DAExternoDetails.html",
                controller: "daexternoCtrlDetails"
            })
            .state("daexternoDetailsAdmin", {
                url: "/detalledaexterno/:id/:id2",
                templateUrl: "app/CH/Admin/DAExterno/DAExternoDetalles.html",
                controller: "daexternoDetallesCtrl"
            })
            .state("fichapersonal.piexterno", {
                views: {
                    'piexterno': {
                        url: "/piexterno",
                        templateUrl: "app/CH/PIExterno/PIExternoGet.html",
                        controller: "piexternoCtrlGet"
                    }
                }
            })
            .state("piexternoAdd", {
                url: "/agregarpiexterno",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialagregar.html",
                controller: "piexternoAddCtrlAdd"
            })
            .state("piexternoEdit", {
                url: "/editarpiexterno/",
                templateUrl: "app/PI/propiedadindustrial/propiedadindustrialeditar.html",
                controller: "piexternoEditarCtrl"
            })
            .state("piexternoDetails", {
                url: "/detallespiexterno/:id/:id2",
                templateUrl: "app/CH/PIExterno/PIExternoDetails.html",
                controller: "piexternoCtrlDetails"
            })
            .state("piexternoDetailsAdmin", {
                url: "/detallepiexterno/:id/:id2",
                templateUrl: "app/CH/Admin/PIExterno/PIExternoDetalles.html",
                controller: "piexternoDetallesCtrl"
            })
            .state("dainternoPatrimonialDetails", {
                url: "/detallesdapatrimonial/:id",
                templateUrl: "app/CH/DAExterno/DEAIntPatrimonialDetails.html",
                controller: "daeinternoPatrimonialCtrlDetails"
            })
            .state("piinternoPatrimonialDetails", {
                url: "/detallespipatrimonial/:id",
                templateUrl: "app/CH/PIExterno/PIAIntPatrimonialDetails.html",
                controller: "pieinternoPatrimonialCtrlDetails"
            })
            .state("solicitudescp", {
                url: "/solicitudescp",
                templateUrl: "app/CH/Admin/solicitudescp/SolicitudesGet.html",
                controller: "solicitudescpCtrlGet"
            })
            .state("cursointernoDetailsAdmin", {
                url: "/detallecursointerno/:id/:id2",
                templateUrl: "app/CH/Admin/cursointerno/cursointernoDetalles.html",
                controller: "cursointernoDetallesCtrl"
            })
            .state("bitacoraSolicitudesDetails", {
                url: "/bitacorasolicitudes/:id/:id2",
                templateUrl: "app/CH/BitacoraSolicitudes/bitacorasolicitudesDetails.html",
                controller: "bitacorasolicitudesDetailsCtrl"
            })
            .state("curriculumvitae", {
                url: "/curriculumvitae",
                templateUrl: "app/CH/CurriculumVitae/curriculumvitae.html",
                controller: "curriculumvitaeCtrl"
            })
            .state("periodoevaluacion", {
                url: "/periodoevaluacion",
                templateUrl: "app/CH/PeriodoEvaluacion/PeriodoEvaluacionGet.html",
                controller: "periodoevaluacionCtrlGet"
            })
            .state("periodoevaluacionAdd", {
                url: "/periodoevaluacionAdd",
                templateUrl: "app/CH/PeriodoEvaluacion/PeriodoEvaluacionAdd.html",
                controller: "periodoevaluacionCtrlAdd"
            })
            .state("periodoevaluacionEdit", {
                url: "/periodoevaluacionEdit/:id",
                templateUrl: "app/CH/PeriodoEvaluacion/PeriodoEvaluacionEdit.html",
                controller: "periodoevaluacionCtrlEdit"
            })
            .state("tipocompetencia", {
                url: "/tipocompetencia",
                templateUrl: "app/CH/TipoCompetencia/TipoCompetenciaGet.html",
                controller: "tipocompetenciaCtrlGet"
            })
            .state("tipocompetenciaAdd", {
                url: "/tipocompetenciaAdd",
                templateUrl: "app/CH/TipoCompetencia/TipoCompetenciaAdd.html",
                controller: "tipocompetenciaCtrlAdd"
            })
            .state("tipocompetenciaEdit", {
                url: "/tipocompetenciaEdit/:id",
                templateUrl: "app/CH/TipoCompetencia/TipoCompetenciaEdit.html",
                controller: "tipocompetenciaCtrlEdit"
            })
            .state("tipoarea", {
                url: "/tipoarea",
                templateUrl: "app/CH/TipoArea/TipoAreaGet.html",
                controller: "tipoareaCtrlGet"
            })
            .state("tipoareaAdd", {
                url: "/tipoareaAdd",
                templateUrl: "app/CH/TipoArea/TipoAreaAdd.html",
                controller: "tipoareaCtrlAdd"
            })
            .state("tipoareaEdit", {
                url: "/tipoareaEdit/:id",
                templateUrl: "app/CH/TipoArea/TipoAreaEdit.html",
                controller: "tipoareaCtrlEdit"
            })
            .state("estadoevaluacion", {
                url: "/estadoevaluacion",
                templateUrl: "app/CH/EstadoEvaluacion/EstadoEvaluacionGet.html",
                controller: "estadoevaluacionCtrlGet"
            })
            .state("estadoevaluacionAdd", {
                url: "/estadoevaluacionAdd",
                templateUrl: "app/CH/EstadoEvaluacion/EstadoEvaluacionAdd.html",
                controller: "estadoevaluacionCtrlAdd"
            })
            .state("estadoevaluacionEdit", {
                url: "/estadoevaluacionEdit/:id",
                templateUrl: "app/CH/EstadoEvaluacion/EstadoEvaluacionEdit.html",
                controller: "estadoevaluacionCtrlEdit"
            })
            .state("familiapuestos", {
                url: "/familiapuestos/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaPuestosGet.html",
                controller: "familiapuestosCtrlGet"
            })
            .state("familiapuestosAdd", {
                url: "/familiapuestosAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaPuestosAdd.html",
                controller: "familiapuestosCtrlAdd"
            })
            .state("familiapuestosEdit", {
                url: "/familiapuestosEdit/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaPuestosEdit.html",
                controller: "familiapuestosCtrlEdit"
            })
            .state("familiacategorias", {
                url: "/familiacategorias/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaCategoriaGet.html",
                controller: "familiacategoriasCtrlGet"
            })
            .state("familiacategoriasAdd", {
                url: "/familiacategoriasAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaCategoriaAdd.html",
                controller: "familiacategoriasCtrlAdd"
            })
            .state("familiacategoriaEdit", {
                url: "/familiacategoriaEdit/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaCategoriaEdit.html",
                controller: "familiacategoriasCtrlEdit"
            })
            .state("categoriacompetenciaGet", {
                url: "/categoriacompetenciaGet",
                templateUrl: "app/CH/FamiliasPuestos/CategoriaCompetenciaGet.html",
                controller: "categoriacompetenciaCtrlGet"
            })
            .state("categoriacompetenciaAdd", {
                url: "/categoriacompetenciaAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/CategoriaCompetenciaAdd.html",
                controller: "categoriacompetenciaCtrlAdd"
            })
            .state("familiaunidadAdd", {
                url: "/familiaunidadAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaUnidadAdd.html",
                controller: "familiaunidadCtrlAdd"
            })
            .state("familiaunidad", {
                url: "/familiaunidad",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaUnidadGet.html",
                controller: "familiaunidadCtrlGet"
            })
            .state("consultacategorias", {
                url: "/consultacategorias/:id",
                templateUrl: "app/CH/FamiliasPuestos/ConsultaCategoriasGet.html",
                controller: "consultacategoriasCtrlGet"
            })
            .state("personalarea", {
                url: "/personalarea",
                templateUrl: "app/CH/FamiliasPuestos/PersonalAreaGet.html",
                controller: "personalCtrlGet"
            })
            .state("tipounidad", {
                url: "/tipounidad",
                templateUrl: "app/CH/FamiliasPuestos/TipoUnidadGet.html",
                controller: "tipounidadCtrlGet"
            })
            .state("tipounidadAdd", {
                url: "/tipounidadAdd",
                templateUrl: "app/CH/FamiliasPuestos/TipoUnidadAdd.html",
                controller: "tipounidadCtrlAdd"
            })
            .state("competencias", {
                url: "/competencias/:id",
                templateUrl: "app/CH/Competencias/CompetenciasGet.html",
                controller: "competenciasCtrlGet"
            })
            .state("competenciasAdd", {
                url: "/competenciasAdd/:id",
                templateUrl: "app/CH/Competencias/CompetenciasAdd.html",
                controller: "competenciasCtrlAdd"
            })
            .state("competenciasEdit", {
                url: "/competenciasEdit/:id",
                templateUrl: "app/CH/Competencias/CompetenciasEdit.html",
                controller: "competenciasCtrlEdit"
            })
            .state("competenciascomportamientoGet", {
                url: "/competenciascomportamientoGet/:id",
                templateUrl: "app/CH/Competencias/CompetenciasComportamientoGet.html",
                controller: "competenciascomportamientoCtrlGet"
            })
            .state("nivelcompetencia", {
                url: "/nivelcompetencia",
                templateUrl: "app/CH/NivelCompetencia/NivelCompetenciaGet.html",
                controller: "nivelcompetenciaCtrlGet"
            })
            .state("nivelcompetenciaAdd", {
                url: "/nivelcompetenciaAdd",
                templateUrl: "app/CH/NivelCompetencia/NivelCompetenciaAdd.html",
                controller: "nivelcompetenciaCtrlAdd"
            })
            .state("nivelcompetenciaEdit", {
                url: "/nivelcompetenciaEdit/:id",
                templateUrl: "app/CH/NivelCompetencia/NivelCompetenciaEdit.html",
                controller: "nivelcompetenciaCtrlEdit"
            })
            .state("niveltecnica", {
                url: "/niveltecnica/:id",
                templateUrl: "app/CH/NivelComptenciaTecnica/NivelCompetenciaTecnicaGet.html",
                controller: "nivelcompetenciatecnicaCtrlGet"
            })
            .state("niveltecnicaAdd", {
                url: "/niveltecnicaAdd/:id",
                templateUrl: "app/CH/NivelComptenciaTecnica/NivelCompetenciaTecnicaAdd.html",
                controller: "nivelcompetenciatecnicaCtrlAdd"
            })
            .state("niveltecnicaEdit", {
                url: "/niveltecnicaEdit/:id",
                templateUrl: "app/CH/NivelComptenciaTecnica/NivelCompetenciaTecnicaEdit.html",
                controller: "nivelcompetenciatecnicaCtrlEdit"
            })
            .state("competenciatecnica", {
                url: "/competenciatecnica/:id",
                templateUrl: "app/CH/CompetenciaTecnica/CompetenciaTecnicaGet.html",
                controller: "competenciatecnicaCtrlGet"
            })
            .state("competenciatecnicaAdd", {
                url: "/competenciatecnicaAdd/:id",
                templateUrl: "app/CH/CompetenciaTecnica/CompetenciaTecnicaAdd.html",
                controller: "competenciatecnicaCtrlAdd"
            })
            .state("competenciatecnicaEdit", {
                url: "/competenciatecnicaEdit/:id",
                templateUrl: "app/CH/CompetenciaTecnica/CompetenciaTecnicaEdit.html",
                controller: "competenciatecnicaCtrlEdit"
            })
            .state("consultatecnica", {
                url: "/consultatecnica",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/ConsultaEvaluacionesTecnicasGet.html",
                controller: "consultaevaluacionesCtrlGet"
            })
            .state("detalleevaluaciontecnica", {
                url: "/detalleevaluaciontecnica/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/DetalleEvaluacionesTecnicasGet.html",
                controller: "detalleevaluacionestecnicasCtrlGet"
            })


            .state("comtecalcanzadas", {
                url: "/comtecalcanzadas",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/ConsultaEvaluacionesAlcanzadasGet.html",
                controller: "consultaevaluacionestecalcanzadasCtrlGet"
            })

            .state("consultaconductual", {
                url: "/consultaconductual",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/ConsultaEvaluacionesConductualesGet.html",
                controller: "consultaevaluacionesconductualesCtrlGet"
            })
            .state("detalleevaluacionconductual", {
                url: "/detalleevaluacionconductual/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/DetalleEvaluacionesConductualesGet.html",
                controller: "detalleevaluacionesconductualesCtrlGet"
            })
            .state("comconalcanzadas", {
                url: "/comconalcanzadas",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/ConsultaEvaluacionesAlcanzadasGet.html",
                controller: "consultaevaluacionesalcanzadasCtrlGet"
            })


            .state("administrapersonalconductuales", {
                url: "/administrapersonalconductuales",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/AdministraAreasConductualesGet.html",
                controller: "administrapersonalconductualesCtrlGet"
            })
            .state("formularioedicionconductuales", {
                url: "/formularioedicionconductuales/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/FormularioEdicionConductualEdit.html",
                controller: "formularioedicionconductualesCtrlEdit"
            })
            .state("evaluacionconductuales", {
                url: "/evaluacionconductuales",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/EvaluacionPersonalConductualGet.html",
                controller: "evaluacionpersonalconductualesCtrlGet"
            })
            .state("formularioevaluacionconductuales", {
                url: "/formularioevaluacionconductuales/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/FormularioEvaluacionConductualEdit.html",
                controller: "formularioevaluacionconductualCtrlEdit"
            })
            .state("administrapersonaltecnicas", {
                url: "/administrapersonaltecnicas",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/AdministraAreasTecnicasGet.html",
                controller: "administrapersonaltecnicasCtrlGet"
            })
            .state("formularioediciontecnicas", {
                url: "/formularioediciontecnicas/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/FormularioEdicionTecnicaEdit.html",
                controller: "formularioediciontecnicasCtrlGet"
            })
            .state("evaluacionpersonaltecnicas", {
                url: "/evaluacionpersonaltecnicas",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/EvaluacionPersonalTecnicasGet.html",
                controller: "evaluacionpersonaltecnicasCtrlGet"
            })
            .state("formularioevaluaciontecnicas", {
                url: "/formularioevaluaciontecnicas/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/FormularioEvaluacionTecnicaEdit.html",
                controller: "formularioevaluaciontecnicasCtrlGet"
            })
            .state("iniciaevaluacionconductuales", {
                url: "/iniciaevaluacionconductuales",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/IniciaPeriodoEvaluacion.html",
                controller: "iniciaperiodoevaluacionCtrlGet"
            })
            .state("iniciaevaluaciontecnicas", {
                url: "/iniciaevaluaciontecnicas",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/IniciaPeriodoEvaluacion.html",
                controller: "iniciaperiodoevaluacionTecnicaCtrlGet"
            })
            .state("evaluacionestecnicashistorialAdm", {
                url: "/evaluacionestecnicashistorialAdm",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/ConsultaEvaluacionesTecnicasAdmGet.html",
                controller: "consultaevaluacionesAdmCtrlGet"
            })
            .state("detalleevaluacionestecnicashistorialAdm", {
                url: "/detalleevaluacionestecnicashistorialAdm/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesTecnicas/DetalleEvaluacionesTecnicasAdmGet.html",
                controller: "detalleevaluacionestecnicasAdmCtrlGet"
            })
            .state("evaluacionconductualeshistorialAdm", {
                url: "/evaluacionconductualeshistorialAdm",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/ConsultaEvaluacionesConductualesAdmGet.html",
                controller: "consultaevaluacionesconductualesAdmCtrlGet"
            })
            .state("detalleevaluacionconductualesAdm", {
                url: "/detalleevaluacionconductualesAdm/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/DetalleEvaluacionesConductualesAdmGet.html",
                controller: "detalleevaluacionesconductualesAdmCtrlGet"
            })

            .state("reporteconductual", {
                url: "/reporteconductual/:id",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/ReporteEvaluacion.html",
                controller: "reporteconductualesCtrlGet"
            })

            .state("consultafamiliasgeneral", {
                url: "/consultafamiliasgeneral",
                templateUrl: "app/CH/FamiliasPuestos/ConsultaFamiliaPuestosGet.html",
                controller: "consultafamiliapuestosCtrlGet"
            })

            .state("consultafamiliaspersonal", {
                url: "/consultafamiliaspersonal",
                templateUrl: "app/CH/FamiliasPuestos/ConsultaFamiliaPuestosPersonalGet.html",
                controller: "consultafamiliapuestospersonalCtrlGet"
            })

            .state("consultapersonal", {
                url: "/consultapersonal",
                templateUrl: "app/CH/FamiliasPuestos/ConsulaEvaluacionPersonalGet.html",
                controller: "consultapersonalCtrlGet"
            })
            .state("miscompetencias", {
                url: "/miscompetencias",
                templateUrl: "app/CH/FamiliasPuestos/ConsulaEvaluacionIndividualGet.html",
                controller: "consultaevaluacionpersonalCtrlGet"
            })
            .state("mievaluacion", {
                url: "/mievaluacion",
                templateUrl: "app/CH/FamiliasPuestos/ConsulaEvaluacionIndividualResultadosGet.html",
                controller: "consultaevaluacionpersonalCtrlGet"
            })
            .state("familiaunidadadm", {
                url: "/familiaunidadadm",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaUnidadAdmGet.html",
                controller: "familiaunidadadmCtrlGet"
            })
            .state("familiaclasificacategoriasAdm", {
                url: "/familiaclasificacategoriasAdm/:id",
                templateUrl: "app/CH/FamiliasPuestos/FamiliaClasificaCategoriaAdmAdd.html",
                controller: "familiaclasificacategoriasAdmCtrlGet"
            })
            .state("consultacategoriasadm", {
                url: "/consultacategoriasadm/:id",
                templateUrl: "app/CH/FamiliasPuestos/ConsultaCategoriasAdmGet.html",
                controller: "consultacategoriasAdmCtrlGet"
            })
            .state("clasificacionareas", {
                url: "/clasificacionareas/:id",
                templateUrl: "app/CH/FamiliasPuestos/ClasificaAreasGet.html",
                controller: "clasificaareasCtrlGet"
            })
            .state("clasificacionareasAdd", {
                url: "/clasificacionareasAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/ClasificaAreasAdd.html",
                controller: "clasificaareasCtrlAdd"
            })
            .state("clasificacionareasEdit", {
                url: "/clasificacionareasEdit/:id",
                templateUrl: "app/CH/FamiliasPuestos/ClasificaAreasEdit.html",
                controller: "clasificaareasCtrlEdit"
            })
            .state("clasificacategoriastecnicas", {
                url: "/clasificacategoriastecnicas/:id",
                templateUrl: "app/CH/CompetenciaTecnica/ClasificaCategoriasTecnicasGet.html",
                controller: "clasificacategoriastecnicasCtrlGet"
            })
            .state("clasificacategoriastecnicasAdd", {
                url: "/clasificacategoriastecnicasAdd/:id",
                templateUrl: "app/CH/CompetenciaTecnica/ClasificaCategoriasTecnicasAdd.html",
                controller: "clasificacategoriastecnicasCtrlAdd"
            })
            .state("clasificacategoriasconductuales", {
                url: "/clasificacategoriasconductuales/:id",
                templateUrl: "app/CH/Competencias/ClasificaCategoriasConductualesGet.html",
                controller: "clasificacategoriasconductualesCtrlGet"
            })
            .state("clasificacategoriasconductualesAdd", {
                url: "/clasificacategoriasconductualesAdd/:id",
                templateUrl: "app/CH/Competencias/ClasificaCategoriasConductualesAdd.html",
                controller: "clasificacategoriasconductualesCtrlAdd"
            })
            .state("clasificacategoriasconductualesunidadAdd", {
                url: "/clasificacategoriasconductualesunidadAdd/:id",
                templateUrl: "app/CH/FamiliasPuestos/ClasificaCategoriasConductualesUnidadAdd.html",
                controller: "clasificacategoriasconductualesunidadCtrlAdd"
            })
            .state("promedioCompetencias", {
                url: "/promedioCompetencias/",
                templateUrl: "app/CH/ConsultaEvaluacionesConductuales/ReportePromedioCompetencias.html",
                controller: "promediocompetenciasCtrlGet"
            })
            .state("mecadministracion", {
                url: "/mecadministracion",
                templateUrl: "app/CH/MEC/Administracion/mecTecnicaGet.html",
                controller: "mecAdministracionTecnicaCtrlGet"
            })
            .state("manualCompetenciaTecnicasAdd", {
                url: "/agregarcompetenciatecnica",
                templateUrl: "app/CH/MEC/Administracion/CompetenciaTecnica/ManualCompetenciaTecnicaAdd.html",
                controller: "competenciatecnicaAddCtrl"
            })
            .state("manualCompetenciaTecnicaEdit", {
                url: "/editarmanualcompetenciatecnicas",
                templateUrl: "app/CH/MEC/Administracion/CompetenciaTecnica/ManualCompetenciaTecnicaEdit.html",
                controller: "competenciatecnicaEditCtrl"
            })
            .state("manualCompetenciaConductualAdd", {
                url: "/agregarcompetenciaconductual",
                templateUrl: "app/CH/MEC/Administracion/CompetenciaConductual/ManualCompetenciaConductualAdd.html",
                controller: "competenciaconductualAddCtrl"
            })
            .state("manualCompetenciaConductualEdit", {
                url: "/editarmanualcompetenciaconductual",
                templateUrl: "app/CH/MEC/Administracion/CompetenciaConductual/ManualCompetenciaConductualEdit.html",
                controller: "competenciaconductualEditCtrl"
            })
            .state("mecconsulta", {
                url: "/mecconsulta",
                templateUrl: "app/CH/MEC/ConsultaMEC/consultasMEC.html",
                controller: "mecConsultaTecnicaCtrlGet"
            })
            .state("gestionfichas", {
                url: "/gestionfichas",
                templateUrl: "app/CH/gestionfichas/gestionfichas.html",
                controller: "gestionfichasCtr"
            })
            .state("busquedaAvanzadaEmp", {
                url: "/busquedaAvanzadaEmp",
                templateUrl: "app/CH/BusquedaEmpleados/busquedaAvanzadaEmp.html",
                controller: "busquedaAvanzadaEmpCtrl"
            })
            .state("buscarPersonas", {
                url: "/buscarPersonas",
                templateUrl: "app/vistasGenericas/search/personasComun.html",
                controller: "PersonalSearchCtrlComun",
                access: "anonymous"
            })
            .state("detallePersonal", {
                url: "/detallePersonal/:id",
                templateUrl: "app/vistasGenericas/_details/personal/PersonalComunDetails.html",
                controller: "PersonaDetailsComunCtrl",
                access: "anonymous"
            })
            //.state("capacitacionesycert", {
            //    url: "/capacitacionesycert",
            //    templateUrl: "app/CH/CapacitacionyCertificacionesObtenidas/CapYcertifObtenidas.html",
            //    controller: "CapYcertifObtenidasCtrlAdd",
            //    access: "anonymous"
            //})
            .state("fichapersonal.capacitacionesycert", {
                views: {
                    'capacitacionesycert': {
                        url: "/capacitacionycertificacion",
                        templateUrl: "app/CH/CapacitacionyCertificacionesObtenidas/CapacitacionyCertificacionGet.html",
                        controller: "capacitacionesycertCtrlGet"
                    }
                }
            })
            .state("capacitacionesycertAdd", {
                url: "/agregarcapacitacionesycert",
                templateUrl: "app/CH/CapacitacionyCertificacionesObtenidas/CapacitacionyCertificacionAdd.html",
                controller: "capacitacionesycertCtrlAdd"
            })
            .state("capacitacionesycertEdit", {
                url: "/editarcapacitacionesycert/",
                templateUrl: "app/CH/CapacitacionyCertificacionesObtenidas/CapacitacionyCertificacionEdit.html",
                controller: "capacitacionesycertCtrlEdit"
            })
            .state("capacitacionesycertDetails", {
                url: "/detallescapacitacionesycert/:id/:id2",
                templateUrl: "app/CH/CapacitacionyCertificacionesObtenidas/CapacitacionyCertificacionDetails.html",
                controller: "capacitacionesycertCtrlDetails"
            })
            .state("capacitacionesycertDetailsAdmin", {
                url: "/detallecapacitacionesycert/:id/:id2",
                templateUrl: "app/CH/Admin/CapacitacionyCertificacionesObtenidas/CapacitacionyCertificacionDetails.html",
                controller: "capacitacionesycertCtrlDetailsAdmin"
            })
            .state("extractoProfesional", {
                url: "/extractoProfesional",
                templateUrl: "app/CH/extractoProfesional/ExtractoProfesional.html",
                controller: "ExtractoProfesionalCtrlAdd",
                access: "anonymous"
            })
            .state("fichapersonal.logrosreconocimientos", {
                views: {
                    'logrosreconocimientos': {
                        url: "/logrosreconocimientos",
                        templateUrl: "app/CH/logrosreconocimientos/logrosreconocimientosGet.html",
                        controller: "logrosreconocimientosCtrlGet"
                    }
                }
            })
            .state("logrosreconocimientosAdd", {
                url: "/agregarlogrosreconocimientos",
                templateUrl: "app/CH/logrosreconocimientos/logrosreconocimientosAdd.html",
                controller: "logrosreconocimientosCtrlAdd"
            })
            .state("logrosreconocimientosEdit", {
                url: "/editarlogrosreconocimientos/",
                templateUrl: "app/CH/logrosreconocimientos/logrosreconocimientosEdit.html",
                controller: "logrosreconocimientosCtrlEdit"
            })
            .state("logrosreconocimientosDetails", {
                url: "/detalleslogrosreconocimientos/:id/:id2",
                templateUrl: "app/CH/logrosreconocimientos/logrosreconocimientosDetails.html",
                controller: "logrosreconocimientosCtrlDetails"
            })
            .state("logrosreconocimientosDetailsAdmin", {
                url: "/detallelogrosreconocimientos/:id/:id2",
                templateUrl: "app/CH/Admin/logrosreconocimientos/logrosreconocimientosDetails.html",
                controller: "logrosreconocimientosDetailsAdmin"
            })
            .state("fichapersonal.certificacionesobtenidas", {
                views: {
                    'certificacionesobtenidas': {
                        url: "/certificacionesobtenidas",
                        templateUrl: "app/CH/certificacionesobtenidas/certificacionesobtenidasGet.html",
                        controller: "certificacionesobtenidasCtrlGet"
                    }
                }
            })
            .state("certificacionesobtenidasAdd", {
                url: "/agregarcertificacionesobtenidas",
                templateUrl: "app/CH/certificacionesobtenidas/certificacionesobtenidasAdd.html",
                controller: "certificacionesobtenidasCtrlAdd"
            })
            .state("certificacionesobtenidasEdit", {
                url: "/editarcertificacionesobtenidas/",
                templateUrl: "app/CH/certificacionesobtenidas/certificacionesobtenidasEdit.html",
                controller: "certificacionesobtenidasCtrlEdit"
            })
            .state("certificacionesobtenidasDetails", {
                url: "/detallescertificacionesobtenidas/:id/:id2",
                templateUrl: "app/CH/certificacionesobtenidas/certificacionesobtenidasDetails.html",
                controller: "certificacionesobtenidasCtrlDetails"
            })
            .state("certificacionesobtenidasDetailsAdmin", {
                url: "/detallecertificacionesobtenidas/:id/:id2",
                templateUrl: "app/CH/Admin/certificacionesobtenidas/certificacionesobtenidasDetails.html",
                controller: "certificacionesobtenidasDetallesCtrl"
            })
            .state("softwareDetailsGerente", {
                url: "/softwareDetailsGerente/:id",
                templateUrl: "app/CH/Admin/software/softwareDetailsGerente.html",
                controller: "softwareDetailsGerenteCtrl"
            })
            .state("BuscarArticulosDetails", {
                url: "/ArticulosDetails/:id",
                templateUrl: "app/MT/BuscarArticulos/buscarArticulosDetails.html",
                controller: "BuscarArticulosDetailsCtrl",
                access: "anonymous"
            })
            .state("BuscarPonenciasDetails", {
                url: "/PonenciasDetails/:id",
                templateUrl: "app/MT/BuscarPonencias/buscarPonenciasDetails.html",
                controller: "BuscarPonenciasDetailsCtrl",
                access: "anonymous"
            }).state("bitacoraSolicitudesAcceso", {
                url: "/bitacoraSolicitudesAcceso/:id",
                templateUrl: "app/vistasGenericas/SolicitudAcceso/bitacorasolicitudesAcceso.html",
                controller: "BitacoraSolicitudesAccesoCtrl",
                access: "anonymous"
            })
            .state('Capitulos', {
                url: '/Capitulos',
                templateUrl: 'app/CH/Capitulos/CapitulosGet.html',
                controller: 'capitulosCtrlGet',
                access: "anonymous"
            })
            .state('CapituloAdd', {
                url: '/CapituloAdd',
                templateUrl: 'app/CH/Capitulos/CapitulosAdd.html',
                controller: 'capitulosCtrlAdd',
                access: "anonymous"
            }).state("CapituloEdit", {
                url: "/CapituloEdit/:id",
                templateUrl: "app/CH/Capitulos/CapituloEdit.html",
                controller: "capitulosCtrlEdit",
                access: "anonymous"
            }).state("CapituloDetails", {
                url: "/CapituloDetails/:id",
                templateUrl: "app/CH/Capitulos/CapitulosDetails.html",
                controller: "capitulosCtrlDetails",
                access: "anonymous"
            }).state("ConsultaMovimientosPersonal", {
                url: "/ConsultaMovimientosPersonal",
                templateUrl: "app/CH/Reportes/movimientosPersonal.html",
                controller: "movimientosPersonalCtrl",
            })
            .state('InformesBecarios', {
                url: '/InformesBecarios',
                templateUrl: 'app/CH/InformesBecarios/Externos/InformeBecarioExternoGet.html',
                controller: 'InformeBecarioExternoGetCtrl as showCase'
            })
            .state('InformeBecarioAdd', {
                url: '/InformeBecarioAdd',
                templateUrl: 'app/CH/InformesBecarios/Externos/InformeBecarioExternoAdd.html',
                controller: 'InformeBecarioExternoAddCtrl'
            })
            .state('InformeBecarioEdit', {
                url: "/InformeBecarioEdit/:id",
                templateUrl: "app/CH/InformesBecarios/Externos/InformeBecarioExternoEdit.html",
                controller: "InformeBecarioExternoEditCtrl"
            })
            .state("InformeBecarioDetails", {
                url: "/InformeBecarioDetails/:id",
                templateUrl: "app/CH/InformesBecarios/Externos/InformeBecarioExternoDetails.html",
                controller: "InformeBecarioExternoDetailsCtrl"
            })
            .state('RelacionaBecasPersonal', {
                url: '/AgregarBecasPersonal',
                templateUrl: 'app/CH/Admin/becarioExterno/agregaBecarioExterno/agregaBecasPersonalAdd.html',
                controller: 'AgregaBecasPersonalAddCtrl as showCase'
            })
            .state('InformesBecariosInternos', {
                url: '/InformesBecariosInternos',
                templateUrl: 'app/CH/InformesBecarios/Internos/InformeBecarioInternoGet.html',
                controller: 'InformeBecarioInternoGetCtrl as showCase'
            })
            .state("InformeBecarioInternoAdd", {
                url: "/InformeBecarioInternoAdd",
                templateUrl: "app/CH/InformesBecarios/Internos/InformeBecarioInternoAdd.html",
                controller: "InformeBecarioInternoAddCtrl"
            })
            .state('InformeBecarioInternoEdit', {
                url: "/InformeBecarioInternoEdit/:id",
                templateUrl: "app/CH/InformesBecarios/Internos/InformeBecarioInternoEdit.html",
                controller: "InformeBecarioInternoEditCtrl"
            })
            .state("InformeBecarioInternoDetails", {
                url: "/InformeBecarioInternoDetails/:id",
                templateUrl: "app/CH/InformesBecarios/Internos/InformeBecarioInternoDetails.html",
                controller: "InformeBecarioInternoDetailsCtrl"
            })
            
            ;
    };
})();


