(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SegmentoMercadoEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "SegmentosMercadoCRService",
        "comunService",
        SegmentoMercadoEditCtrl
        ]);

    function SegmentoMercadoEditCtrl(AuthService,$scope, $state, $stateParams, SegmentosMercadoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.segmentoMercado_id = $stateParams.id;

        SegmentosMercadoCRService.getSegmentoMercado($scope.segmentoMercado_id).then(
            function (result) {
                $scope.segmentosMercado = result.data;
                $scope.excepcion = result.data.nomSegMerc.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveSegmentoMercado = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.segmentosMercado.nomSegMerc.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "SegmentoMercado",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            SegmentosMercadoCRService.update($scope.segmentosMercado)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("segmentosMercadoGet");
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