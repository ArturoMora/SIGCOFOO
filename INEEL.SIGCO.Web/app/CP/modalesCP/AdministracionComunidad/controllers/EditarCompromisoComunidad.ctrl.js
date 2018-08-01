(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarCompromisoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "MetasComunidadesCPService",
            EditarCompromisoComunidadCtrl
        ]);

    function EditarCompromisoComunidadCtrl(AuthService, $scope, $uibModalInstance,  MetasComunidadesCPService) {
        $scope.registro = {};
       
        $scope.meta = $scope.metaEdit.meta;
        $scope.estadoMeta = $scope.metaEdit.estadoMeta;

        
        $scope.actualizarRegistro = function () {
            if ($scope.formEditCompromiso.$invalid) {
                return false;
            } else {
                $scope.registro = $scope.metaEdit;
                $scope.registro.meta = $scope.meta;
                $scope.registro.estadoMeta = $scope.estadoMeta;
                MetasComunidadesCPService.update($scope.registro)
                    .then(function (result) {
                        toastr.success(result.data);
                        $uibModalInstance.close();
                    },
                        function (err) {
                            toastr.error("Error al actualizar el compromiso");
                            console.log(err);
                        });
            }
            
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        

    }

})();