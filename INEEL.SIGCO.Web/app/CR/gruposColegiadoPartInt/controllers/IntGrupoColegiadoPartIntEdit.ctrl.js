(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("IntGrupoColegiadoPartIntEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "PaisesService",
        "GruposColegiadoPartIntCRService",
        "$uibModal",
         "DTOptionsBuilder",
        IntGrupoColegiadoPartIntEditCtrl
        ]);

    function IntGrupoColegiadoPartIntEditCtrl(AuthService, $scope, $state, $stateParams, PaisesService, GruposColegiadoPartIntCRService, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.grupoColegiadoPartInt_id = $stateParams.id;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        var estadoId = 0;
        var paisId = 16; 
        $scope.integrantesM = [];
        $scope.integrantesN = [];
        $scope.integrantesE = [];
        $scope.integrantes = [];
        $scope.cargos= [];

        GruposColegiadoPartIntCRService.getIntegranteGC($scope.grupoColegiadoPartInt_id).then(
            function (result) {
                $scope.gruposColegiadoPartInt = result.data;
            },
            function (err) {
                console.error(err);
            });

        $scope.saveGrupoColegiadoPartInt = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.desactivar = true;
                debugger;
                $scope.gruposColegiadoPartInt.cargoGC = $scope.gruposColegiadoPartInt.cargoGC;
               
                GruposColegiadoPartIntCRService.updateIntegrante($scope.gruposColegiadoPartInt)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $state.go("gruposColegiadoPartIntGet");
                        },
                        function(err) {
                            console.error(err);
                            $scope.desactivar = false;
                        });
            }
        };
    }
})();