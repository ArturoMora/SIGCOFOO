(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AmbitoConvAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "AmbitosConvCRService",
        "comunService",
        AmbitoConvAddCtrl
        ]);

    function AmbitoConvAddCtrl(AuthService, $scope, $state, $filter, AmbitosConvCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.ambitoConv = {};

        $scope.AddAmbitoConv = function () {
            //debugger;
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.ambitoConv.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "AmbitoConvenio" };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe!");
                            return false;
                        } else {
                            $scope.ambitoConv.nombre = $scope.ambitoConv.nombre.replace(/\n/g, "");
                            $scope.ambitoConv.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                            $scope.ambitoConv.estado = 1;
                            $scope.ambitoConv.autor = AuthService.authentication.nombreCompleto;

                            AmbitosConvCRService.create($scope.ambitoConv)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("ambitosConvGet");
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