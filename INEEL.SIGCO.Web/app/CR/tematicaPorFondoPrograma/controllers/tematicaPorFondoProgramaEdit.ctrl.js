(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TipoConvenioCRService",
        TipoConvenioEditCtrl
        ]);

    function TipoConvenioEditCtrl($scope, $state, $stateParams, TipoConvenioCRService) {

        $scope.tipoConvenio_id = $stateParams.id;

        TipoConvenioCRService.get($scope.tipoConvenio_id).then(
            function (result) {
                $scope.tipoConvenio = result.data;
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoConvenio = function () {

            if ($scope.tipoConvenioForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }

            TipoConvenioCRService.update($scope.tipoConvenio).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("tipoConvenioGet");
                },
                function (err) {
                    console.error(err);
                });
        };
    }
})();