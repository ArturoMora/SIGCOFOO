(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AreaInvestigacionEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AreasInvestigacionCRService",
        "comunService",
        AreaInvestigacionEditCtrl
        ]);

    function AreaInvestigacionEditCtrl(AuthService,$scope, $state, $stateParams, AreasInvestigacionCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.areaInvestigacion_id = $stateParams.id;

        AreasInvestigacionCRService.getAreaInvestigacion($scope.areaInvestigacion_id).then(
            function (result) {
                $scope.areasInvestigacion = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveAreaInvestigacion = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.areasInvestigacion.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "AreaInvestigacion", "excepcion": $scope.excepcion };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        AreasInvestigacionCRService.update($scope.areasInvestigacion)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("areasInvestigacionGet");
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error(err.data.message);
                                });
                    }
                });
                
            }
        };
    }
})();