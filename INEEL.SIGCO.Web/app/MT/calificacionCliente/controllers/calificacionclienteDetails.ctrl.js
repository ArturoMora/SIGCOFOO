(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("CalificacionClienteDetailsCtrl", ["AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "CalificacionClienteService", 
        CalificacionClienteDetailsCtrl
        ]);

    function CalificacionClienteDetailsCtrl(AuthService,$scope, $state, $stateParams, CalificacionClienteService) {
        $scope.cliente_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        CalificacionClienteService.getById($scope.cliente_id).then(
            function (result) {
                $scope.cliente = result.data;
                    if ($scope.cliente.estado == true) {
                        $scope.cliente.estado = "Activo";
                    } else if ($scope.cliente.estado == false) {
                        $scope.cliente.estado = "Inactivo";
                    }
            },
            function (err) {
                console.error(err);
            });
        }
})();