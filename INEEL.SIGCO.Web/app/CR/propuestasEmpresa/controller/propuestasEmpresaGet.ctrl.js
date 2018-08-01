(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("PropuestasEmpresaGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "PropuestasEmpresaCRService",
        PropuestasEmpresaGetCtrl
    ]);

    function PropuestasEmpresaGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, PropuestasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.propuestasEmpresa = [];

        PropuestasEmpresaCRService.getPropuestasEmpresa().then(
            function (result) {
                $scope.propuestasEmpresa = result.data;
                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withOption('responsive', true);
            },
            function (err) {
                toastr.error(err);
            });
    }
})();