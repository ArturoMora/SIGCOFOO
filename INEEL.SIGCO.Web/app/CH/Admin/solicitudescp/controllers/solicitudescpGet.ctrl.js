(function () {
    "use strict";

    var app = angular.module("ineelCH");

    app.controller("solicitudescpCtrlGet", ["AuthService", "$scope", "$rootScope", "SolicitudesService", "$uibModal", "DTOptionsBuilder", "$state","MenuService", solicitudescpCtrlGet]);
    function solicitudescpCtrlGet(AuthService, $scope, $rootScope, SolicitudesService, $uibModal, DTOptionsBuilder, $state,MenuService) {
        $rootScope.centroposgrado = 0;
        $scope.loading = true;
        $scope.registrosSolicitudes = {};
        $scope.authentication = AuthService.authentication;
        $scope.opc = "Pendientes";

        //obtener registros
        $scope.cargaSolicitudes=function(){
            SolicitudesService.GetAllCursosCP().then(
                function (result) {
                    $scope.registrosSolicitudes = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Solicitudes");
                }
            );
        }

        //Carga las solicitudes de acuerdo a la opcion del usuario
        $scope.solicitudChange = function (opc) {
            MenuService.setVariable('opcionUsuarioPosgrado',opc);
            switch (opc) {
                case "Pendientes":
                    SolicitudesService.GetAllCursosCP().then(
                        function (result) {
                            $scope.registrosSolicitudes = result.data;
                            $scope.loading=false;
                        });
                    break;
                case "Aceptadas":
                    SolicitudesService.getAllAceptadas(2).then(
                        function (result) {
                            $scope.registrosSolicitudes = result.data;
                            //Solo una vez id
                            var a = [];
                            var b = [];
                            for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                                if (a.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                                    a.push($scope.registrosSolicitudes[i].solicitudId);
                                    b.push($scope.registrosSolicitudes[i]);
                                }
                            $scope.registrosSolicitudes = b;
                            $scope.loading=false;
                        });
                    break;
                case "Rechazadas":
                    SolicitudesService.getAllRechazadas(2).then(
                        function (result) {
                            $scope.registrosSolicitudes = result.data;
                            //Solo una vez id
                            var a = [];
                            var b = [];
                            for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                                if (a.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                                    a.push($scope.registrosSolicitudes[i].solicitudId);
                                    b.push($scope.registrosSolicitudes[i]);
                                }
                            $scope.registrosSolicitudes = b;
                            $scope.loading=false;
                        });
                    break;
                case "Todas":
                    SolicitudesService.getAllTodas(2).then(
                        function (result) {
                            $scope.registrosSolicitudes = result.data;
                            //Solo una vez id
                            var a = [];
                            var b = [];
                            for (var i = 0, l = $scope.registrosSolicitudes.length; i < l; i++)
                                if (a.indexOf($scope.registrosSolicitudes[i].solicitudId) === -1 && $scope.registrosSolicitudes[i] !== '') {
                                    a.push($scope.registrosSolicitudes[i].solicitudId);
                                    b.push($scope.registrosSolicitudes[i]);
                                }
                            $scope.registrosSolicitudes = b;
                            $scope.loading=false;
                        });
                    break;
            }

        }


        //Se recupera la opcion de navegacion del usuario, en caso de que haya cambiado de pestanas [pendientes,aceptadas,etc]
        var opcionRecuperada = MenuService.getVariable('opcionUsuarioPosgrado');
        if(opcionRecuperada!=null){ //Si no existe una opcion previa del usuario se cargan las default
            MenuService.deleteVariable('opcionUsuarioPosgrado');
            $scope.opc = opcionRecuperada;
            $scope.solicitudChange($scope.opc);
        }else{
            $scope.cargaSolicitudes(); //Se carga la opcion del usuario en dado caso que exista
        }

        //Redirecciona a [detalles] por cada registro
        $scope.buscar = function (Registro) {
            //switch (Registro.tipoInformacionId) {
            //    case 18:
            //Este autoriza 3 y rechaza 1
            if (Registro.estadoFlujoId != 11) {
                $scope.setGlobalID(Registro.informacionId);
                $scope.setGlobalID2(Registro.solicitudId);
                $state.go('cursointernoDetailsAdmin');
                //$state.go('cursointernoDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                //break;
            }//Este autoriza con 13 y rechaza 12
            if (Registro.estadoFlujoId == 11) {
                if (Registro.solicitudId == 1) {
                    $scope.setGlobalID(Registro.informacionId);
                    $scope.setGlobalID2('1A');
                    $state.go('cursointernoDetails');
                    //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: '1A' });
                }
                else {
                    $scope.setGlobalID(Registro.informacionId);
                    $scope.setGlobalID2(Registro.solicitudId);
                    $state.go('cursointernoDetails');
                    //$state.go('cursointernoDetails', { id: Registro.informacionId, id2: Registro.solicitudId });
                }
                //break;
                //}
            }
        }

        //Redirecciona a la bitacora por cada registro
        $scope.Detalles = function (Registro) {
            $rootScope.centroposgrado = 1;
            $scope.setGlobalID(Registro.informacionId);
            $scope.setGlobalID2(1);
            $state.go('cursointernoDetails');
        }

        //Recupera del servicio de localStorage el estado del Datatable [paginado, filtros y demas cosas de un estado del Datatable]
        $scope.paramsDT = JSON.parse(localStorage.getItem('tablaSolicitudesAdminPosgrado' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }
        
        //Inicializacion del Datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order', [2, 'desc'])
            .withOption('responsive', true);
            
        //////FUNCIONES EXCLUSIVAS DATATABLE
        //Guarda el estado del datatable [el paginado, la busqueda, el ordenamiento,etc]
        function stateSaveCallback(settings, data) {
            var stado = $('#tablaSolicitudesAdminPosgrado').DataTable().state();
            localStorage.setItem('tablaSolicitudesAdminPosgrado' + window.location.pathname, JSON.stringify(stado))
        }

        //Recupera el estado del datatable y lo carga [el paginado, la busqueda, el ordenamiento,etc]
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaSolicitudesAdminPosgrado' + window.location.pathname))
            }

        }

        //Funciones necesarias para aplicar el filtrado insensible a acentos
        //Es una alternativa a otros codigos utilizados
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



    }
})();