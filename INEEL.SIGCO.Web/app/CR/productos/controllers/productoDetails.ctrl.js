(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProductoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ProductosCRService",
        ProductoDetailsCtrl
        ]);

    function ProductoDetailsCtrl(AuthService,$scope, $state, $stateParams, ProductosCRService) {
        $scope.producto_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        ProductosCRService.getProducto($scope.producto_id).then(
            function (result) {
                $scope.productos = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;

            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
        }
    }
})();



