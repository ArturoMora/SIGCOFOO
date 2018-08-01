(function () {
    "use strict";

    angular
    .module("ineelCH")
    .controller("BecarioExternoDetailsCtrl", [
        "AuthService",
        "$scope", 
        "$state",
        '$rootScope',
        "$stateParams",
        "globalGet",
        "InformeBecarioCHService", 
        BecarioExternoDetailsCtrl
        ]);

    function BecarioExternoDetailsCtrl(AuthService, $scope, $state, $rootScope, $stateParams, globalGet, InformeBecarioCHService) {
        $scope.authentication = AuthService.authentication;

        InformeBecarioCHService.getBecario($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                toastr.error(err.data.message);
                console.error(err);
            });
        }
})();