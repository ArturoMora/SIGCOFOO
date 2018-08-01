(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ServicioAddCtrl", [
        "AuthService",
        "$scope",
        "$rootScope",
        "$filter",
        "$state",
        "ServiciosCRService",
        "comunService",
        "MenuService",
        ServiciosAddCtrl
        ]);

    function ServiciosAddCtrl(AuthService, $scope, $rootScope, $filter, $state, ServiciosCRService, comunService, MenuService) {
        $scope.authentication = AuthService.authentication;

        $scope.datosComp = MenuService.getVariable("datosCompetidor");
        if ($scope.datosComp) {
            $scope.competidor = MenuService.getVariable("competidor");
            MenuService.setVariable("datosCompetidor", false);
        }
        $scope.AddServicio = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.servicio.nomServ.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Servicio"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var servicio = {
                                "nomServ": $scope.servicio.nomServ.replace(/\n/g, ""),
                                "descServ": $scope.servicio.descServ,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,
                            };
                            ServiciosCRService.create(servicio)
                                .then(
                                    function (result) {
                                        
                                        toastr.success("Registro creado exitosamente!");
                                        if ($scope.datosComp) {
                                            $scope.competidor.servicio =result.data;
                                            // $scope.competidor.nombreServicio = result.data.nomServ;
                                            MenuService.setVariable("competidor", $scope.competidor);
                                        }
                                        //$state.go("serviciosGet");
                                        $scope.regresar();
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
                
            }

        }
        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }
    }
})();