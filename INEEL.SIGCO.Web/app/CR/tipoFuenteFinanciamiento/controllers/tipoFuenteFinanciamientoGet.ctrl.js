(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoFuenteFinanciamientoGetCtrl", [
        "AuthService",
        "$scope",
        "TipoFuenteFinanciamientoCRService",
        "$uibModal",
        TipoFuenteFinanciamientoGetCtrl
        ]);

    function TipoFuenteFinanciamientoGetCtrl(AuthService,$scope, TipoFuenteFinanciamientoCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        TipoFuenteFinanciamientoCRService.getAll().then(
            function (result) {
                $scope.tipoFuenteFinanciamiento = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (fuente) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (fuente.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TipoFuenteFinanciamientoCRService.UpdateEstado(fuente).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tipoFuenteFinanciamiento.indexOf(fuente));
                        $scope.tipoFuenteFinanciamiento[idx].estado = !$scope.tipoFuenteFinanciamiento[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();