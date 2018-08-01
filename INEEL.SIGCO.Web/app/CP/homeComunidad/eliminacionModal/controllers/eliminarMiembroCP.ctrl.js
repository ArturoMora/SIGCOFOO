(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("eliminarMiembroCPCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$stateParams",
            "globalGet",
         
            "MiembrosCPService",
            "$uibModal",
            "$uibModalInstance",
            eliminarMiembroCPCtrl
        ]);

    function eliminarMiembroCPCtrl(AuthService, $scope, $state, $filter, $stateParams, globalGet, MiembrosCPService, $uibModal, $uibModalInstance) {
        var API = globalGet.get("api");
      
        

        $scope.eliminar = function () {

            $scope.eliminarTotalMente();
            $uibModalInstance.dismiss('cancel');
        };


        $scope.desactivar = function () {
            $scope.darBaja();
            $uibModalInstance.dismiss('cancel');

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
