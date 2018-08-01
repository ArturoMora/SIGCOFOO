(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProveedorEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ProveedoresCRService",
        ProveedorEditCtrl
        ]);

    function ProveedorEditCtrl(AuthService, $scope, $state, $stateParams, ProveedoresCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.proveedor_id = $stateParams.id;

        ProveedoresCRService.getProveedor($scope.proveedor_id).then(
            function (result) {
                $scope.proveedores = result.data;
                //$scope.areasInvestigacion.fechaRegistro = new Date(result.data.fechaRegistro);
                //$scope.areasInvestigacion.fechaEfectiva = new Date(result.data.fechaEfectiva);
            },
            function (err) {
                console.error(err);
            });

        $scope.saveProveedor = function () {

            if ($scope.proveedorForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.desactivar = true;
                ProveedoresCRService.update($scope.proveedores)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $state.go("proveedoresGet");
                        },
                        function(err) {
                            console.error(err);
                            $scope.desactivar = false;
                        });
            }
        };
    }
})();