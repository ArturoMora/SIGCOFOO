(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("ramasagregarCtrl", [
        "$scope"
        ,'$state'
        ,"CatalogosPIService"
        , ramasagregarCtrl]);
    function ramasagregarCtrl($scope,$state,CatalogosPIService) {

        $scope.rama = {};

        $scope.guardarrama = function(){
            CatalogosPIService.createrama($scope.rama).then(
                function(result ){
                    toastr.success(result.data);
                    $state.go("ramasget");
                },
                function(error ){
                    toastr.error(error.data.message);
                }
            );
        }

        
        
    }
})();