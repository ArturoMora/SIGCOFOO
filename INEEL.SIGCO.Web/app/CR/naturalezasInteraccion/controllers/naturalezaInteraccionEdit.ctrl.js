(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("NaturalezaInteraccionEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "NaturalezasInteraccionCRService",
        "comunService",
        NaturalezaInteraccionEditCtrl
        ]);

    function NaturalezaInteraccionEditCtrl(AuthService,$scope, $state, $stateParams, NaturalezasInteraccionCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.naturalezaInteraccion_id = $stateParams.id;

        NaturalezasInteraccionCRService.getNaturalezaInteraccion($scope.naturalezaInteraccion_id).then(
            function (result) {
                $scope.naturalezasInteraccion = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveNaturalezaInteraccion = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.naturalezasInteraccion.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "NaturalezaInteraccion",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            NaturalezasInteraccionCRService.update($scope.naturalezasInteraccion)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("naturalezasInteraccionGet");
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