(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ServiciosGetCtrl", [
        "AuthService",
        "$scope",
        "ServiciosCRService",
        "$uibModal",
        ServiciosGetCtrl
        ]);

    function ServiciosGetCtrl(AuthService, $scope, ServiciosCRService,  $uibModal) {
        $scope.authentication = AuthService.authentication;
        ServiciosCRService.getServicios().then(
            function (result) {
                $scope.servicios = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (servicio) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (servicio.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ServiciosCRService.UpdateEstado(servicio).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.servicios.indexOf(servicio));
                        $scope.servicios[idx].estado = !$scope.servicios[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }


})();