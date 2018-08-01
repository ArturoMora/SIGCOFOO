(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("OportunidadNegocioAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$uibModal",
            "ContactosCRService",
            "OportunidadNegocioCRService",
            OportunidadNegocioAddCtrl
        ]);

    function OportunidadNegocioAddCtrl(AuthService, $scope, $state, $filter, $uibModal, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.detalles = false;
        $scope.tiposEventos = [];
        $scope.medios = [];
        $scope.eventos = [];
        $scope.evento = {};
        $scope.oportunidad = {};
        $scope.contactoInsert = {};

        var ruta;
        $scope.fechaActual = new Date();
        var id;

        $scope.recargarContacto = function () {
            ContactosCRService.getContacto($scope.contactoId).then(
                function (result) {
                    $scope.contacto = result.data;
                    $scope.contacto.nombreEmpresa = $scope.contacto.empresa.nombreEmpresa;

                },
                function (err) {
                    console.error(err);
                });
        }

        OportunidadNegocioCRService.getTiposEventosDisponibles().then(
            function (result) {
                $scope.tiposEventos = result.data;
                $scope.mediosComunicacion();
            },
            function (err) {
                toastr.error(err);
            });

        $scope.mediosComunicacion = function () {
            $scope.medios = [
                {
                    medioId: 1,
                    nombre: "Llamada telefónica"
                },
                {
                    medioId: 2,
                    nombre: "Red Social"
                },
                {
                    medioId: 3,
                    nombre: "Correo electrónico"
                },
                {
                    medioId: 4,
                    nombre: "Sitio Web"
                },
                {
                    medioId: 5,
                    nombre: "Exposición Industrial"
                },
                {
                    medioId: 6,
                    nombre: "Otro"
                }];
        }

        $scope.openEventos = function () {
            id = $scope.oportunidad.tipoEventoONId;
            if (id == undefined || id == null || id == 0) {
                toastr.error("Debe seleccionar un tipo de evento, para realizar esta busqueda");
            }
            else {
                $scope.selectItem = {};
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/CR/oportunidadNegocio/Catalogos/Eventos/eventosGetModal.html',
                    controller: 'EventosGetModalCtrl',
                    resolve: {
                        selectItem: function () {
                            return $scope.selectItem;
                        }
                    },
                    scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    debugger;
                    $scope.oportunidad.tipoEventoONId = selectedItem.tipoEventoONId;
                    $scope.nombreEvento = selectedItem.nombreEvento;
                    $scope.oportunidad.eventoId = selectedItem.eventoId;
                });
            }
        }

        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto = {};
                if (selectedItem.nombreEmpresa == undefined || selectedItem.nombreEmpresa == '' || selectedItem.nombreEmpresa == null) {
                    $scope.contacto.nombreEmpresa = selectedItem.empresa.nombreEmpresa;
                   
                } else {
                    $scope.contacto.nombreEmpresa = selectedItem.nombreEmpresa;
                }
                $scope.selectedItem = selectedItem;
                $scope.contacto.nombreCompleto = selectedItem.nombreCompleto;
                $scope.contacto.adjunto64 = selectedItem.adjunto64;
                $scope.contacto.puesto = selectedItem.puesto;
                $scope.contacto.localidad = selectedItem.localidad;
                $scope.contacto.correo = selectedItem.correo;
                $scope.contacto.telefono = selectedItem.telefono;
                $scope.contacto.celular = selectedItem.celular;
                $scope.contacto.empresaId = selectedItem.empresaId;
                $scope.contacto.contactoId = selectedItem.contactoId;
                $scope.contacto.estadoContacto = selectedItem.estadoContacto;
                $scope.detalles = true;
                $scope.oportunidadAddForm.$setDirty();
            });
        }

        $scope.saveOportunidad = function () {
            if ($scope.oportunidad.fecha > $scope.fechaActual) {
                toastr.error("La fecha no debe ser mayor a la actual");
                return false;
            }
            if ($scope.oportunidadAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } 
            if($scope.contacto==null){
                toastr.error("Agregue un contacto");
                return false;
            }
            else {
                
                var roles = $scope.authentication.userprofile.roles;
                angular.forEach(roles, function (value, index) {
                    var rol = value.rol.rolId;
                    switch (rol) {
                        case 8:
                            ruta = "misOportunidadesRegistradas";
                            break;
                        case 15:
                            ruta = "asignarOportunidad";
                            break;
                        case 1025:
                            ruta = "misOportunidadesRegistradas";
                            break;
                        default:
                            ruta = "misOportunidadesRegistradas";
                    }
                });

                $scope.oportunidad.fecha = $filter('date')($scope.oportunidad.fecha, 'yyyy-MM-dd ')
                $scope.oportunidad.contactoId = $scope.contacto.contactoId;
                $scope.oportunidad.empresaId = $scope.contacto.empresaId;
                $scope.oportunidad.claveEmpleado = $scope.noEmpleado;
                $scope.oportunidad.autor = $scope.nombreEmpleado;
                $scope.oportunidad.fechaMaximaAtencion = null;

                switch ($scope.oportunidad.medio.medioId) {
                    case 1:
                        $scope.oportunidad.medioComunicacion = "Llamada telefónica";
                        break;
                    case 2:
                        $scope.oportunidad.medioComunicacion = "Red Social";
                        break;
                    case 3:
                        $scope.oportunidad.medioComunicacion = "Correo electrónico";
                        break;
                    case 4:
                        $scope.oportunidad.medioComunicacion = "Sitio Web";
                        break;
                    case 5:
                        $scope.oportunidad.medioComunicacion = "Evento";
                        break;
                    case 6:
                        $scope.oportunidad.medioComunicacion = "Otro";
                        break;
                    default:
                }

                OportunidadNegocioCRService.createOportunidad($scope.oportunidad).then(
                    function (result) {
                        toastr.success(result.data);
                        ContactosCRService.getContacto($scope.oportunidad.contactoId).then(
                            function (result) {
                                $scope.contactoInsert = result.data;
                                $scope.enviarCorreo();
                            },
                            function (err) {
                                toastr.error(data.InnerException.Message);
                            });
                        $state.go(ruta);
                    },
                    function (err) {
                        toastr.error(data.InnerException.Message);
                    });
            }
        };

        $scope.editarContacto = function (id) {
            $scope.contactoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/contactos/contactoModal/ContactoModalONEdit.html',
                controller: 'ContactoModalONEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargarContacto();
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.limpiar = function () {
            $scope.oportunidad.tipoEventoONId = "";
            $scope.oportunidad.eventoId = "";
            $scope.oportunidad.descripcionMedioContacto = "";
            if ($scope.oportunidad.medio.medioId == 5) {
                $scope.oportunidad.tipoEventoONId = 7;
                $scope.openEventos();
            }

        }

        $scope.limpiarEvento = function () {
            $scope.oportunidad.eventoId = "";
            $scope.nombreEvento = "";
        }

        $scope.enviarCorreo = function () {
            debugger;
            $scope.oportunidad.fecha = new Date($scope.oportunidad.fecha);
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.fecha,
                "Descripcion3": $scope.contactoInsert.nombreCompleto,
                "Descripcion4": $scope.contactoInsert.empresa.nombreEmpresa,
                "Descripcion5": $scope.contactoInsert.telefono,
                "Descripcion6": $scope.contactoInsert.correo,
                "Descripcion7": $scope.oportunidad.descripcion,
                "tituloON": "- Nueva oportunidad de negocio registrada",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "Seccion": "Oportunidad",
                "TipoCorreo": "OportunidadNegocioCreate"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();
