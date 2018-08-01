(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("LineaDesarrolloTecnologicoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "LineasDesarrolloTecnologicoCRService",
        "comunService",
        LineasDesarrolloTecnologicoAddCtrl
        ]);

    function LineasDesarrolloTecnologicoAddCtrl(AuthService, $scope, $state, $filter, LineasDesarrolloTecnologicoCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddLineaDesarrolloTecnologico = function() {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.lineaDesarrolloTecnologico.nomLinDesTec.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "LineaDesarrolloTecnologico",
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var lineaDesarrolloTecnologico = {
                                "nomLinDesTec": $scope.lineaDesarrolloTecnologico.nomLinDesTec.replace(/\n/g, ""),
                                "desLinDesTec": $scope.lineaDesarrolloTecnologico.desLinDesTec,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,

                            };
                            LineasDesarrolloTecnologicoCRService.create(lineaDesarrolloTecnologico)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("lineasDesarrolloTecnologicoGet");
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