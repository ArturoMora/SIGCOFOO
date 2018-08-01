(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("ramaseditarCtrl", [
        "$scope"
        , "$stateParams"
        , "CatalogosPIService"
        , ramaseditarCtrl]);
    function ramaseditarCtrl($scope, $stateParams, CatalogosPIService) {

        $scope.rama = {};

        $scope.ramaid = $stateParams.id;

        $scope.cargaregistrorama = function () {
            CatalogosPIService.obtenerrama($scope.ramaid).then(
                function (response) {
                    $scope.rama = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );
        }
        $scope.cargaregistrorama();

        $scope.actualizarrama = function () {
            
            CatalogosPIService.updaterama($scope.rama).then(
                function (result) { 
                    toastr.success(result.data);
                },
                function (error) {
                    toastr.error(error.data.message);
                }
            );
        }



    }
})();