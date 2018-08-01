(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("HistorialUnidadesOrganizacionalesEmpresaGetCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "$stateParams",
            "DTOptionsBuilder",
            "DTColumnDefBuilder",
            "HistorialUnidadesCRService",
            HistorialUnidadesOrganizacionalesEmpresaGetCtrl]);

    function HistorialUnidadesOrganizacionalesEmpresaGetCtrl(AuthService, $scope, $uibModal, $stateParams, DTOptionsBuilder ,DTColumnDefBuilder, HistorialUnidadesCRService) {

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([2]).withOption('type', 'date')
        ];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('order', [0, 'desc'])
            .withDOM('lftr<"default"pB>i');

        $scope.cargaHistorial=function(){
            HistorialUnidadesCRService.GetAllByEmpresa($stateParams.id).then(
                function(res){
                    $scope.historial = res.data;
                }, function (err) {
                    toastr.error("Error al cargar el historial de movimientos");
                    console.log(err);
                }
            );
        }

        $scope.editaRegistro = function (id) {
            $scope.historialId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/historialUnidadesOrganizacionales/historialUnidadesOrganizacionalesEmpresaEdit.html',
                controller: 'HistorialUnidadesOrganizacionalesEmpresaEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.cargaHistorial();
            });
        }

        
        
        $scope.cargaHistorial();

        $scope.eliminaRegistro = function(id){
            HistorialUnidadesCRService.Delete(id).then(
                function(res){
                    toastr.success(res.data);
                    $scope.cargaHistorial();
                }, function (err) {
                    toastr.error("Puede que tenga relaciones con otros OCs", "Error al eliminar el historial");
                    console.log(err);
                }
            );
        }

        // $scope.editaRegistro = function(){
        //     toastr.error("Funcion pendiente...");
        // }

    }
})();
