(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProductosGetCtrl", [
        "AuthService",
        "$scope",
        "ProductosCRService",
        "$uibModal",
        ProductosGetCtrl
        ]);

    function ProductosGetCtrl(AuthService,$scope, ProductosCRService,  $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};
        $scope.loading = true;
        ProductosCRService.getProductos().then(
            function (result) {
                $scope.productos = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (producto) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (producto.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ProductosCRService.UpdateEstado(producto).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.productos.indexOf(producto));
                        $scope.productos[idx].estado = !$scope.productos[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();