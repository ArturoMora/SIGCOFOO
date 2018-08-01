
(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("listarevistasCtrl", [
            "$scope",
            "$uibModalInstance", "comunService", "PublicacionService",
             listarevistasCtrl]);

    function listarevistasCtrl($scope, $uibModalInstance, comunService, PublicacionService) {
        $scope.congresoSelect = {};
        $scope.congreso = {};
        PublicacionService.getRevistas().then(
            function (result) {
                $scope.revistas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de revistas.");
            }
        );
      
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.ok = function (rev) {
            $scope.revista = rev;
            $uibModalInstance.close($scope.revista);
        }


    


    }
})();