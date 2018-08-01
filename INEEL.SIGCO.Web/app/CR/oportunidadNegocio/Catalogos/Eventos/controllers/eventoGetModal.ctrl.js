(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("EventosGetModalCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "$uibModalInstance",
        "OportunidadNegocioCRService",
         EventosGetModalCtrl
    ]);

    function EventosGetModalCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, $uibModalInstance, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var pagina;
        $scope.eventos = [];
        //$scope.eventoSeleccionado = {};

        var id = $scope.oportunidad.tipoEventoONId
        OportunidadNegocioCRService.getEventosByTipoEvento(id).then(
            function (result) {
                $scope.eventos = result.data;
                toastr.info("Seleccione un evento");
            },
            function (err) {
                toastr.error(err);
            });

        $scope.detallesEvento = function (id) {
            $scope.eventoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/oportunidadNegocio/Catalogos/Eventos/eventoDetailsModal.html',
                controller: 'EventoDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                debugger;
            });
        }

        $scope.eventoSeleccionado = function (scope) {
            $scope.nodoSeleccionado = scope;
            $uibModalInstance.close($scope.nodoSeleccionado);
            toastr.clear();
        }

        $scope.cancel = function () {
            toastr.clear();
            $uibModalInstance.dismiss('cancel');
            
        };
    }
})();