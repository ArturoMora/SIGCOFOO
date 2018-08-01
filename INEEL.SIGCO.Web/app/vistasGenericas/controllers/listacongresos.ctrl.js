
(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("listacongresosCtrl", [
            "$scope",
            "$uibModalInstance",
            listacongresosCtrl]);

    function listacongresosCtrl($scope, $uibModalInstance) {
        $scope.congreso= {};
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.ok = function (con) {
            $scope.congreso = con;
            $uibModalInstance.close($scope.congreso);
        }

    }
})();