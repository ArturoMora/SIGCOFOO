(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PPConvocatoriaDetailsCtrl", [
        "AuthService",
        "$scope",
        'globalGet',
        "$state",
        "$stateParams",
        "FondosProgramaCRService",
        "DTOptionsBuilder",
        PPConvocatoriaDetailsCtrl
        ]);

    function PPConvocatoriaDetailsCtrl(AuthService, $scope, globalGet, $state, $stateParams, FondosProgramaCRService, DTOptionsBuilder) {
        $scope.fondoProgramaId = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rtp');

        FondosProgramaCRService.getPP($scope.fondoProgramaId).then(
            function (result) {
                $scope.fondos = result.data;
            },
            function (err) {
                console.error(err);
            });

            

       
    }
})();



