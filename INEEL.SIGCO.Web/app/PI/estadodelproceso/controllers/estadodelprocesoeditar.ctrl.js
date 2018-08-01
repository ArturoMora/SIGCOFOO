(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("estadodelprocesoeditarCtrl", [
        "$scope"
        , "$stateParams"
        , "CatalogosPIService"
        , estadodelprocesoeditarCtrl]);
    function estadodelprocesoeditarCtrl($scope, $stateParams, CatalogosPIService) {

        $scope.estadodelproceso = {};

        $scope.estadodelprocesoid = $stateParams.id;

        $scope.cargaregistroestadodelproceso = function () {
            CatalogosPIService.obtenerestadodelproceso($scope.estadodelprocesoid).then(
                function (response) {
                    $scope.estadodelproceso = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );
        }
        $scope.cargaregistroestadodelproceso();

        $scope.actualizarestadodelproceso = function () {
            CatalogosPIService.updateestadodelproceso($scope.estadodelproceso).then(
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