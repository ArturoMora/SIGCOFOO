(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("LineasDesarrolloTecnologicoGetCtrl", [
        "AuthService",
        "$scope",
        "LineasDesarrolloTecnologicoCRService",
        "$uibModal",
        LineasDesarrolloTecnologicoGetCtrl
        ]);

    function LineasDesarrolloTecnologicoGetCtrl(AuthService,$scope, LineasDesarrolloTecnologicoCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        LineasDesarrolloTecnologicoCRService.getLineasDesarrolloTecnologico().then(
            function (result) {
                $scope.lineasDesarrolloTecnologico = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.saveEstado = function (linea) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (linea.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        LineasDesarrolloTecnologicoCRService.UpdateEstado(linea).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.lineasDesarrolloTecnologico.indexOf(linea));
                        $scope.lineasDesarrolloTecnologico[idx].estado = !$scope.lineasDesarrolloTecnologico[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();