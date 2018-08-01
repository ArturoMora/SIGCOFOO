(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("CalificacionPersonalDetailsCtrl", ["AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "CalificacionPersonalService", 
        CalificacionPersonalDetailsCtrl
        ]);

    function CalificacionPersonalDetailsCtrl(AuthService,$scope, $state, $stateParams, CalificacionPersonalService) {
        $scope.personal_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        CalificacionPersonalService.getById($scope.personal_id).then(
            function (result) {
                $scope.personal = result.data;
                    if ($scope.personal.estado == true) {
                        $scope.personal.estado = "Activo";
                    } else if ($scope.personal.estado == false) {
                        $scope.personal.estado = "Inactivo";
                    }
            },
            function (err) {
                console.error(err);
            });
        }
})();