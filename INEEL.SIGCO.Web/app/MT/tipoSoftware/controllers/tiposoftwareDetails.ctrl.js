(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("TipoSoftwareDetailsCtrl", [
        "AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "TipoSoftwareService", 
        TipoSoftwareDetailsCtrl
        ]);

    function TipoSoftwareDetailsCtrl(AuthService,$scope, $state, $stateParams, TipoSoftwareService) {    
        $scope.software_id = $stateParams.id;
        $scope.aux = $scope.software_id
        $scope.authentication = AuthService.authentication;
        TipoSoftwareService.getById($scope.software_id).then(
            function (result) {
                $scope.software = result.data;
                if ($scope.software.estado == true) {
                    $scope.software.estado = "Activo";
                } else if ($scope.software.estado == false) {
                    $scope.software.estado = "Inactivo";
                }
            },
            function (err) {
                console.error(err);
            });
        }
})();