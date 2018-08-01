(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("tipopineditarCtrl", [
        "$scope"
        , "$stateParams"
        , "CatalogosPIService"
        , tipopineditarCtrl]);
    function tipopineditarCtrl($scope, $stateParams, CatalogosPIService) {

        $scope.tipopin = {};

        $scope.tipopinid = $stateParams.id;

        $scope.cargaregistrotipopin = function () {
            CatalogosPIService.obtenertipopin($scope.tipopinid).then(
                function (response) {
                    $scope.tipopin = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );
        }
        $scope.cargaregistrotipopin();

        $scope.actualizartipopin = function () {
            
            CatalogosPIService.updatetipopin($scope.tipopin).then(
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