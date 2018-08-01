(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("expertoCPEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$stateParams",
            "globalGet",         
            "MiembrosCPService",
            "$uibModal",
            "$uibModalInstance",
            expertoCPEditCtrl
        ]);

    function expertoCPEditCtrl(AuthService, $scope, $state, $filter, $stateParams, globalGet, MiembrosCPService, $uibModal, $uibModalInstance) {
        var API = globalGet.get("api");
        // console.log($scope.expertoPosibleEdicion);
        $scope.registro={};
        $scope.registro.lineaDesarrolloTecnologicoId=$scope.expertoPosibleEdicion.lineaDesarrolloTecnologicoId;
        $scope.registro.especialidad=$scope.expertoPosibleEdicion.especialidad;

        $scope.modifica =  function(){
            $scope.expertoPosibleEdicion.lineaDesarrolloTecnologicoId = $scope.registro.lineaDesarrolloTecnologicoId;
            $scope.expertoPosibleEdicion.especialidad = $scope.registro.especialidad;

            MiembrosCPService.updateExpertos($scope.expertoPosibleEdicion).then(
                function (result) {
                    toastr.success("Registro actualizado exitosamente!");
                    $uibModalInstance.close($scope.expertoPosibleEdicion);
                },
                function (error) {
                    toastr.error(error.data.message);
                    console.log(error);
                });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
