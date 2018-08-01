/// <reference path="oportunidadNegocioAdd.ctrl.js" />
(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("OportunidadNegocioEditCtrl", [
            "$filter",
            "$scope",
            "$state",
            "$uibModal",
            'MenuService',
            "$stateParams",
            "ContactosCRService",
            "OportunidadNegocioCRService",
            OportunidadNegocioEditCtrl
        ]);

    function OportunidadNegocioEditCtrl($filter, $scope, $state, $uibModal, MenuService, $stateParams, ContactosCRService, OportunidadNegocioCRService) {
        $scope.tiposEventos = [];
        $scope.medios = [];
        $scope.eventos = [];
        $scope.evento = {};
        $scope.oportunidad = null;
        $scope.contacto = {};
        var id;
        var idMedioComunicacion;
        var auxFecha = new Date();
        $scope.datePicker = setRangoDeFecha(auxFecha.getDate(), auxFecha.getMonth(), auxFecha.getFullYear(),0, 0, 5 );
        $scope.fechaActual = new Date(auxFecha.getFullYear().toString() + '-' + (auxFecha.getMonth() + 1).toString() + '-' + auxFecha.getDate().toString() +'-00:00:00');

        $scope.menuState = {}
        $scope.menuState.show = false;
        $scope.formBloqueo = false;
        $scope.bloqueado2 = false;
        $scope.bloqueado = true;
        $scope.idRol = MenuService.getRolId();

        $scope.oportunidadNegocioId = $stateParams.id;

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

        OportunidadNegocioCRService.getOportunidad($scope.oportunidadNegocioId).then(
            function (result) {
                $scope.oportunidad = result.data;
                $scope.estado = $scope.oportunidad.estadoONId;
                $scope.estadoON = $scope.oportunidad.estadoONId;
                if ($scope.oportunidad.fechaReactivacion != null) {
                    $scope.fechaActual = new Date();
                    $scope.fechaActual = $filter('date')($scope.fechaActual, 'dd-MM-yyyy');
                    $scope.fechaReactivacion = $filter('date')($scope.oportunidad.fechaReactivacion, 'dd-MM-yyyy');
                    $scope.oportunidad.fechaReactivacion = new Date($scope.oportunidad.fechaReactivacion);
                }
                var aux = ($filter('date')($scope.oportunidad.fecha, 'yyyy-MM-dd')).toString();
                aux += 'T00:00';
                $scope.oportunidad.fecha = new Date((aux));
                $scope.contacto = $scope.oportunidad.contacto;
                $scope.contacto.nombreEmpresa = $scope.oportunidad.empresa.nombreEmpresa;


                if ($scope.idRol == 15) {
                    $scope.menuState.show = true;
                }

                if ($scope.oportunidad.evento != null) {
                    $scope.nombreEvento = $scope.oportunidad.evento.nombreEvento;
                }

                switch ($scope.oportunidad.medioComunicacion) {
                    case "Llamada telefónica":
                        idMedioComunicacion = 0;
                        break;
                    case "Red Social":
                        idMedioComunicacion = 1;
                        break;
                    case "Correo electrónico":
                        idMedioComunicacion = 2;
                        break;
                    case "Sitio Web":
                        idMedioComunicacion = 3;
                        break;
                    case "Evento":
                        idMedioComunicacion = 4;
                        break;
                    case "Otro":
                        idMedioComunicacion = 5;
                        break;
                    default:
                }
                $scope.mediosComunicacion(idMedioComunicacion);
            },
            function (err) {
                toastr.error(err);
            });

        OportunidadNegocioCRService.getTiposEventosDisponibles().then(
            function (result) {
                $scope.tiposEventos = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.mediosComunicacion = function (idMedioComunicacion) {
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
            $scope.oportunidad.medio = $scope.medios[idMedioComunicacion];
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
                $scope.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                $scope.contacto.adjunto64 = selectedItem.adjunto64;
                $scope.contacto.puesto = selectedItem.puesto;
                $scope.contacto.localidad = selectedItem.localidad;
                $scope.contacto.calle = selectedItem.calle;
                $scope.contacto.colonia = selectedItem.colonia;
                $scope.contacto.correo = selectedItem.correo;
                $scope.contacto.edo = selectedItem.edo;
                $scope.contacto.cp = selectedItem.cp;
                $scope.contacto.telefono = selectedItem.telefono;
                $scope.contacto.celular = selectedItem.celular;
                $scope.contacto.empresaId = selectedItem.empresaId;
                $scope.contacto.contactoId = selectedItem.contactoId;
                $scope.contacto.estadoContacto = selectedItem.estadoContacto;
                $scope.oportunidadEditForm.$setDirty();
            });
        }

        $scope.saveOportunidad = function () {

           
            if ($scope.oportunidad.comentariosAdministrador == null || $scope.oportunidad.comentariosAdministrador == undefined || $scope.oportunidad.comentariosAdministrador == "") {
                toastr.error("Debe escribir los comentarios del administrador");
                return false;
            }
            if ($scope.oportunidad.fecha > $scope.fechaActual) {
                toastr.error("La fecha no debe ser mayor a la actual");
                return false;
            }

            if ($scope.oportunidad.fechaMaximaAtencion < $scope.fechaActual) {
                toastr.error("La fecha maxim\u00e1 de atenci\u00f3n no debe ser menor a la actual");
                return false;
            }
            if ($scope.oportunidadEditForm.fecha.$invalid ||  $scope.oportunidadEditForm.ComentariosAdmon.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                switch ($scope.oportunidad.medio.medioId) {
                    case "evento":
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
                $scope.oportunidad.contactoId = $scope.contacto.contactoId;
                $scope.oportunidad.estadoFlujoONId = 13;

                OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("asignarOportunidad");
                        if ($scope.oportunidad.notificar == true) {
                            var Mail = {
                                "Modulo": "Capital Relacional",
                                "Empleado": $scope.oportunidad.autor,
                                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                                "Seccion": "Oportunidad de Negocios",
                                "tituloON": "- Oportunidad de negocio revisada por el administrador",
                                "ClavePersona": $scope.oportunidad.claveEmpleado,
                                "TipoCorreo": "OportunidadNegocioNotificar"
                            }
                            OportunidadNegocioCRService.mailNotificacion(Mail);
                        }
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

        $scope.cambioValor = function () {
            $scope.bloqueado = false;
            $scope.bloqueado2 = true;
        }

        $scope.guardar = function () {
            var edo = $scope.oportunidad.estadoONId;
            switch (edo) {
                case 3:
                    if (!$scope.oportunidad.porQueCancela) {
                        toastr.error("Debe escribir el motivo de la cancelaci\u00f3n");
                        return;
                    }
                    break
                case 4:
                    if ($scope.oportunidad.tituloPropuesta == null || $scope.oportunidad.tituloPropuesta == ""
                        || $scope.oportunidad.noIniciativa == null || $scope.oportunidad.noIniciativa == ""
                        || $scope.oportunidad.noPropuesta == null || $scope.oportunidad.noPropuesta == "") {
                        toastr.error("Debe completar los campos requeridos");
                        return;
                    }
                    break
                case 2:
                    if ($scope.oportunidad.porQueSuspende == null || $scope.oportunidad.porQueSuspende == ""
                        || $scope.oportunidad.fechaReactivacion == null || $scope.oportunidad.fechaReactivacion == "") {
                        toastr.error("Debe ingresar motivo y fecha para suspender la oportunidad");
                        return;
                    }
                    break
                default:
            }

            if ($scope.oportunidad.estadoONId == 3) {
                $scope.actualizar();
            } else {
                $scope.ok();
            }
        }

        $scope.actualizar = function () {
            if ($scope.oportunidad.estadoONId == 3) {
                $scope.oportunidad.estadoFlujoONId = 3
            }

            if ($scope.oportunidad.estadoONId == 2) {
                $scope.oportunidad.estadoFlujoONId = 14
            }

            $scope.message = "¿Deseas cancelar la oportunidad?";
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/Confirmacion.html',
                controller: 'ConfirmaAdmonEspecialistaCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.formBloqueo = true;
            });
        }

        $scope.enviarCorreos = function () {
            var estado = $scope.oportunidad.estadoONId;
            switch (estado) {
                case 1:
                    nombreEstado = "Seguimiento";
                    break
                case 2:
                    nombreEstado = "Suspendida Temporalmente";
                    break
                case 3:
                    nombreEstado = "Cancelada";
                    break
                case 4:
                    nombreEstado = "En Iniciativa o Propuesta";
                    break
                default:

            }

            $scope.datosCorreos();
            //notificar Especialista
            var MailEspecialista = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "SeguimientoNotificarEstadoEspecialista"
            }
            OportunidadNegocioCRService.mailNotificacion(MailEspecialista);

            //notificar al empleado
            if ($scope.oportunidad.notificar == true) {
                var MailEmpleado = {
                    "Modulo": "Capital Relacional",
                    "Empleado": $scope.oportunidad.autor,
                    "Descripcion1": $scope.oportunidad.nombreOportunidad,
                    "Descripcion2": $scope.nombreEmpleado,
                    "Descripcion3": nombreEstado,
                    "Descripcion4": comentarios,
                    "Seccion": "Oportunidad de Negocios",
                    "tituloON": " - Oportunidad de Negocio   modificada por investigador",
                    "ClavePersona": $scope.oportunidad.claveEmpleado,
                    "TipoCorreo": "SeguimientoNotificarEstadoEmpleado"
                }
                OportunidadNegocioCRService.mailNotificacion(MailEmpleado);
            }
            //notificar responsable de unidad
            var MailResponsable = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                "ClavePersona": $scope.oportunidad.responsable,

                "TipoCorreo": "SeguimientoNotificarEstadoResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(MailResponsable);
            //notificar al administrador
            var MailAdministrador = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                //"ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "SeguimientoNotificarEstadoAdministrador"
            }
            OportunidadNegocioCRService.mailNotificacion(MailAdministrador);
        }

        $scope.datosCorreos = function () {
            switch ($scope.oportunidad.estadoONId) {
                case 2:
                    comentarios = $scope.oportunidad.porQueSuspende;
                    break;
                case 3:
                    comentarios = $scope.oportunidad.porQueCancela;
                    break;
                case 4:
                    comentarios = $scope.oportunidad.tituloPropuesta;
                    break;
                default:

            }
        }

        $scope.ok = function () {
            if ($scope.oportunidad.estadoONId == 4) {
                $scope.oportunidad.estadoFlujoONId = 9
            }
            $scope.oportunidad.nombreInvestigador = $scope.nombreEmpleado;
            OportunidadNegocioCRService.updateOportunidadON($scope.oportunidad).then(
                function (result) {
                    $state.go("asignarOportunidad");
                    if ($scope.oportunidad.estadoONId != 1) {
                        $scope.enviarCorreos();
                    }
                },
                function (err) {
                    toastr.error(err);
                }
            );
        }
    }
})();

