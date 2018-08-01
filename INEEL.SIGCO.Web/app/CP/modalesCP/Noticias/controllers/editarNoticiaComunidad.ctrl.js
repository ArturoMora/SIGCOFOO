(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarNoticiaComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "NoticiasCPService",
            EditarNoticiaComunidadCtrl
        ]);

    function EditarNoticiaComunidadCtrl(AuthService, $scope, $uibModalInstance, NoticiasCPService) {

        
        $scope.nombre = $scope.noticiaEditar.nombre;
        $scope.descripcion = $scope.noticiaEditar.descripcion;

        $scope.actualizarRegistro = function () {
            if ($scope.formEditNoticia.$invalid) {
                return false;
            } else {
                $scope.noticiaEditar.nombre = $scope.nombre;
                $scope.noticiaEditar.descripcion = $scope.descripcion;

                NoticiasCPService.update($scope.noticiaEditar).then(function (result) {
                    toastr.success("Registro actualizado correctamente!");
                    $uibModalInstance.close($scope.noticiaEditar);
                }, function (err) {
                    toastr.error("Error al actualizar el registro");
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