(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ServicioEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ServiciosCRService",
        "comunService",
        ServicioEditCtrl
        ]);

    function ServicioEditCtrl(AuthService,$scope, $state, $stateParams, ServiciosCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.servicio_id = $stateParams.id;

        ServiciosCRService.getServicio($scope.servicio_id).then(
            function (result) {
                $scope.servicios = result.data;
                $scope.excepcion = result.data.nomServ.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveServicio = function() {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.servicios.nomServ.replace(/ /g,"").replace(/\n/g,""),
                    "origen": "Servicio",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            ServiciosCRService.update($scope.servicios)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("serviciosGet");
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