/// <reference path="oportunidadNegocioAdd.ctrl.js" />
(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("RechazarOportunidadCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "MenuService",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "ContactosCRService",
        "OportunidadNegocioCRService",
         RechazarOportunidadCtrl
    ]);

    function RechazarOportunidadCtrl(AuthService, $filter, $scope, $state, MenuService, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        var roles = $scope.authentication.userprofile.roles;

       
        $scope.noEmpleado     = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

      
        // RECHAZAR POR GERENTE O DIRECTOR DE DIVISION
        $scope.rechazar = function () {
          
            if ($scope.comentariosResponsable == null || $scope.comentariosResponsable == undefined || $scope.comentariosResponsable == "") {
                toastr.error("Es necesarios escribir los comentarios para rechazar la oportunidad");
                return;
            }

            $scope.oportunidad.comentariosResponsable = $scope.comentariosResponsable;
            $scope.oportunidad.estadoFlujoONId = 10;
            OportunidadNegocioCRService.rechazarOportunidad($scope.oportunidad).then(
            function (result) {
                toastr.success("La oportunidad de negocio fue rechazada exitosamente y enviada al especialista");
                $uibModalInstance.dismiss('cancel');
                $scope.recargar();
               
                $scope.notificarme();                              
                $scope.notificarAdministrador();
                $scope.notificarEspecialista();
                $state.go("oportunidadesPorAsignar");
            },
            function (err) {
                toastr.error(data.InnerException.Message);
            });
        };


        //RECHAZAR POR INVESTIGADOR 
        $scope.rechazarInvestigador = function () {
          

        
            if ($scope.comentariosResponsable == null || $scope.comentariosResponsable == undefined || $scope.comentariosResponsable == "") {
                toastr.error("Es necesarios escribir los comentarios para rechazar la oportunidad");
                return;
            }

            $scope.oportunidad.comentariosInvestigador = $scope.comentariosResponsable;
            $scope.oportunidad.estadoFlujoONId = 11;

            OportunidadNegocioCRService.rechazarOportunidadInvestigador($scope.oportunidad).then(
            function (result) {
                toastr.success("Oportunidad fue rechazada exitosamente y enviada al responsable de unidad");
                $uibModalInstance.dismiss('cancel');
                
                 $scope.notificarmeInvestigador();
              
                       
                $scope.notificarAdministradorInvestigador();
                $scope.notificarEspecialista2();
                $scope.sendEmailInvestigador();

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
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Descripcion4": $scope.oportunidad.comentariosResponsable,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por responsable de unidad organizacional",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarPorUnidad"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarEspecialista = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Descripcion4": $scope.oportunidad.comentariosResponsable,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por responsable de unidad organizacional",
                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "OportunidadNegocioNotificarRechazoPorUnidad"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarAdministrador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad,
                "Descripcion4": $scope.oportunidad.comentariosResponsable,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por responsable de unidad organizacional",
                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificaAdminRechazo"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        // rechazo investigador
        $scope.notificarEspecialista2 = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por investigador",
                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "OportunidadNegocioNotificarRechazoPorInvestigador"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarmeInvestigador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por investigador",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarmeRechazoPorInvestigador"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarAdministradorInvestigador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por investigador",
                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificarAdmonRechazoPorInvestigador"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.sendEmailInvestigador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": $scope.oportunidad.comentariosInvestigador,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio rechazada por investigador",
                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificarRechazoPorInvestigador"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();