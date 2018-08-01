(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("SolicitudesAcceso", ["AuthService", "$rootScope", "$scope", "comunService", "$uibModal", "DTOptionsBuilder",
            "$location", "MenuService", "DTColumnDefBuilder", SolicitudesAcceso]);
    function SolicitudesAcceso(AuthService, $rootScope, $scope, comunService, $uibModal, DTOptionsBuilder, $location, MenuService, DTColumnDefBuilder) {

        $scope.idRol = MenuService.getRolId();
        if (!($scope.idRol == 4 || $scope.idRol == 5 || $scope.idRol == 16)) {
            toastr.warning("Rol no autorizado");
            window.location = "/sigco.html";
        }

        var urlDetalles = "";
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        $scope.pendientes = "8,11";
        $scope.aceptadas = "9,12";
        $scope.rechazadas = "10,13";
        $scope.seleccion = $scope.pendientes;
        $scope.registros = [];

        //Recupera del servicio de localStorage el estado del Datatable [paginado, filtros y demas cosas de un estado del Datatable]
        $scope.paramsDT = JSON.parse(localStorage.getItem('tablaSolicitudesAccesoMT' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        ///Se definen las propiedades de la tabla
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('order', [1, 'asc']);
        
        //////FUNCIONES EXCLUSIVAS DATATABLE
        //Guarda el estado del datatable [el paginado, la busqueda, el ordenamiento,etc]
        function stateSaveCallback(settings, data) {
            var stado = $('#tablaSolicitudesAccesoMT').DataTable().state();
            localStorage.setItem('tablaSolicitudesAccesoMT' + window.location.pathname, JSON.stringify(stado))
        }

        //Recupera el estado del datatable y lo carga [el paginado, la busqueda, el ordenamiento,etc]
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaSolicitudesAccesoMT' + window.location.pathname))
            }

        }

        //Se define la columna 1 de tipo string
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0]).withOption('type', 'string')
        ];


        //obtener registros
        $scope.cargaTabla = function (status) {
            MenuService.setVariable('opcionUsuarioSolicitudMT',status);
            $scope.seleccion = status;
            $scope.opc=status;
            comunService.SolicitudAcceso($scope.authentication.userprofile.claveUnidad, status).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("problema al cargar los registros");
                }
            );
        }

        //Se recupera la opcion guardada por el usuario
        var opcionRecuperada= MenuService.getVariable('opcionUsuarioSolicitudMT');
        
        if(opcionRecuperada!=null){ //En caso de que exista se cargan las solicitudes de acuerdo a esa opcion
            MenuService.deleteVariable('opcionUsuarioSolicitudMT');
            $scope.opc=opcionRecuperada;
            $scope.cargaTabla(opcionRecuperada);
        }else{ //En caso de que no exista se cargan las solicitudes pendientes por default
            $scope.cargaTabla($scope.pendientes);
        }

        

        $scope.DetallesOC = function (oc) {
            window.location = $scope.getFullurl(oc);
        }

        $scope.getFullurl = function (oc) {
            var absUrl = $location.absUrl();
            var arrayUrl = absUrl.split("://");
            var protocolHost = arrayUrl[0] + "://" + $location.host();
            var port = '' + $location.port();
            if (port == '80' || port == '443') {
                port = "/";
            }
            else {
                port = ":" + port + "/";
            }
            var host = protocolHost + port;
            var to = "";
            //NOTA: para que no tengan problemas, deben de asociar el controlador de su detalle al modulo ineel.controllers (como en la línea 4 de este documento)
            //cada quien agregará su opcion CASE con forme lo necesite, se recomienda inmediatamente hacer pull para que el cambio esté en desarrollo/todos y evitar conflictos
            switch (oc.tipoInformacionId) {
                case 17:
                    to = "indexMT.html#/BuscarCursosDetails/" + oc.informacionOCId;
                    break;
                case 18:
                    to = "indexMT.html#/CursoDetails/" + oc.informacionOCId;
                    break;
                case 20:
                    to = "indexMT.html#/SoftwarePersonalDetails/" + oc.informacionOCId;
                    break;
                case 21:
                    to = "indexMT.html#/ITFdetalles/" + oc.informacionOCId + "/false/99/infoGral";  //Cubierto hasta aqui en las justificaciones de solicitudes
                    break;
                case 22:
                    to = "indexMT.html#/BuscarInsumosDetails/" + oc.informacionOCId + "/";
                    break;
                case 23:
                    to = "IndexCR.html#/detallesestudiomercado/" + oc.informacionOCId;
                    break;
                case 24:
                    to = "indexCR.html#/detallescompetidor/" + oc.informacionOCId;
                    break;
                default:
                    alert("OC no considerado");
                    console.error("ERROR: tipo oc no considerado: " + oc.tipoInformacionId)
                    to = "";
                    break;
            }
            to = host + to;
            return to;
        }

        //pendiente
        $scope.GuardaBitacoraPermisoAccesoITF=function(oc){
            var registro={
                "iditf": oc.informacionOCId,
                "idSolicitud":oc.solicitudAccesoId,
                "claveSolicitante" : oc.clavePersonaSolicitante,
                "permisoDescarga": "PENDIENTE",
                "claveAutorizador": $scope.authentication.userprofile.clavePersona,
                "fechaRegistro": new Date()
            }
            comunService.updateRegistroBitacoraSolicitudes(registro).then(
                function(res){  
                    console.log("exito en el registro de permisos");
                }
            );
        }

        $scope.AprobarAcceso = function (oc) {
            $scope.message = "&#191;Desea <strong>aprobar</strong> el acceso al recurso del OC : <strong>" + oc.tipoInformacion.descripcion + "</strong> ?";
            $scope.message = $scope.message + " al usuario " + oc.nombreCompletoSolicitante;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/Confirmacion.html',
                size: 'lg',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {

                        comunService.AutorizaResponsableUnidadGEN(oc.solicitudAccesoId).then(
                            function (result) {
                                $uibModalInstance.dismiss('cancel');
                                toastr.success("Solicitud aprobada correctamente");
                                $scope.GuardarBitacoraAcceso(oc, "Solicitud aprobada", 10);
                                $scope.cargaTabla($scope.seleccion);
                                
                                if(oc.tipoInformacionId==21){ 
                                    $scope.GuardaBitacoraPermisoAccesoITF(oc);
                                }
                                
                            },
                            function (error) {
                                $uibModalInstance.dismiss('cancel');
                                toastr.error("error al procesar la solicitud");
                                $scope.cargaTabla($scope.seleccion);
                                console.log(error);
                            }
                        );

                    };
                    $scope.cancel = function () {
                        $scope.cargaTabla($scope.seleccion);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            }).rendered.then(function (modal) {
                //var element = document.querySelector('.well'),
                //    rect = element.getBoundingClientRect(),
                modal = document.querySelector('.modal-dialog');

                modal.style.margin = 0;
                modal.style.top = '5px';
                modal.style.left = '10%';
            });
        }

        $scope.DenegarAcceso = function (oc) {
            $scope.message = "&#191;Desea <strong>rechazar </strong> la solicitud de acceso al recurso del OC : <strong>" + oc.tipoInformacion.descripcion + "</strong> ?";
            $scope.message = $scope.message + " al usuario " + oc.nombreCompletoSolicitante;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/SolicitarAccesoGenerico.html',
                size: 'lg',
                controller: function ($uibModalInstance) {
                    $scope.ok = function (justificacionModal) {

                        comunService.RechazaResponsableUnidadGEN(oc.solicitudAccesoId).then(
                            function (result) {
                                $uibModalInstance.dismiss('cancel');
                                toastr.success("Solicitud rechazada correctamente");
                                $scope.GuardarBitacoraAcceso(oc, "Solicitud rechazada, " + justificacionModal, 9);
                                $scope.cargaTabla($scope.seleccion);
                                
                            },
                            function (error) {
                                $uibModalInstance.dismiss('cancel');
                                toastr.error("error al procesar la solicitud");
                                $scope.cargaTabla($scope.seleccion);
                                console.log(error);
                            }
                        );

                    };
                    $scope.cancel = function () {
                        $scope.cargaTabla($scope.seleccion);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            }).rendered.then(function (modal) {
                //var element = document.querySelector('.well'),
                //    rect = element.getBoundingClientRect(),
                modal = document.querySelector('.modal-dialog');

                modal.style.margin = 0;
                modal.style.top = '5px';
                modal.style.left = '10%';
            });
        }

        $scope.GuardarBitacoraAcceso = function (oc, descripcion, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            var bitacora = {
                "solicitudAccesoId": oc.solicitudAccesoId,
                "fechaMovimiento": new Date(),
                "clavePersona": $scope.authentication.userprofile.clavePersona,
                "descripcion": descripcion,
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": oc.unidadAutorizadoraId
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) {
                    $scope.EnviarCorreo(oc, bitacora);
                    //TODO: pendiente enviar correo(considerar estado) //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                },
                function (error) { }
            );
        }

        $scope.EnviarCorreo = function (oc, bitacora) {
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "ClavePersona": oc.clavePersonaSolicitante,
                "Empleado": bitacora.clavePersona,
                "Seccion": "SIGCO / solicitud de acceso",
                //"justificacion": justificacion,
                "Descripcion1": "<br/>El estado de su solicitud es: <br/>" + bitacora.descripcion + "<br/>",
                "Descripcion2": "<br/>La solicitud fue atendida por " + $scope.authentication.userprofile.nombreCompleto + " (autorizado(a) para tal actividad).<br/>",
                "Descripcion3": "<br/> <a href='" + $scope.getFullurl(oc) + "' target='_blank'>clic para ver el recurso solicitado</a>",
                "TipoCorreo": "AceptacionRechazoJefeUnidad",
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            
            comunService.mailNotificacion(Mail);
        }
    }
})();