(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AmbitoConvEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AmbitosConvCRService",
        "comunService",
        AmbitoConvEditCtrl
        ]);

    function AmbitoConvEditCtrl($scope, $state, $stateParams, AmbitosConvCRService,comunService) {
        
        $scope.ambitoConv_id = $stateParams.id;

        AmbitosConvCRService.getAmbitoConv($scope.ambitoConv_id).then(
            function (result) {
                $scope.ambitosConv = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveAmbitoConv = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.ambitosConv.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "AmbitoConvenio", "excepcion": $scope.excepcion };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe!");
                            return false;
                        } else {
                            $scope.desactivar = true;
                            AmbitosConvCRService.update($scope.ambitosConv)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("ambitosConvGet");
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