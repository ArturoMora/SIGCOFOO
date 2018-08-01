(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AreaInvestigacionDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AreasInvestigacionCRService",
        AreaInvestigacionDetailsCtrl
        ]);

    function AreaInvestigacionDetailsCtrl(AuthService,$scope, $state, $stateParams, AreasInvestigacionCRService) {
        $scope.areaInvestigacion_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        AreasInvestigacionCRService.getAreaInvestigacion($scope.areaInvestigacion_id).then(
            function (result) {
                $scope.areasInvestigacion = result.data;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;
            
            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
         }
    }
})();



