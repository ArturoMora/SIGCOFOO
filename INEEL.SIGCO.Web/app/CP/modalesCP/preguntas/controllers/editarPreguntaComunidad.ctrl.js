(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarPreguntaComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "PreguntasCPService",
            EditarPreguntaComunidadCtrl
        ]);

    function EditarPreguntaComunidadCtrl(AuthService, $scope, $uibModalInstance, PreguntasCPService) {

        $scope.registro = $scope.registroEdit;
        $scope.pregunta = $scope.registroEdit.pregunta;
        $scope.respuesta = $scope.registroEdit.respuesta;

        $scope.actualizarRegistro = function () {
            if ($scope.preguntaEditForm.$invalid) {
                return false;
            }else{
                $scope.registro.pregunta = $scope.pregunta;
                $scope.registro.respuesta = $scope.respuesta;

                PreguntasCPService.update($scope.registro).then(function (result) {
                    toastr.success("Registro actualizado correctamente!");
                    $uibModalInstance.close();
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