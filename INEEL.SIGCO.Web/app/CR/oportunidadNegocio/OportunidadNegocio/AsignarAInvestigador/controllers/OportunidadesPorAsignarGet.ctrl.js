(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("OportunidadesPorAsignarGetCtrl", [
        "AuthService",
        "$scope",
        "MenuService",
        "DTOptionsBuilder",
        "$uibModal",
        "OportunidadNegocioCRService",
         OportunidadesPorAsignarGetCtrl
    ]);

    function OportunidadesPorAsignarGetCtrl(AuthService, $scope, MenuService, DTOptionsBuilder, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var Id = $scope.authentication.userprofile.clavePersona;
        $scope.oportunidadesPorAsignar = [];
        $scope.oportunidad = {};
        debugger;

        $scope.idRol = MenuService.getRolId();

        if ($scope.idRol == 4 || $scope.idRol == 5) {
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

        $scope.cargado = false;

        var id = $scope.authentication.userprofile.claveUnidad;

        $scope.recargar = function () {
            if ($scope.idRol == 4 || $scope.idRol == 5) {
                OportunidadNegocioCRService.getOportunidadesPorAsignarAInvestigador(id).then(
                function (result) {
                    $scope.oportunidadesPorAsignar = result.data;
                    $scope.cargado = true;
                },
                function (err) {
                    toastr.error(err);
                });
            }
        }

        $scope.rechazarOportunidad = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/RechazarOportunidad/rechazarOportunidad.html',
                controller: 'RechazarOportunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

            });
        }

        $scope.asignarOportunidadAInvestigador = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/AsignarAInvestigador/asignarOportunidadInvestigador.html',
                controller: 'AsignarOportunidadInvestigadorCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

            });
        }

        $scope.recargar();

    }
})();
