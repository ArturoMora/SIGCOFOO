(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TematicaEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TematicaCRService",
        "comunService",
        TematicaEditCtrl
        ]);

    function TematicaEditCtrl(AuthService,$scope, $state, $stateParams, TematicaCRService,comunService) {

        $scope.tematica_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TematicaCRService.get($scope.tematica_id).then(
            function (result) {
                $scope.tematica = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTematica = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tematica.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Tematicas",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TematicaCRService.update($scope.tematica)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tematicaGet");
                                    },
                                    function (err) {
                                        console.error(err);
                                    });
                        }
                    });
            }
            
        };
    }
})();