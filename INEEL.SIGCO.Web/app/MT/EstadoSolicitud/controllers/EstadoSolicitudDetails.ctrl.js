(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("EstadoSolicitudDetailsCtrl", ["AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "EstadoSolicitudService", 
        EstadoSolicitudDetailsCtrl
        ]);

    function EstadoSolicitudDetailsCtrl(AuthService,$scope, $state, $stateParams, EstadoSolicitudService) {
        $scope.estado_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        EstadoSolicitudService.getById($scope.estado_id).then(
            function (result) {
                $scope.estado = result.data;
                    if ($scope.estado.estado == true) {
                        $scope.estado.estado = "Activo";
                    } else if ($scope.estado.estado == false) {
                        $scope.estado.estado = "Inactivo";
                    }
            },
            function (err) {
                console.error(err);
            });
        }
})();