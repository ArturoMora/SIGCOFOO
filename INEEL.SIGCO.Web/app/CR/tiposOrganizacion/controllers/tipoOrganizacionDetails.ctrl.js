(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoOrganizacionDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TiposOrganizacionCRService",
        TipoOrganizacionDetailsCtrl
        ]);

    function TipoOrganizacionDetailsCtrl(AuthService, $scope, $state, $stateParams, TiposOrganizacionCRService) {
        $scope.tipoOrganizacion_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TiposOrganizacionCRService.getTipoOrganizacion($scope.tipoOrganizacion_id).then(
            function (result) {
                $scope.tiposOrganizacion = result.data;
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



