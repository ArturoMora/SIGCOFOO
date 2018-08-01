(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FuenteFinanciamientoDetailsCtrl", [
            "AuthService",
            "$scope",
            "$stateParams",
            "FuentesFinanciamientoCRService",
            FuenteFinanciamientoDetailsCtrl
        ]);

    function FuenteFinanciamientoDetailsCtrl(AuthService, $scope, $stateParams, FuentesFinanciamientoCRService) {
        $scope.fuenteFinanciamiento_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        FuentesFinanciamientoCRService.getFuenteFinanciamientoFK($scope.fuenteFinanciamiento_id).then(
            function (result) {
                
                $scope.fuentesFinanciamiento = result.data;
            },
            function (err) {
                console.error(err);
            });
    }
})();



