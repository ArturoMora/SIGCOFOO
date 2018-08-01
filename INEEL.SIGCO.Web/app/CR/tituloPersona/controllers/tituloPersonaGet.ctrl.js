(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TituloPersonaGetCtrl", [
            "AuthService",
            "$scope",
            "TituloPersonaCRService",
            "$uibModal",
            TituloPersonaGetCtrl
        ]);

    function TituloPersonaGetCtrl(AuthService, $scope, TituloPersonaCRService, $uibModal) {

        $scope.authentication = AuthService.authentication;
        TituloPersonaCRService.getAll().then(
            function (result) {
                $scope.tituloPersona = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (titulo) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (titulo.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TituloPersonaCRService.UpdateEstado(titulo).then(
                            function (result) {
                                
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tituloPersona.indexOf(titulo));
                        $scope.tituloPersona[idx].estado = !$scope.tituloPersona[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }

})();