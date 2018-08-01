(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("estadodelprocesoagregarCtrl", [
        "$scope"
        ,'$state'
        ,"CatalogosPIService"
        , estadodelprocesoagregarCtrl]);
    function estadodelprocesoagregarCtrl($scope,$state,CatalogosPIService) {

        $scope.estadodelproceso = {};

        $scope.guardarestadodelproceso = function(){
            CatalogosPIService.createestadodelproceso($scope.estadodelproceso).then(
                function(result ){
                    toastr.success(result.data);
                    $state.go("estadodelprocesoget");
                },
                function(error ){
                    toastr.error(error.data.message);
                }
            );
        }

        
        
    }
})();