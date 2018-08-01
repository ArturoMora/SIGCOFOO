(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('hitorialinCtrl', [
            '$scope'
            , '$stateParams'
            , 'PropiedadIndustrialService'
            , hitorialinCtrl]);

    function hitorialinCtrl($scope, $stateParams, PropiedadIndustrialService) {
        $scope.historial = [];
        $scope.pinid = $stateParams.id;

        PropiedadIndustrialService.getbypi($scope.pinid).then(
            function (response) {
                $scope.propiedadindustrial = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );

        $scope.eliminar = function (accion) {
            PropiedadIndustrialService.deletehistorial(accion.historialPIId).then(
                function (result) {
                    var index = $scope.propiedadindustrial.historial.indexOf(accion);
                    $scope.propiedadindustrial.historial.splice(index, 1);
                    toastr.success(result.data);
                },
                function (error) {
                    toastr.error(error.data.message);
                }
            );

        }

    }
}());