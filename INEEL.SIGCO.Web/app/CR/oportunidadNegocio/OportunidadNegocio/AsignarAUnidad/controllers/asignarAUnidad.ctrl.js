(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AsignarAUnidadCtrl", [
            "AuthService",
            "$scope",
            "MenuService",
            "$uibModal",
            "$uibModalInstance",
            "ContactosCRService",
            "OportunidadNegocioCRService",
            AsignarAUnidadCtrl
        ]);

    function AsignarAUnidadCtrl(AuthService, $scope, MenuService, $uibModal, $uibModalInstance, ContactosCRService, OportunidadNegocioCRService) {

        $scope.authentication = AuthService.authentication;
        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.responsable = {};
        var nombreUnidad = "";
        
        $scope.idRol = MenuService.getRolId();

        if ($scope.idRol == 1025) {
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

        $scope.oportunidad = $scope.oportunidad;

        $scope.nombreResponsable = function () {
            OportunidadNegocioCRService.getPersonaByResponsable($scope.unidad.claveResponsable).then(
                function (result) {
                    $scope.responsable = result.data;
                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });
        };

        $scope.asignarAUnidad = function () {
            
            if ($scope.oportunidad.responsable == null) {
                toastr.error("Debe seleccionar el responsable");
                return false;
            }
            if ($scope.oportunidad.comentariosEspecialista == null || $scope.oportunidad.comentariosEspecialista == undefined || $scope.oportunidad.comentariosEspecialista == "") {
                toastr.error("Debe escribir un comentario");
                return false;
            }
            OportunidadNegocioCRService.updateOportunidad($scope.oportunidad).then(
                function (result) {
                    $scope.recargar();
                    $uibModalInstance.dismiss('cancel');
                    ContactosCRService.getContacto($scope.oportunidad.contactoId).then(
                        function (result) {
                            $scope.contactoInsert = result.data;
                            $scope.sendEmail();
                            toastr.success("Oportunidad de negocio asignada correctamente");
                        },
                        function (err) {
                            toastr.error(data.InnerException.Message);
                        });
                    if ($scope.oportunidad.notificar == true) {
                        $scope.notificarme();
                    }
                    $scope.notificarAdministrador();
                },
                function (err) {
                    toastr.error(data.InnerException.Message);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.recargar();
        };

        $scope.$watch('unidad', function () {
            if ($scope.unidad != null || typeof $scope.unidad != 'undefined') {

                $scope.oportunidad.responsable = $scope.unidad.claveResponsable;
                $scope.oportunidad.claveUnidad = $scope.unidad.claveUnidad;
                $scope.oportunidad.estadoFlujoONId = 5;
                nombreUnidad = $scope.unidad.nombreUnidad;

                $scope.nombreResponsable();
            }
        })

        $scope.notificarme = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion3": nombreUnidad,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a una unidad organizacional",
                "ClavePersona": $scope.oportunidad.claveEmpleado,
                "TipoCorreo": "OportunidadNegocioNotificarEmpleado" //revisar que si cambie los valores para notificar al empleado
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
                "Descripcion7": $scope.oportunidad.descripcion,
                "Descripcion8": $scope.oportunidad.fechaMaximaAtencion,
                "Descripcion9": $scope.datosUsuarioAux.nombreCompleto,
                "Descripcion11": $scope.oportunidad.comentariosEspecialista,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a unidad organizacional",

                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificarUnidad"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }

        $scope.notificarAdministrador = function () {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.nombreEmpleado,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.unidad.nombreUnidad,
                "Descripcion3": $scope.datosUsuarioAux.nombreCompleto,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de negocio asignada a una unidad organizacional",
                "ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "OportunidadNegocioNotificaAdmin"
            }
            OportunidadNegocioCRService.mailNotificacion(Mail);
        }
    }
})();

