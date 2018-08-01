(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoProductoServicioGetCtrl", [
        "AuthService",
        "$scope",
        "TipoProductoServicioCRService",
        "$uibModal",
        TipoProductoServicioGetCtrl
        ]);

    function TipoProductoServicioGetCtrl(AuthService,$scope, TipoProductoServicioCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        TipoProductoServicioCRService.getAll().then(
            function (result) {
                $scope.tipoProductoServicio = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (producto) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (producto.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TipoProductoServicioCRService.UpdateEstado(producto).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tipoProductoServicio.indexOf(producto));
                        $scope.tipoProductoServicio[idx].estado = !$scope.tipoProductoServicio[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
        
    }


})();