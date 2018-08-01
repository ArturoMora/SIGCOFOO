(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProductoEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ProductosCRService",
        "comunService",
        ProductoEditCtrl
        ]);

    function ProductoEditCtrl(AuthService,$scope, $state, $stateParams, ProductosCRService,comunService) {

        $scope.producto_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        ProductosCRService.getProducto($scope.producto_id).then(
            function (result) {
                $scope.productos = result.data;
                $scope.excepcion = result.data.nomProd.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveProducto = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.productos.nomProd.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Producto",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            ProductosCRService.update($scope.productos)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("productosGet");
                                    },
                                    function (err) {
                                        console.error(err);
                                    });
                        }
                    });
                
            }
        };
    }
})();