(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("EmpresasCompetidoresFilterGetCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "buscarEmpresasService",
            "$uibModalInstance",
            "DTOptionsBuilder", EmpresasCompetidoresFilterGetCtrl]);

    function EmpresasCompetidoresFilterGetCtrl($scope, $state, $stateParams,
        buscarEmpresasService, $uibModalInstance, DTOptionsBuilder) {
        $scope.empresa = {};

        $scope.empresas = [];
        $scope.empresaSelect = {};
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('language', { sSearch: "Filtrar" })
            .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.close();
        }


        buscarEmpresasService.GetEmpresasForModalCompetidores().then(
            function (result) {
                $scope.empresas = result.data;

                if ($scope.empresas.length === 0) {
                    toastr.warning("Ning&uacute;n resultado");
                }
            },
            function (err) {
                $scope.empresas = [];
                toastr.error(err.data.message || "Error al procesar su solicitud");

            }
        )


        $scope.ok = function (empresa) {
            $uibModalInstance.close(empresa);
        }

    }


})();