(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TematicaGetCtrl", [
        "AuthService",
        "$scope",
        "TematicaCRService",
        "$uibModal",
        TematicaGetCtrl
        ]);

    function TematicaGetCtrl(AuthService,$scope, TematicaCRService,  $uibModal) {
        $scope.authentication = AuthService.authentication;
        TematicaCRService.getAll().then(
            function (result) {
                $scope.tematica = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (tematica) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (tematica.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TematicaCRService.UpdateEstado(tematica).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tematica.indexOf(tematica));
                        $scope.tematica[idx].estado = !$scope.tematica[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();