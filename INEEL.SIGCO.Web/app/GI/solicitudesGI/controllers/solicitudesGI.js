(function () {
    "use strict";

    var app = angular.module("ineelGI");

    app.controller("solicitudesGI", ["MenuService", "AuthService", "$scope", "DTColumnDefBuilder", "$rootScope", "solicitudesGIService", "DTOptionsBuilder", "$state", solicitudesGI]);
    function solicitudesGI(MenuService, AuthService, $scope, DTColumnDefBuilder, $rootScope, solicitudesGIService, DTOptionsBuilder, $state) {
        $scope.dtInstance = {};
        $scope.rolId = MenuService.getRolId();
        $scope.opc = "Pendientes";

        //Recupera del servicio de localStorage el estado del Datatable [paginado, filtros y demas cosas de un estado del Datatable]
        $scope.paramsDT = JSON.parse(localStorage.getItem('tablaSolicitudesGI' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        //Inicializa el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('responsive', true)
            .withOption('initComplete',
                function () {
                    this.api().columns().every(function () {
                        var column = this;
                        var x = column[0];
                        var y = x["0"];
                        if (y == 3) {
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



        var rol = MenuService.getRolId();

        $scope.tipoPersonal = "INV";
        if (rol == 1028) {
            $scope.tipoPersonal = "INV";
        } else if (rol == 1026) {
            $scope.tipoPersonal = "SIN";
        }

        $scope.registros = [];
        $scope.registrosSolicitudes = [];
        $scope.authentication = AuthService.authentication;
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.claveUnidad = AuthService.authentication.userprofile.claveUnidad;

        //Se define la columna 1 de tipo string
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'string')
        ];

        //Carga las solicitudes pendientes del admin gi
        $scope.solicitudesPendientesAdminGI = function () {
            solicitudesGIService.getAllPendientesAdministradorGI().then(
                function (result) {
                    $scope.registros = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Solicitudes");
                });
        }

        //Carga las solicitudes pendientes evaluadores gi
        $scope.solicitudesPendientesEvaluadorGI = function () {
            solicitudesGIService.getAllPendientesEvaluadoresGI($scope.clavePersona).then(
                function (result) {
                    $scope.registros = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Solicitudes");
                }
            );
        }

        //Carga las solicitudes pendientes de gerentes
        $scope.solicitudesPendientesGerentes = function () {
            solicitudesGIService.getAllPendientesGerentes($scope.claveUnidad).then(
                function (result) {
                    $scope.registros = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de Solicitudes");
                });
        }

        $scope.cargaSolicitudesPendientes = function () {
            //Solicitudes pendientes administrador GI
            if (rol == 1028) {
                $scope.solicitudesPendientesAdminGI();
            }
            //Solicitudes pendientes evaluador GI        
            if (rol == 1029) {
                $scope.solicitudesPendientesEvaluadorGI();
            }
            //Solicitudes pendientes gerente
            if (rol == 4) {
                $scope.solicitudesPendientesGerentes();
            }
        }

        //Carga las solicitudes de acuerdo a la opcion del usuario
        $scope.solicitudChange = function (opc) {
            MenuService.setVariable('opcionUsuarioGI', opc);
            switch (opc) {
                case "Pendientes":
                    //administrador
                    if (rol == 1028) {
                        $scope.solicitudesPendientesAdminGI();
                    }
                    //evaluador
                    if (rol == 1029) {
                        $scope.solicitudesPendientesEvaluadorGI();
                    }
                    //gerente
                    if (rol == 4) {
                        $scope.solicitudesPendientesGerentes();
                    }
                    break;
                case "Aceptadas":

                    if (rol == 4) {

                        solicitudesGIService.getAllAceptadasGerenteGI($scope.claveUnidad).then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    } else {
                        solicitudesGIService.getAllAceptadasAdministradorGI().then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    }
                    break;
                case "Rechazadas":
                    if (rol == 4) {
                        solicitudesGIService.getAllRechazadasGerenteGI($scope.claveUnidad).then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    } else {
                        solicitudesGIService.getAllRechazadasAdministradorGI().then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    }
                    break;
                case "Todas":
                    if (rol == 4) {
                        solicitudesGIService.GetAllGerente($scope.claveUnidad).then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    } else {
                        solicitudesGIService.getAllSolicitudesAdministradorGI(rol, $scope.clavePersona).then(
                            function (result) {
                                $scope.registros = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Solicitudes");
                            });
                    }
                    break;
            }

        }

        //Se recupera la opcion previa del usuario
        var opcionRecuperada = MenuService.getVariable('opcionUsuarioGI');
        if (opcionRecuperada != null) { //en caso de que exista se envia al metodo que las carga
            $scope.opc = opcionRecuperada;
            $scope.solicitudChange($scope.opc);
        } else {
            $scope.cargaSolicitudesPendientes();    //en caso default solo carga las solicitudes pendientes
        }

        $scope.Editar = function (Registro) {
            console.log(Registro);
            $scope.setGlobalID(Registro.informacionId);
            $scope.setGlobalID2(Registro.solicitudId);
            switch (Registro.tipoInformacionId) {
                case 28:
                    $state.go('ideaInnovadoraDetails');
                    break;
                case 29:
                    $state.go('carteraPropuestasDetails');
                    break;
                case 30:
                    $state.go('productoInnovadorDetailsGerente');
                    break;
                case 31:
                    $state.go('planNegocioDetails');
                    break;
                case 32:
                    $state.go('carteraPropuestasDetails');
                    break;
            }
        }

        $scope.Details = function (Registro) {
            console.log(Registro);
            $scope.setGlobalID(Registro.informacionId);
            $scope.setGlobalID2(Registro.solicitudId);
            switch (Registro.tipoInformacionId) {
                case 28:
                    $state.go('buscarIdeaInnovadoraDetalles');
                    break;
                case 29:
                    $state.go('carteraPropuestasDetails');
                    break;
                case 30:
                    $state.go('productoInnovadorDetails');
                    break;
                case 31:
                    $state.go('planNegocioDetails');
                    break;
                case 32:
                    $state.go('carteraPropuestasDetails');
                    break;
            }
        }


        //////FUNCIONES EXCLUSIVAS DATATABLE
        //Guarda el estado del datatable [el paginado, la busqueda, el ordenamiento,etc]
        function stateSaveCallback(settings, data) {
            var stado = $('#tablaSolicitudesGI').DataTable().state();
            localStorage.setItem('tablaSolicitudesGI' + window.location.pathname, JSON.stringify(stado))
        }

        //Recupera el estado del datatable y lo carga [el paginado, la busqueda, el ordenamiento,etc]
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaSolicitudesGI' + window.location.pathname))
            }

        }



    }
})();