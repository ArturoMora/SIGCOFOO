(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("IniciativasEmpresaGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "IniciativasEmpresaCRService",
        IniciativasEmpresaGetCtrl
    ]);

    function IniciativasEmpresaGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, IniciativasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.iniciativasEmpresa = [];

        IniciativasEmpresaCRService.getIniciativasEmpresa().then(
            function (result) {
                $scope.iniciativasEmpresa = result.data;
                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withOption('responsive', true);
            },
            function (err) {
                toastr.error(err);
            });
    }
})();