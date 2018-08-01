(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoConvenioCRService",
        "comunService",
        TipoConvenioAddCtrl
        ]);

    function TipoConvenioAddCtrl(AuthService, $scope, $state,  $filter, TipoConvenioCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddTipoConvenio = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoConvenio.nomTipConv.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoConvenio" };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var tipoConvenio = {
                            "nomTipConv": $scope.tipoConvenio.nomTipConv.replace(/\n/g, ""),
                            "descTipConv": $scope.tipoConvenio.descTipConv,
                            "fechaEfectiva": new Date(),
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,

                        };
                        TipoConvenioCRService.create(tipoConvenio)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipoConvenioGet");
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