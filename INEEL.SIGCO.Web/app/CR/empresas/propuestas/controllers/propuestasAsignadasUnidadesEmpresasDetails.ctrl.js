(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PropuestasAsignadasUnidadesEmpresasDetailsCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "PropuestasEmpresaCRService",
            PropuestasAsignadasUnidadesEmpresasDetailsCtrl
        ]);

    function PropuestasAsignadasUnidadesEmpresasDetailsCtrl(AuthService, $scope, $uibModalInstance,  PropuestasEmpresaCRService) {

        $scope.authentication = AuthService.authentication;
        // var propuestaId = {'PropuestaId' : $scope.proyectoId};
        var propuestaId = $scope.proyectoId.trim();
        $scope.propuestaAsignadaDetails = {};


        PropuestasEmpresaCRService.getPropuestaEmpresaAsignada(propuestaId).then(
            function (result) {
                $scope.propuestaAsignadaDetails = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los datos de la propuesta");
                console.log(err);
            });

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }
})();