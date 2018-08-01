(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("CambioEstadoCtrl", [
            "$scope",
            "OportunidadNegocioCRService",
            CambioEstadoCtrl
        ]);

    function CambioEstadoCtrl($scope, OportunidadNegocioCRService) {
        var nombreEstado = "";
        var comentarios = "";

        $scope.cargarestadoson = function () {
            OportunidadNegocioCRService.getEstadosON().then(
                function (result) {
                    $scope.estadosON = result.data;
                    $scope.estadoactual = $scope.oportunidad.estadoONId;
                    
                    if ($scope.estado !== undefined) {
                        //$scope.estado = {};
                        $scope.estadoactual = $scope.oportunidad.estadoONId;
                    }
                    if ($scope.oportunidad.fechaReactivacion !== null) {
                        $scope.oportunidad.fechaReactivacion = new Date($scope.oportunidad.fechaReactivacion);
                    }

                },
                function (err) {
                    toastr.error(err);
                }
            );
        }

        $scope.cargarestadoson();

        $scope.cambiarestado = function () {

            $scope.validar();
            $scope.enviarCorreos();

            if ($scope.estadoONnext == 3) {
                $scope.oportunidad.estadoFlujoONId = 3;
                $scope.oportunidad.estadoONId = 3;
                $scope.oportunidad.porQueCancela = $scope.porQueCancela;
            }

            if ($scope.estadoONnext == 1) {
                $scope.oportunidad.estadoONId = 1;
            }

            if ($scope.estadoONnext == 2) {
                $scope.oportunidad.estadoONId = 2;
            }

            if ($scope.estadoONnext == 4) {
                $scope.oportunidad.estadoFlujoONId = 14;
                $scope.oportunidad.estadoONId = 4;
                $scope.oportunidad.tituloPropuesta = $scope.tituloPropuesta;
                $scope.oportunidad.noIniciativa = $scope.noIniciativa;
                $scope.oportunidad.noPropuesta = $scope.noPropuesta;
            }

            OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.obteneron();
                },
                function (err) {
                    toastr.error(err);
                }
            );


        }



        $scope.validar = function () {
            var edo = $scope.estadoId;
            switch (edo) {
                case 3:
                    if ($scope.porQueCancela == null || $scope.porQueCancela == "") {
                        toastr.error("Debe registrar el motivo de la cancelaci\u00f3n");
                        return;
                    }
                    break
                case 4:
                    if ($scope.tituloPropuesta == null || $scope.tituloPropuesta == "") {
                        toastr.error("Debe registrar el titulo de la propuesta");
                        return;
                    }
                    if ($scope.noIniciativa == null || $scope.noIniciativa == ""
                        && $scope.noPropuesta == null || $scope.noPropuesta == "") {
                        toastr.error("Debe registrar el n&oacute;mero de iniciativa o propuesta");
                        return;
                    }
                    break
                case 2:
                    if ($scope.porQueSuspende == null || $scope.porQueSuspende == "" || $scope.fechaReactivacion == null || $scope.fechaReactivacion == "") {
                        toastr.error("Debe ingresar motivo y fecha de suspensi&oacute;n de la oportunidad de negocio");
                        return;
                    }
                    break
                default:
            }
        }

        $scope.enviarCorreos = function () {
            var estado = $scope.estadoId;
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

            switch ($scope.estadoId) {
                case 2:
                    comentarios = $scope.porQueSuspende;
                    break;
                case 3:
                    comentarios = $scope.porQueCancela;
                    break;
                case 4:
                    comentarios = $scope.tituloPropuesta;
                    break;
                default:
            }


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
                "TipoCorreo": "SeguimientoNotificarEstadoAdministrador"
            }
            OportunidadNegocioCRService.mailNotificacion(MailAdministrador);



        }


        $scope.obteneron = function () {
            OportunidadNegocioCRService.getOportunidad($scope.oportunidad.oportunidadNegocioId).then(
                function (result) {
                    $scope.oportunidad = result.data;
                    $scope.cargarestadoson();
                },
                function (err) {
                    toastr.error(err);
                });
        }
    }
})();
