(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SitioWebFondoProgramaEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "SitioWebFondoProgramaCRService",
        SitioWebFondoProgramaEditCtrl
        ]);

    function SitioWebFondoProgramaEditCtrl($scope, $state, $stateParams, SitioWebFondoProgramaCRService) {

        $scope.sitioWebFondoPrograma_id = $stateParams.id;

        SitioWebFondoProgramaCRService.get($scope.sitioWebFondoPrograma_id).then(
            function (result) {
                $scope.sitioWebFondoPrograma = result.data;
                $scope.sitioWebFondoPrograma.fechaEfectiva = new Date(result.data.fechaEfectiva);
            },
            function (err) {
                console.error(err);
            });

        $scope.saveSitioWebFondoPrograma = function () {

            if ($scope.sitioWebFondoProgramaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            $scope.desactivar = true;
            SitioWebFondoProgramaCRService.update($scope.sitioWebFondoPrograma).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("sitioWebFondoProgramaGet");
                },
                function (err) {
                    console.error(err);
                    $scope.desactivar = false;
                });
        };
    }
})();