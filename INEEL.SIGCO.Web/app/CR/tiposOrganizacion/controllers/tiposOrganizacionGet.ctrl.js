(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TiposOrganizacionGetCtrl", [
        "AuthService",
        "$scope",
        "TiposOrganizacionCRService",
        "$uibModal",
        TiposOrganizacionGetCtrl
        ]);

    function TiposOrganizacionGetCtrl(AuthService, $scope,  TiposOrganizacionCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.loading = true;
        $scope.dtInstance = {};
        TiposOrganizacionCRService.getTiposOrganizacion().then(
            function (result) {
                $scope.tiposOrganizacion = result.data;

            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
            );

        
        $scope.saveEstado = function (organizacion) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (organizacion.estado==true? 'Active':'Delete') + '.html',
                controller: function ($uibModalInstance) {
                   $scope.ok = function () {
                       TiposOrganizacionCRService.UpdateEstado(organizacion).then(
                           function(result) {
                               console.log(result.data);
                           },function(err) {
                                $scope.cancel();
                           });
                       $uibModalInstance.close();
                   };
                    $scope.cancel = function() {
                        var id = ($scope.tiposOrganizacion.indexOf(organizacion));
                        $scope.tiposOrganizacion[id].estado = !$scope.tiposOrganizacion[id].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();