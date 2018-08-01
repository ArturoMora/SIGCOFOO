(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TematicaPorFondoProgramaAddCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TematicaPorFondoProgramaCRService",
        TematicaPorFondoProgramaAddCtrl
        ]);

    function TematicaPorFondoProgramaAddCtrl($scope, $state, $stateParams, TematicaPorFondoProgramaCRService) {
        $scope.AddTematicaPorFondoPrograma = function () {

            if ($scope.tematicaPorFondoProgramaAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                var tematicaPorFondoPrograma = {
                    "fechaEfectiva": new Date(),
                    "autor": "Arturo",
                    "estado": 1,
                    "TematicaId": 2,
                    "FondoProgramaId": 4

                };

                TematicaPorFondoProgramaCRService.create(tematicaPorFondoPrograma).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("tematicaPorFondoProgramaGet");
                },
                function (err) {
                    console.error(err);
                });
            }
        }
    }
})();