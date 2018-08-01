(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoRelacionGetCtrl", [
        "AuthService",
        "$scope",
        "TipoRelacionCRService",
        "$uibModal",
        TipoRelacionGetCtrl
        ]);

    function TipoRelacionGetCtrl(AuthService,$scope, TipoRelacionCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        TipoRelacionCRService.getAll().then(
            function (result) {
                $scope.tipoRelacion = result.data;
                
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });


        $scope.saveEstado = function (relacion) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (relacion.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        TipoRelacionCRService.UpdateEstado(relacion).then(
                            function (result) {
                                console.log(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.tipoRelacion.indexOf(relacion));
                        $scope.tipoRelacion[idx].estado = !$scope.tipoRelacion[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        
    }

})();