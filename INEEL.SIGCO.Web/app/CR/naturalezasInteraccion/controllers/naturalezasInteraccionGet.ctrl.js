(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("NaturalezasInteraccionGetCtrl", [
        "AuthService",
        "$scope",
        "NaturalezasInteraccionCRService",
        "$uibModal",
        NaturalezasInteraccionGetCtrl
        ]);

    function NaturalezasInteraccionGetCtrl(AuthService, $scope, NaturalezasInteraccionCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        NaturalezasInteraccionCRService.getNaturalezasInteraccion().then(
            function (result) {
                $scope.naturalezasInteraccion = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (naturalezas) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (naturalezas.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        NaturalezasInteraccionCRService.UpdateEstado(naturalezas).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.naturalezasInteraccion.indexOf(naturalezas));
                        $scope.naturalezasInteraccion[idx].estado = !$scope.naturalezasInteraccion[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
        
    }


})();