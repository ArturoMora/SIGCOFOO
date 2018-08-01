(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ActividadAdicionalDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AliadosCRService",
        "DTOptionsBuilder",
        ActividadAdicionalDetailsCtrl
        ]);

    function ActividadAdicionalDetailsCtrl(AuthService, $scope, $state, $stateParams, AliadosCRService, DTOptionsBuilder) {
        $scope.actividadAdicional_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');

        $scope.areasM = [];
        $scope.personas = [];

        AliadosCRService.getActividad($scope.actividadAdicional_id).then(
            function (result) {
                debugger;
                $scope.actividadesAdicional = result.data;
                $scope.areasM = $scope.actividadesAdicional.areaActividadAdicional;
                $scope.personas = $scope.actividadesAdicional.personalActividadAdicional;
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



