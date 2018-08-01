(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("SolicitudesCtrlGet", ["MenuService", "AuthService", "DTColumnDefBuilder", "$scope", "$filter", "$rootScope", "SolicitudesService", "$uibModal", "DTOptionsBuilder", "$state", SolicitudesCtrlGet]);

    function SolicitudesCtrlGet(MenuService, AuthService, DTColumnDefBuilder, $scope, $filter, $rootScope, SolicitudesService, $uibModal, DTOptionsBuilder, $state) {
        $rootScope.origen = "Solicitudes";
        $scope.opc = "Pendientes"; //pestana default del buzon de notificaciones
        $rootScope.centroposgrado = 0;
        var rol = MenuService.getRolId();
        $scope.tipoPersonal = "INV";

        if (rol == 1) { //Es el rol del admin de CH
            $scope.tipoPersonal = "INV";
        } else if (rol == 1026) { //Rs el rol del  administrador de CH del personal sindicalizado
            $scope.tipoPersonal = "SIN";
        } else if (rol == 4) { //Es el rol de gerente
            $scope.tipoPersonal = "INV";
        }

        $scope.loading = true;
        $scope.usuarioEsGerente = 0;
        $scope.registros = [];
        $scope.registrosSolicitudes = [];
        $scope.dtInstance = {};

        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;


        //Recupera del servicio de localStorage el estado del Datatable [paginado, filtros y demas cosas de un estado del Datatable]
        $scope.paramsDT = JSON.parse(localStorage.getItem('tablaSolicitudes' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }



        //Inicializacion del Datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('order', [3, 'desc'])
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('responsive', true)
            .withOption('initComplete',
            function () { //Agrega el footer del datatable
                this.api().columns().every(function () {
                    var column = this;
                    var x = column[0];
                    var y = x["0"];
                    if (y == 5) {
                        var select = $('<select><option value=""></option></select>')
                            .appendTo($(column.footer()).empty())
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );

                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });

                        column.data().unique().sort().each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>')
                        });
                    }
                });
            }
            );



        //////FUNCIONES EXCLUSIVAS DATATABLE
        //Guarda el estado del datatable [el paginado, la busqueda, el ordenamiento,etc]
        function stateSaveCallback(settings, data) {
            var stado = $('#tablaSolicitudes').DataTable().state();
            localStorage.setItem('tablaSolicitudes' + window.location.pathname, JSON.stringify(stado))
        }

        //Recupera el estado del datatable y lo carga [el paginado, la busqueda, el ordenamiento,etc]
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaSolicitudes' + window.location.pathname))
            }

        }

        //Se recupera la opcion de navegacion del usuario, en caso de que haya cambiado de pestanas [pendientes,aceptadas,etc]
        var opcionRecuperada = MenuService.getVariable('opcionUsuarioAdminCH');

        $scope.redirigeOpcionPrevia = function () {
            MenuService.deleteVariable('opcionUsuarioAdminCH');
            $scope.opc = opcionRecuperada;
            $scope.solicitudChange($scope.opc);
        }

        //////END FUNCIONES DATATABLE

        //Verifica si el usuario es el gerente o no
        $scope.verificaUsuarioGerente = function () {
            SolicitudesService.GetGerenteByClaveUnidad($scope.authentication.userprofile.claveUnidad).then( //Obtiene el gerente de la gerencia idSolicitudes la que pertenece el usuario logueado actual
                function (result) {
                    //Si es el gerente entonces se trae todas las solicitudes asociadas idSolicitudes el
                    if (result.data == $scope.clavePersona && rol !== 1 && rol !== 1026) {
                        $scope.usuarioEsGerente = 1;
                        if (opcionRecuperada == null) {//Para el caso en que sea la primera vez que el usuario ingrese al buzon de notificaciones
                            $scope.solicitudesPendientesGerente();
                        } else {
                            $scope.redirigeOpcionPrevia();
                        }

                    } else {
                        if (opcionRecuperada == null) { //Para el caso en que sea la primera vez que el usuario ingrese al buzon de notificaciones
                            $scope.solicitudesPendientesAdministradores();
                        } else {
                            $scope.redirigeOpcionPrevia();
                        }

                    }
                }, function (err) {
                    toastr.error("Error al obtener el rol del usuario");
                    console.log(err);
                });
        }

        $scope.verificaUsuarioGerente();

        //Obtiene todas las solicitudes asociadas al gerente de la unidad (la unidad del usuario que esta logueado)
        $scope.solicitudesPendientesGerente = function () {
            SolicitudesService.getAllGerentebyClaveunidad($scope.authentication.userprofile.claveUnidad).then(
                function (result) {
                    $scope.registrosSolicitudes = result.data;
                    var numeroSolicitudes = $scope.registrosSolicitudes.length;

                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Solicitudes");
                    console.log(err);
                }
            );
        }

        //Obtiene las solicitudes ya sea del admin CH o del admin de personal sindicalizado
        $scope.solicitudesPendientesAdministradores = function () {
            // SolicitudesService.getAll().then( //Trae todas las solicitudes que no sean del gerente 
            if (rol == 1) {  //Administrador de CH ///No debe de ver solicitudes de personl sindicalizado
                SolicitudesService.GetPendientesAdministradorCH().then( //Trae todas las solicitudes que no sean del gerente 
                    function (result) {
                        $scope.registrosSolicitudes = result.data;
                       
                        var numeroSolicitudes = $scope.registrosSolicitudes.length;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los registros de Solicitudes");
                        console.log(err);
                    }
                );
            }
            if (rol == 1026) { //Administrador de personal sindicalizado
                SolicitudesService.GetPendientesAdministradorSindicalizados().then(
                    function (result) {
                        $scope.registrosSolicitudes = result.data;
                        var numeroSolicitudes = $scope.registrosSolicitudes.length;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los registros de Solicitudes");
                    }
                );
            }

        }

        //Solo solicitudes aceptadas por x rol
        $scope.solicitudesAceptadas = function () {
            var opcionFiltrado=$scope.authentication.userprofile.claveUnidad;
            if(rol==1 || rol==1026){
                opcionFiltrado=rol;
            }
            SolicitudesService.getAllAceptadas($scope.usuarioEsGerente, opcionFiltrado).then(
                function (result) {
                    $scope.registrosSolicitudes = result.data;
                    //Se verifica que no haya registros duplicados
                    var idSolicitudes = [];
                    var datos = [];
                    for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                        if (idSolicitudes.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                            idSolicitudes.push($scope.registrosSolicitudes[i].solicitudId);
                            datos.push($scope.registrosSolicitudes[i]);
                        }
                    $scope.registrosSolicitudes = datos;
                    $scope.loading = false;
                });

        }

        //Solo solicitudes rechazadas por x rol
        $scope.solicitudesRechazadas = function () {
            var opcionFiltrado=$scope.authentication.userprofile.claveUnidad;
            if(rol==1 || rol==1026){
                opcionFiltrado=rol;
            }
            SolicitudesService.getAllRechazadas($scope.usuarioEsGerente, opcionFiltrado).then(
                function (result) {
                    $scope.registrosSolicitudes = result.data;
                    //Se verifica que no haya registros duplicados
                    var idSolicitudes = [];
                    var datos = [];
                    for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                        if (idSolicitudes.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                            idSolicitudes.push($scope.registrosSolicitudes[i].solicitudId);
                            datos.push($scope.registrosSolicitudes[i]);
                        }
                    $scope.registrosSolicitudes = datos;
                    $scope.loading = false;
                });
        }

        //Trae el total de solicitudes del gerente
        $scope.todasSolicitudesGerentes = function () {
            SolicitudesService.getAllTodas($scope.usuarioEsGerente, $scope.authentication.userprofile.claveUnidad).then(
                function (result) {

                    $scope.registrosSolicitudes = result.data;
                    var numeroSolicitudes = $scope.registrosSolicitudes.length;

                    //Validacion de duplicidad de registros
                    var idSolicitudes = [];
                    var datos = [];
                    for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                        if (idSolicitudes.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                            idSolicitudes.push($scope.registrosSolicitudes[i].solicitudId);
                            datos.push($scope.registrosSolicitudes[i]);
                        }
                    $scope.registrosSolicitudes = datos;
                    $scope.loading = false;
                });
        }

        //Total de solicitudes de los administradores
        $scope.totalSolicitudesAdministradores = function () {
            if (rol == 1) {
                SolicitudesService.getAllTodas($scope.usuarioEsGerente, rol).then(
                    function (result) {
                        $scope.registrosSolicitudes = result.data;
                        $scope.loading = false;

                    });
            }
            if (rol == 1026) {
                SolicitudesService.getAllTodas($scope.usuarioEsGerente, rol).then(
                    function (result) {
                        $scope.registrosSolicitudes = result.data;
                        $scope.loading = false;

                    });
            }
        }


        //Cambia la bandeja de solicitudes por pendientes,aceptadas, etc.
        $scope.solicitudChange = function (opc) {
            MenuService.setVariable('opcionUsuarioAdminCH', opc);
            $scope.registrosSolicitudes = [];
            switch (opc) {
                case "Pendientes":
                    if ($scope.usuarioEsGerente == 1) {
                        $scope.solicitudesPendientesGerente();
                    } else {
                        $scope.solicitudesPendientesAdministradores();
                    }
                    break;

                case "Aceptadas":
                    $scope.solicitudesAceptadas();
                    break;

                case "Rechazadas":
                    $scope.solicitudesRechazadas();
                    break;

                case "Todas":
                    if ($scope.usuarioEsGerente == 1) {
                        $scope.todasSolicitudesGerentes();
                    } else {
                        $scope.totalSolicitudesAdministradores();
                    }

                    break;
            }

        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };


        //Dependiendo del tipo de informacion que sea la solicitud sera la url idSolicitudes la que sera dirigida el usuario (en caso de que el usuario de clic en editar)
        $scope.buscar = function (Registro) {
            console.log(Registro);
            $scope.setGlobalID(Registro.informacionId);
            $scope.setGlobalID2(Registro.solicitudId);
            console.log(Registro.tipoInformacionId);
            switch (Registro.tipoInformacionId) {
                case 1:
                    $state.go('FormacionAcademicaDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 2:
                    $state.go('SNIDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 3:
                    $state.go('AsociacionDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 4:
                    $state.go('DistincionDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 5:
                    $state.go('IdiomaDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 6:
                    $state.go('ExperienciaExternaDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 7:
                    $state.go('TesisDirigidaDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 8:
                    $state.go('BecarioInternoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 9:
                    $state.go('BecarioDirigidoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 10:
                    $state.go('ExperienciaDocenteDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 11:
                    if ($scope.usuarioEsGerente == 1) {
                        $state.go('publicacionDetailsGerente');
                        //$state.go('publicacionDetailsGerente', { id: Registro.informacionId, id2: Registro.solicitudId });
                    } else {
                        $state.go('PublicacionDetailsAdmin');
                        //$state.go('PublicacionDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    }
                    break;
                case 12:
                    if ($scope.usuarioEsGerente == 1) {
                        $state.go('ponenciaDetailsGerente');
                        //$state.go('ponenciaDetailsGerente', { id: Registro.informacionId, id2: Registro.solicitudId });
                    } else {
                        $state.go('PonenciaDetailsAdmin');
                        //$state.go('PonenciaDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    }
                    break;
                case 13:
                    $state.go('BecarioExternoDetailsAdmin');
                    //$state.go('BecarioExternoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 14:
                    $state.go('ParticipacionDetailsGerente', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 15:
                    $state.go('daexternoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 16:
                    $state.go('piexternoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 17:
                    if (Registro.estadoFlujoId != 11) {
                        $state.go('cursointernoDetailsAdmin');
                        //$state.go('cursointernoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                        break;
                    }
                    if (Registro.estadoFlujoId == 11) {
                        if (Registro.solicitudId == 1) {
                            $scope.setGlobalID2('1A');
                            $state.go('cursointernoDetails');
                            //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: '1A' });
                        }
                        else {
                            $state.go('cursointernoDetails');
                            //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: Registro.solicitudId });
                        }
                        break;
                    }
                case 18:

                    if (Registro.estadoFlujoId != 11) {
                        $state.go('cursointernoDetailsAdmin');
                        //$state.go('cursointernoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                        break;
                    }
                    if (Registro.estadoFlujoId == 11) {
                        if (Registro.solicitudId == 1) {
                            $scope.setGlobalID2('1A');
                            $state.go('cursointernoDetails');
                            //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: '1A' });
                        }
                        else {
                            $state.go('cursointernoDetails');
                            //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: Registro.solicitudId });
                        }
                        break;
                    }
                case 19:
                    if ($scope.usuarioEsGerente == 1) {
                        $state.go('capituloDetailsGerente', { id: Registro.informacionId, id2: Registro.solicitudId });
                    } else {
                        $state.go('capituloDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    }
                    break;
                case 20:
                    $rootScope.detallemostrar = "si";
                    $rootScope.setGlobalClavePersonaSoftware = Registro.clavePersona;
                    $state.go('softwareDetailsGerente');
                    break;
                case 21:
                    window.location = "/indexMT.html#/ITF/" + Registro.informacionId + "/false/" + Registro.solicitudId + "/infoGral"
                    break;
                case 25:
                    $state.go('capacitacionesycertDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 26:
                    $state.go('logrosreconocimientosDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;
                case 27:
                    $state.go('certificacionesobtenidasDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                    break;

                default:
                    toastr.warning("Oc no considerado");
                    break;
            }
        }

        //Dependiendo del tipo de informacion que sea la solicitud sera la url idSolicitudes la que sera dirigida el usuario (en caso de que el usuario de clic en detalles)
        $scope.Detalles = function (Registro) {
            $scope.setGlobalID(Registro.informacionId);
            $scope.setGlobalID2(1);
            switch (Registro.tipoInformacionId) {
                case 1:
                    $state.go('formaciondetail', { id: Registro.informacionId, id2: 1 });
                    break;
                case 2:
                    $state.go('snidetail', { id: Registro.informacionId, id2: 1 });
                    break;
                case 3:
                    $state.go('asociacionesDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 4:
                    $state.go('distinciondetail', { id: Registro.informacionId, id2: 1 });
                    break;
                case 5:
                    $state.go('idiomadetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 6:
                    $state.go('experienciaexternaDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 7:
                    $state.go('tesisdirigidaDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 8:
                    $state.go('becariointernoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 9:
                    $state.go('becariodirigidoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 10:
                    $state.go('experienciadocenteDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 11:
                    $state.go('publicacionGerenteInfo')
                    //$state.go('publicacionGerenteInfo', { id: Registro.informacionId })
                    break;
                case 12:
                    $state.go('ponenciaGerenteInfo')
                    //$state.go('ponenciaGerenteInfo', { id: Registro.informacionId })
                    break;
                case 13:
                    $state.go('BecarioExternoDetails');
                    //$state.go('BecarioExternoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 14:
                    $state.go('participacionDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 15:
                    $state.go('daexternoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 16:
                    $state.go('piexternoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 17:
                    $rootScope.centroposgrado = 2;
                    $state.go('cursointernoDetails');
                    //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: 1});
                    break;
                case 18:
                    $state.go('cursointernoDetails');
                    //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 19:
                    $state.go('capituloGerenteInfo', { id: Registro.informacionId });
                    break;
                case 25:
                    $state.go('capacitacionesycertDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 26:
                    $state.go('logrosreconocimientosDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 27:
                    $state.go('certificacionesobtenidasDetails', { id: Registro.informacionId, id2: 1 });
                    break;
                case 20:
                    $rootScope.detallemostrar = "no";
                    $rootScope.setGlobalClavePersonaSoftware = Registro.clavePersona;
                    $state.go('softwareDetailsGerente');
                    break;
                default:
                    toastr.warning("Oc no considerado");
                    break;
                case 21:
                    window.location = "/indexMT.html#/ITFdetalles/" + Registro.informacionId + "/false/99/infoGral"
                    break;
            }
        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'idSolicitudes')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'idSolicitudes')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };




    }
})();