(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("IntGrupoColegiadoPartIntDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "GruposColegiadoPartIntCRService",
        
        IntGrupoColegiadoPartIntDetailsCtrl
        ]);

    function IntGrupoColegiadoPartIntDetailsCtrl(AuthService, $scope, $state, $stateParams, GruposColegiadoPartIntCRService) {
        $scope.grupoColegiadoPartInt_id = $stateParams.id;
       
        $scope.authentication = AuthService.authentication;

            

        GruposColegiadoPartIntCRService.getIntegranteGC($scope.grupoColegiadoPartInt_id).then(
            function (result) {
                $scope.gruposColegiadoPartInt = result.data;
                
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
        };
    }
})();



