(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("ConfirmacionContinueCtrl", [
            "$scope",
            "$state",
            "$uibModal",
            "$uibModalInstance",
            ConfirmacionContinueCtrl
        ]);

    function ConfirmacionContinueCtrl($scope, $state,
         $uibModal, $uibModalInstance) {
        
        if ($scope.message == undefined || $scope.message == null) {
            $scope.message = "¿est&aacute; seguro de continuar con esta operaci&oacute;n?";
        }

        $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
            try{
                $scope.continueFunction();
            } catch (err) { console.error(err); alert("metodo 'continueFunction()' no definido en el controlador principal ");}
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
