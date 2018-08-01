(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AreasInvestigacionGetCtrl", [
        "AuthService",
        "$scope",
        "AreasInvestigacionCRService",
        "$uibModal",
        AreasInvestigacionGetCtrl
        ]);

    function AreasInvestigacionGetCtrl(AuthService, $scope, AreasInvestigacionCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};
        AreasInvestigacionCRService.getAreasInvestigacion().then(
            function (result) {
                $scope.areasInvestigacion = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        //Guardar estado
        $scope.saveEstado = function (area) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (area.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                   $scope.ok = function () {
                       AreasInvestigacionCRService.UpdateEstado(area).then(
                           function (result) {
                               console.log(result.data);
                           },
                            function (err) {
                                $scope.cancel();
                            });
                       $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.areasInvestigacion.indexOf(area));
                        $scope.areasInvestigacion[idx].estado = !$scope.areasInvestigacion[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
        
    }


})();