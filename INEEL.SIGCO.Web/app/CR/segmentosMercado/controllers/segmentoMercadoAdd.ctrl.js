(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("SegmentoMercadoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "SegmentosMercadoCRService",
        "comunService",
        SegmentosMercadoAddCtrl
        ]);

    function SegmentosMercadoAddCtrl(AuthService, $scope, $state, $filter, SegmentosMercadoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddSegmentoMercado = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.segmentoMercado.nomSegMerc.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "SegmentoMercado",
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var segmentoMercado = {
                                "nomSegMerc": $scope.segmentoMercado.nomSegMerc.replace(/\n/g, ""),
                                "desSegMerc": $scope.segmentoMercado.desSegMerc,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,

                            };
                            SegmentosMercadoCRService.create(segmentoMercado)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("segmentosMercadoGet");
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
                
            }
        }
    }
})();