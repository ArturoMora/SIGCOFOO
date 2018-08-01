(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProveedorDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ProveedoresCRService",
        ProveedorDetailsCtrl
        ]);

    function ProveedorDetailsCtrl(AuthService, $scope, $state, $stateParams, ProveedoresCRService) {
        $scope.proveedor_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        ProveedoresCRService.getProveedor($scope.proveedor_id).then(
            function (result) {
                $scope.proveedores = result.data;
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



