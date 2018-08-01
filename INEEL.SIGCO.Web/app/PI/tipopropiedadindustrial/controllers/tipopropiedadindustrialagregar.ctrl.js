(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("tipopinagregarCtrl", [
        "$scope"
        ,'$state'
        ,"CatalogosPIService"
        , tipopinagregarCtrl]);
    function tipopinagregarCtrl($scope,$state,CatalogosPIService) {

        $scope.tipopin = {};

        $scope.guardartipopin = function(){
            CatalogosPIService.createtipopin($scope.tipopin) .then(
                function(result ){
                    toastr.success(result.data);
                    $state.go("tipopinget");
                },
                function(error ){
                    toastr.error(error.data.message);
                }
            );
        }

        
        
    }
})();