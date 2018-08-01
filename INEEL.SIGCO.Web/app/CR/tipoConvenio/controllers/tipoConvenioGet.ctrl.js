(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioGetCtrl", [
        "AuthService",
        "$scope",
        "TipoConvenioCRService",
        "$uibModal",
        TipoConvenioGetCtrl
        ]);

    function TipoConvenioGetCtrl(AuthService, $scope,   TipoConvenioCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        TipoConvenioCRService.getAll().then(
                function (result) {
                    $scope.tipoConvenio = result.data;
                },
                function (err) {
                    console.error(err);
                });

        $scope.saveEstado = function (convenio) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (convenio.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TipoConvenioCRService.UpdateEstado(convenio).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tipoConvenio.indexOf(convenio));
                        $scope.tipoConvenio[idx].estado = !$scope.tipoConvenio[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }


})();