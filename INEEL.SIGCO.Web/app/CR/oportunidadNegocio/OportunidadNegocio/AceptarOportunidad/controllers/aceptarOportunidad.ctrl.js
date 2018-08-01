(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AceptarOportunidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "$uibModalInstance",
            "OportunidadNegocioCRService",
            AceptarOportunidadCtrl
        ]);

    function AceptarOportunidadCtrl(AuthService, $scope, $state, $uibModal, $uibModalInstance, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        $scope.datosUsuarioAux = AuthService.authentication.userprofile;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

        $scope.oportunidadAceptada = $scope.oportunidad;
        $scope.oportunidadAceptada.nombreInvestigador = $scope.datosUsuarioAux.nombreCompleto;

        $scope.aceptar = function (o) {
            $scope.oportunidadAceptada.nombreInvestigador
            $scope.oportunidadAceptada.comentariosInvestigador = $scope.comentariosInvestigador;
            if ($scope.oportunidadAceptada.comentariosInvestigador == null || $scope.oportunidadAceptada.comentariosInvestigador == undefined || $scope.oportunidadAceptada.comentariosInvestigador == "") {
                toastr.error("Es necesarios escribir los comentarios para aceptar la oportunidad");
                return;
            }

            OportunidadNegocioCRService.aceptarOportunidad($scope.oportunidadAceptada).then(
                function (result) {
                    toastr.success("Oportunidad aceptada");
                    $uibModalInstance.dismiss('cancel');

                    if ($scope.oportunidadAceptada.notificar == true) {
                        $scope.notificarme();
                    }

                    $scope.sendEmail();
                    $scope.notificarAdministrador();
                    $scope.notificarEspecialista();
                    $state.go("misOportunidadesAsignadas");
                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });

        };

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
                "Descripcion4": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio aceptada por el investigador",
                "ClavePersona": $scope.oportunidadAceptada.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarAceptada"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.sendEmail = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.oportunidad.nombreInvestigador,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Descripcion4": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio aceptada por el investigador",

                "ClavePersona": $scope.oportunidadAceptada.responsable,
                "TipoCorreo": "OportunidadNegocioAcepto"
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
                "Descripcion4": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio aceptada por el investigador",

                //"ClavePersona": $scope.oportunidadAceptada.responsable,
                "TipoCorreo": "OportunidadNegocioNotificaAdminAceptada"
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
                "Descripcion4": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio aceptada por el investigador",

                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "OportunidadNegocioNotificarEspecialitaAceptada"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();

