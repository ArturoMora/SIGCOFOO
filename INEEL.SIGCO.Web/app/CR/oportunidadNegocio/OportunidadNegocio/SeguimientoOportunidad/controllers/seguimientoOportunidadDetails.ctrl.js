
(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SeguimientoOportunidadDetailsCtrl", [
            "AuthService",
            "$filter",
            "$scope",
            "$uibModal",
            "$stateParams",
            "DTOptionsBuilder",
            "OportunidadNegocioCRService",
            SeguimientoOportunidadDetailsCtrl
        ]);

    function SeguimientoOportunidadDetailsCtrl(AuthService, $filter, $scope, $uibModal, $stateParams, DTOptionsBuilder, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.oportunidadNegocioId = $stateParams.id;
        $scope.oportunidad = null;
        $scope.estado = {};
        $scope.seguimientos = [];
        var comentarios = "";

        $scope.PaginaReferencia = "seguimientoOportunidad";

        $scope.datosUsuarioAux = AuthService.authentication.userprofile;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', false);



        OportunidadNegocioCRService.getOportunidad($scope.oportunidadNegocioId).then(
            function (result) {
                $scope.oportunidad = result.data;
                $scope.estado.estadoactual = $scope.oportunidad.estadoONId;

                if ($scope.oportunidad.fechaReactivacion != null) {
                    $scope.fechaActual = new Date();
                    $scope.fechaActual = $filter('date')($scope.fechaActual, 'dd-MM-yyyy');
                    $scope.fechaReactivacion = $filter('date')($scope.oportunidad.fechaReactivacion, 'dd-MM-yyyy');
                    $scope.oportunidad.fechaReactivacion = new Date($scope.oportunidad.fechaReactivacion);
                }
            },
            function (err) {
                toastr.error(err);
            }
        );


        $scope.recargarActividades = function () {
            OportunidadNegocioCRService.getSeguimientosByON($scope.oportunidadNegocioId).then(
                function (result) {
                    $scope.seguimientos = result.data;
                },
                function (err) {
                    toastr.error(err);
                }
            );
        }

        $scope.agregarActividad = function (o) {
            $scope.oportunidad = o;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/seguimientoOportunidadAdd.html',
                controller: 'SeguimientoOportunidadAddCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

            });
        }

        $scope.editarActividad = function (s) {
            $scope.seguimiento = s;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/seguimientoOportunidadEdit.html',
                controller: 'SeguimientoOportunidadEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

            });
        }

        $scope.eliminarActividad = function (Id) {
            $scope.id = Id;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: 'SeguimientoOportunidadDeleteCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

            });
        }



        $scope.recargarActividades();


    }
})();
