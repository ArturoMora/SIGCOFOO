(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProveedorAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "ProveedoresCRService",
        ProveedorAddCtrl
        ]);

    function ProveedorAddCtrl(AuthService, $scope, $state, $stateParams, $filter, ProveedoresCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddProveedor = function () {
            debugger;
            if ($scope.proveedorAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var proveedor = {
                    "nombre": $scope.proveedor.nombre,
                    "descripcion": $scope.proveedor.descripcion,
                    //"fechaEfectiva": new Date(),
                    "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "autor": AuthService.authentication.nombreCompleto,
                    "estado": 1,

                };
                $scope.desactivar = true;
                ProveedoresCRService.create(proveedor)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $state.go("proveedoresGet");
                        },
                        function(err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                            $scope.desactivar = false;
                        });
            }
        }
    }
})();