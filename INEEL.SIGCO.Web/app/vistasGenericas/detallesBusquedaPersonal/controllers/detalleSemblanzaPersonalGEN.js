(function () {
    "use strict";

    angular.module("ineelCH")
        .controller("detalleSemblanzaPersonalCtrl", ["AuthService", "$scope", "gestionfichasService", "$uibModalInstance", detalleSemblanzaPersonalCtrl]);

    function detalleSemblanzaPersonalCtrl(AuthService, $scope, gestionfichasService, $uibModalInstance) {
        $scope.authentication = AuthService.authentication;

        gestionfichasService.getExtractoById($scope.parametro.clavePersona).then(
            function (result) {
                $scope.semblanza = result.data;
            },
            function (err) {
                $scope.cancel();
            });

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

    }
})();