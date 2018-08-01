(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AsignarOportunidadInvestigadorCtrl", [
            "AuthService",
            "$scope",
            "MenuService",
            "$uibModal",
            "$uibModalInstance",
            "ContactosCRService",
            "OportunidadNegocioCRService",
            AsignarOportunidadInvestigadorCtrl
        ]);

    function AsignarOportunidadInvestigadorCtrl(AuthService, $scope, MenuService, $uibModal, $uibModalInstance, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.investigadores = [];

        $scope.idRol = MenuService.getRolId();

        if ($scope.idRol == 4) {
            $scope.datosUsuarioAux = AuthService.authentication.userprofile;
        } else {
            $scope.datosUsuarioAux = {
                'clavePersona': '',
                'fechaIngreso': '',
                'categoria': { 'descripcion': '' },
                'nombreCompleto': '',
                'unidadOrganizacional': { 'nombreUnidad': '' },
                'antiguedad': ''
            };
        }


        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.oportunidad = $scope.oportunidad;
        $scope.claveUnidad = $scope.oportunidad.claveUnidad;

        OportunidadNegocioCRService.getInvestigadoresByUnidadPadre($scope.claveUnidad).then(
            function (result) {
                $scope.investigadores = result.data;
            },
            function (err) {
                toastr.error(data.InnerException.Message);
            });

        $scope.investigadorSeleccionado = function (i) {
            debugger;
            var apaterno, amaterno, nombre;
            $scope.investigador = i;
            $scope.oportunidad.investigador = i.clavePersona;
            $scope.oportunidad.nombreInvestigador = i.nombreCompleto;
            //i.unidadOrganizacional.claveUnidad}
        }

        $scope.asignarAInvestigador = function () {
            $scope.oportunidad.AsignarGerente = false;
            if ($scope.oportunidad.investigador == null || $scope.oportunidad.investigador == undefined || $scope.oportunidad.investigador == "") {
                toastr.error("Es necesarios seleccionar un investigador para asignar la oportunidad");
                return;
            }

            if ($scope.comentariosResponsable == null || $scope.comentariosResponsable == undefined || $scope.comentariosResponsable == "") {
                toastr.error("Debe escribir un comentario para asignar la oportunidad");
                return;
            }

            if ($scope.comentariosResponsable != null && $scope.comentariosResponsable != undefined && $scope.comentariosResponsable != "" && $scope.idRol == 5) {
                $scope.oportunidad.AsignarGerente = true;
                $scope.oportunidad.Responsable = $scope.oportunidad.investigador;
                $scope.oportunidad.claveUnidad = $scope.investigador.unidadOrganizacional.claveUnidad;
                $scope.oportunidad.investigador = null;
            }
            debugger;
            $scope.oportunidad.comentariosResponsable = $scope.comentariosResponsable;
            OportunidadNegocioCRService.asignarOportunidadInvestigador($scope.oportunidad).then(
                function (result) {
                    toastr.success(result.data);
                    ContactosCRService.getContacto($scope.oportunidad.contactoId).then(
                        function (result) {
                            $scope.contactoInsert = result.data;
                            $scope.sendEmail();
                        },
                        function (err) {
                            toastr.error(data.InnerException.Message);
                        });

                    $scope.recargar();

                    if ($scope.oportunidad.notificar == true) {
                        $scope.notificarme();
                    }
                    $scope.notificarEspecialista();
                    $scope.notificarAdministrador();
                    $uibModalInstance.dismiss('cancel');

                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.notificarme = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.nombreInvestigador,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a investigador",

                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarPorResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.sendEmail = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.fecha,
                "Descripcion3": $scope.contactoInsert.nombreCompleto,
                "Descripcion4": $scope.contactoInsert.empresa.nombreEmpresa,
                "Descripcion5": $scope.contactoInsert.telefono,
                "Descripcion6": $scope.contactoInsert.correo,
                "Descripcion7": $scope.oportunidad.comentariosResponsable,
                "Descripcion8": $scope.oportunidad.comentariosEspecialista,
                "Descripcion9": $scope.oportunidad.descripcion,
                "Descripcion10": $scope.oportunidad.fechaMaximaAtencion,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Nueva oportunidad de negocio asignada a usted",

                "ClavePersona": $scope.oportunidad.investigador,
                "TipoCorreo": "OportunidadNegocioAsignarInvestigador"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarAdministrador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.nombreInvestigador,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a investigador",

                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificarAdminPorResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarEspecialista = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.nombreInvestigador,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a investigador",

                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "OportunidadNegocioNotificarEspecialistaPorResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();

