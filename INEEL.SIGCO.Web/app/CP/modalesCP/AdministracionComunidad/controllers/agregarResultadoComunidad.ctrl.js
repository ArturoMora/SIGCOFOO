(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarResultadoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "$filter",
            "ResultadosEsperadosComunidadCPService",
            AgregarResultadoComunidadCtrl
        ]);

    function AgregarResultadoComunidadCtrl(AuthService, $scope, $uibModalInstance, $filter, ResultadosEsperadosComunidadCPService) {
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.resultado = {};

        ResultadosEsperadosComunidadCPService.getAllCompromisos($scope.comunidad.comunidadId).then(function (result) {
            $scope.compromisos = result.data;
        }, function (err) {
            toastr.error("No se han podido cargar los registros de compromisos");
            console.log(err);
        });

        $scope.agregarRegistro = function () {
            if ($scope.formAddRes.$invalid) {
                return false;
            } else {
                ResultadosEsperadosComunidadCPService.create($scope.resultado).then(function (result) {
                    toastr.success(result.data);
                    $uibModalInstance.close();
                }, function (err) {
                    toastr.error("Error al crear el resultado");
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