(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SegmentosMercadoGetCtrl", [
        "AuthService",
        "$scope",
        "SegmentosMercadoCRService",
        "$uibModal",
        SegmentosMercadoGetCtrl
        ]);

    function SegmentosMercadoGetCtrl(AuthService, $scope, SegmentosMercadoCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        SegmentosMercadoCRService.getSegmentosMercado().then(
            function (result) {
                $scope.segmentosMercado = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (segmento) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (segmento.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        SegmentosMercadoCRService.UpdateEstado(segmento).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.segmentosMercado.indexOf(segmento));
                        $scope.segmentosMercado[idx].estado = !$scope.segmentosMercado[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }


})();