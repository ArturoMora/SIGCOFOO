(function () {
    "use strict";
    angular
    .module("ineelCH")
    .controller("InformeBecarioExternoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$stateParams",
        "InformeBecarioCHService",
        InformeBecarioExternoDetailsCtrl
    ]);
           
    function InformeBecarioExternoDetailsCtrl(AuthService, $scope, $stateParams, InformeBecarioCHService ) {
        $scope.authentication = AuthService.authentication;

        InformeBecarioCHService.getBecario($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                toastr.error(err.data.message);
                console.error(err);
            });
    };
    
})();