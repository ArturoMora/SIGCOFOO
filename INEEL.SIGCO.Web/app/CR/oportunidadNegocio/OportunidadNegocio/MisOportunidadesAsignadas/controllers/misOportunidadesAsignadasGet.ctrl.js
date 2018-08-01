(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("MisOportunidadesAsignadasGetCtrl", [
            "AuthService",
            "$scope",
            "MenuService",
            "DTOptionsBuilder",
            "$uibModal",
            "OportunidadNegocioCRService",
            MisOportunidadesAsignadasGetCtrl
        ]);

    function MisOportunidadesAsignadasGetCtrl(AuthService, $scope, MenuService, DTOptionsBuilder, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;

        var Id = $scope.authentication.userprofile.clavePersona;
        var id = $scope.authentication.userprofile.unidadOrganizacional.claveUnidad;

        $scope.oportunidadesAsignadas = [];

        $scope.idRol = MenuService.getRolId(); //revisar para lcarga de las On

        $scope.recargar = function () {

            if ($scope.idRol == 1025) {
                OportunidadNegocioCRService.getMisOportunidadesAsignadasEspecialista(Id).then(
                    function (result) {
                        $scope.oportunidadesAsignadas = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
            } else {
                OportunidadNegocioCRService.getMisOportunidadesAsignadas(Id).then(
                    function (result) {
                        $scope.oportunidadesAsignadas = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
            }
        }

        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [3, 'desc']);

        //asignadas al gerente
        if ($scope.idRol == 4) {
            OportunidadNegocioCRService.getMisOportunidadesAsignadasGerente(Id).then(
                function (result) {
                    $scope.oportunidadesAsignadas = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.asignarOportunidad = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/AsignarAUnidad/asignarAUnidad.html',
                controller: 'AsignarAUnidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) { });
        }

        $scope.recargar();
    }
})();
