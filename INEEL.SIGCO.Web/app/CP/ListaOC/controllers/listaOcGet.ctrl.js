(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ListaOCGetCtrl", [
            "AuthService",
            "$scope",
            "ListaOcService",
            "$uibModal",
            ListaOCGetCtrl
        ]);

    function ListaOCGetCtrl(AuthService, $scope, ListaOcService, $uibModal) {

        $scope.authentication = AuthService.authentication;
        ListaOcService.getAll().then(
            function (result) {
                $scope.listaOC = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (OC) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (OC.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ListaOcService.updateEstado(OC).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.listaOC.indexOf(OC));
                        $scope.listaOC[idx].estado = !$scope.listaOC[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }

})();