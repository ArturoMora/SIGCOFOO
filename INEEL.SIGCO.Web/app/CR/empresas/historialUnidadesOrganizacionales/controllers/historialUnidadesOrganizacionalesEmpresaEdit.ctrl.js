(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("HistorialUnidadesOrganizacionalesEmpresaEditCtrl", [
            "AuthService",
            "$scope",
            "$uibModal",
            "$uibModalInstance",
            "HistorialUnidadesCRService",
            HistorialUnidadesOrganizacionalesEmpresaEditCtrl]);

    function HistorialUnidadesOrganizacionalesEmpresaEditCtrl(AuthService, $scope, $uibModal, $uibModalInstance, HistorialUnidadesCRService) {


        $scope.cargaRegistro = function(){
            HistorialUnidadesCRService.GetById($scope.historialId).then(
                function(res){
                    $scope.registro = res.data;
                }, function (err) {
                    toastr.error("Error al cargar el historial de movimientos");
                    console.log(err);
                }
            );
        }


        if($scope.historialId==null){
            toastr.error("Indique el id del recurso a editar");
            return false;
        }else{
            $scope.cargaRegistro();
        }

        $scope.openContactoForHistorial = function () {
            // $scope.vinculo = {};
            // $scope.empresaId = $scope.empresa_id;  //Necesaria para crear el contacto
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.contacto= selectedItem;
                $scope.registro.contactoId= selectedItem.contactoId;
                
            });
        }

        $scope.actualizaRegistro = function(){
            HistorialUnidadesCRService.Update($scope.registro).then(
                function(res){
                    toastr.success(res.data);
                    $uibModalInstance.close('cancel');
                }, function (err) {
                    toastr.error("Error al actualizar el registro");
                    console.log(err);
                }
            );
        }
        
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
