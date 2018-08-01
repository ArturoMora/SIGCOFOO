(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "TipoConvenioCRService",
        "comunService",
        TipoConvenioEditCtrl
        ]);

    function TipoConvenioEditCtrl(AuthService,$scope, $state, $stateParams, TipoConvenioCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.tipoConvenio_id = $stateParams.id;
        TipoConvenioCRService.get($scope.tipoConvenio_id).then(
            function (result) {
                $scope.tipoConvenio = result.data;
                $scope.excepcion = result.data.nomTipConv.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveTipoConvenio = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.tipoConvenio.nomTipConv.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "TipoConvenio",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            TipoConvenioCRService.update($scope.tipoConvenio)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tipoConvenioGet");
                                    },
                                    function (err) {
                                        console.error(err);
                                    });
                        }
                    });
                
            }
        }
    }
    })();