(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarResultadoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "ResultadosEsperadosComunidadCPService",
            EditarResultadoComunidadCtrl
        ]);

    function EditarResultadoComunidadCtrl(AuthService, $scope, $uibModalInstance, ResultadosEsperadosComunidadCPService) {
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);

        //Evita que al momento de cerrar el modal(sin dar guardar) se vean los cambios en la vista anterior
        $scope.resultadoEsperado = $scope.resultadoEdit.resultadoEsperado;
        $scope.idMeta = $scope.resultadoEdit.idMeta;
        $scope.fechaEsperada = new Date($scope.resultadoEdit.fechaEsperada);

        $scope.actualizarRegistro = function () {
            if ($scope.formEditRes.$invalid) {
                return false;
            } else {
                $scope.resultado = $scope.resultadoEdit;
                $scope.resultado.resultadoEsperado = $scope.resultadoEsperado;
                $scope.resultado.idMeta = $scope.idMeta;
                $scope.resultado.fechaEsperada = $scope.fechaEsperada;
                ResultadosEsperadosComunidadCPService.update($scope.resultado)
                    .then(function (result) {
                        toastr.success(result.data);
                        $uibModalInstance.close();
                    },
                        function (err) {
                            toastr.error("Error al actualizar el resultado");
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