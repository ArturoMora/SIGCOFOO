(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("CalifResultadosFinancierosDetailsCtrl", ["AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "CalifResultadosFinancierosService", 
        CalifResultadosFinancierosDetailsCtrl
        ]);

    function CalifResultadosFinancierosDetailsCtrl(AuthService,$scope, $state, $stateParams, CalifResultadosFinancierosService) {
        $scope.registro_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        CalifResultadosFinancierosService.getById($scope.registro_id).then(
            function (result) {
                $scope.registro = result.data;
                    if ($scope.registro.estado == true) {
                        $scope.registro.estado = "Activo";
                    } else if ($scope.registro.estado == false) {
                        $scope.registro.estado = "Inactivo";
                    }
            },
            function (err) {
                console.error(err);
            });
        }
})();