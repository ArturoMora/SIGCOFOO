(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProductoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$rootScope",
        "MenuService",
        "$filter",
        "ProductosCRService",
        "comunService",
        ProductosAddCtrl
        ]);

    function ProductosAddCtrl(AuthService, $scope, $state,$rootScope,MenuService, $filter, ProductosCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        
        $scope.datosComp = MenuService.getVariable("datosCompetidor");
        if ($scope.datosComp) {
            $scope.competidor = MenuService.getVariable("competidor");
            MenuService.setVariable("datosCompetidor", false);
            MenuService.deleteVariable("competidor");
        }

        $scope.AddProducto = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.producto.nomProd.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Producto"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var producto = {
                                "nomProd": $scope.producto.nomProd.replace(/\n/g, ""),
                                "descProd": $scope.producto.descProd,
                                "fechaRegistro": $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,
                            };
                            ProductosCRService.create(producto)
                                .then(
                                    function (result) {
                                        
                                        toastr.success("Registro creado exitosamente!");
                                        if ($scope.datosComp) {
                                            $scope.competidor.producto={};
                                            $scope.competidor.producto=result.data;
                                            // $scope.competidor.nombreProducto = result.data.nomProd;
                                            MenuService.setVariable("competidor", $scope.competidor);
                                        }
                                        $scope.regresar();
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
            }
        }

        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }
    }
})();