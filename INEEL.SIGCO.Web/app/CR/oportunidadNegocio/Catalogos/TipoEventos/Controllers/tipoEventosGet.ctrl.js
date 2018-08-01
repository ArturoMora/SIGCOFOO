(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("TipoEventosGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "OportunidadNegocioCRService",
         TipoEventosGetCtrl
    ]);

    function TipoEventosGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var pagina;
        $scope.tiposEventos = [];
        $scope.tipoEvento = {};

        $scope.recargar = function(){
            OportunidadNegocioCRService.getTiposEventos().then(
               function (result) {
                   $scope.tiposEventos = result.data;
               },
               function (err) {
                   toastr.error(err);
               });
        }

        $scope.agregarTipoEvento = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/oportunidadNegocio/Catalogos/TipoEventos/tipoEventoAdd.html',
                controller: 'TipoEventoAddCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.editarTipoEvento = function (id) {
            $scope.tipoEventoONId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/oportunidadNegocio/Catalogos/TipoEventos/tipoEventoEdit.html',
                controller: 'TipoEventoEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.eliminacionLogica = function (id) {
            if (id.estado == true || id.estado == 1) {
                pagina = "Active";
            } else {
                pagina = "Delete";
            }

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.tipoEvento = id;
                        OportunidadNegocioCRService.deleteTipoEvento($scope.tipoEvento).then(
                            function (success) {
                                $scope.recargar();
                            },
                            function (err) {
                                toastr.error(err);
                            }
                        );
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargar();
                    };
                },
                scope: $scope
            });
        }

        $scope.recargar();
    }
})();