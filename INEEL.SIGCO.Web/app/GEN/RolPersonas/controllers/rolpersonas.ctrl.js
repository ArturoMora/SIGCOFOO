/*AYUDA:
FooEntitiesService nombre de factory en rolpersonas.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("FooModelCtrl", ["$scope", "$state", "$stateParams", "FooEntitiesService", FooModelCtrl]);

    function FooModelCtrl($scope, $state, $stateParams, FooEntitiesService) {
        $scope.models = [];
        FooEntitiesService.get().then(
            function (result) {
                $scope.models = result.data;
            },
            function (err) {
                console.error(err);
            });
        /*$scope.delete = function (model) {
            if (confirm("Seguro que desea eliminar el empleado?")) {

                FooEntitiesService.delete(model.modelID).then(
                   function (result) {
                       var idx = $scope.models.indexOf(model)
                       $scope.models.splice(idx, 1);
                       toastr.success(result.data);
                   },
                   function (err) {
                       console.error(err);
                       toastr.error(err.data.message);
                   });
            }

        }*/
        //$scope.OTROMETODO = function (model) { ...

    }

})();