
(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("OportunidadNegocioDetailsCtrl", [
            "AuthService",
            "$scope",
            "MenuService",
            "$state",
            "$stateParams",
            "$uibModal",
            "OportunidadNegocioCRService",
            OportunidadNegocioDetailsCtrl
        ]);

    function OportunidadNegocioDetailsCtrl(AuthService, $scope, MenuService, $state, $stateParams, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.oportunidadNegocioId = $stateParams.id;
        $scope.oportunidades = [];
        $scope.menuState = {}
        $scope.menuState.show = false;

        $scope.idRol = MenuService.getRolId();
        $scope.datosUsuarioAux = AuthService.authentication.userprofile;


        OportunidadNegocioCRService.getOportunidad($scope.oportunidadNegocioId).then(
            function (result) {
                $scope.oportunidad = result.data;
                var asignado = $scope.oportunidad.investigador;

                if ($scope.datosUsuarioAux.clavePersona == asignado) {
                    $scope.menuState.show = true;
                }
            },
            function (err) {
                toastr.error(err);
            });

        $scope.aceptarON = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/AceptarOportunidad/aceptarOportunidad.html',
                controller: 'AceptarOportunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) { });

        };

        $scope.recharzarON = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/RechazarOportunidad/rechazarOportunidad.html',
                controller: 'RechazarOportunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) { });
        }
    }
})();
