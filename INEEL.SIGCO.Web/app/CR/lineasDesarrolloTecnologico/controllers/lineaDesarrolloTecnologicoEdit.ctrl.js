(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("LineaDesarrolloTecnologicoEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "LineasDesarrolloTecnologicoCRService",
        "comunService",
        LineaDesarrolloTecnologicoEditCtrl
        ]);

    function LineaDesarrolloTecnologicoEditCtrl(AuthService,$scope, $state, $stateParams, LineasDesarrolloTecnologicoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.lineaDesarrolloTecnologico_id = $stateParams.id;

        LineasDesarrolloTecnologicoCRService.getLineaDesarrolloTecnologico($scope.lineaDesarrolloTecnologico_id).then(
            function (result) {
                $scope.lineasDesarrolloTecnologico = result.data;
                $scope.excepcion = result.data.nomLinDesTec.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveLineaDesarrolloTecnologico = function() {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.lineasDesarrolloTecnologico.nomLinDesTec.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "LineaDesarrolloTecnologico",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            LineasDesarrolloTecnologicoCRService.update($scope.lineasDesarrolloTecnologico)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("lineasDesarrolloTecnologicoGet");
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