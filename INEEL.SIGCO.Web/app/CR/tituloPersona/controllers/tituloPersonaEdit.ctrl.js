(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TituloPersonaEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "TituloPersonaCRService",
        "comunService",
        TituloPersonaEditCtrl
        ]);

    function TituloPersonaEditCtrl($scope, $state, $stateParams, TituloPersonaCRService, comunService) {

        $scope.tituloPersona_id = $stateParams.id;
        
        TituloPersonaCRService.getById($scope.tituloPersona_id).then(
            function (result) {
                $scope.tituloPersona = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.savetituloPersona = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tituloPersona.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TituloPersona",
                    "excepcion": $scope.excepcion
            };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TituloPersonaCRService.update($scope.tituloPersona)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tituloPersonaGetAll");
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