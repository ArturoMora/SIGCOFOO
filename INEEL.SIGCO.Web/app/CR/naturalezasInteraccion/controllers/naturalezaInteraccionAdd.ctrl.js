(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("NaturalezaInteraccionAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "NaturalezasInteraccionCRService",
        "comunService",
        NaturalezasInteraccionAddCtrl
        ]);

    function NaturalezasInteraccionAddCtrl(AuthService, $scope, $state, $filter, NaturalezasInteraccionCRService,comunService) {
        $scope.authentication = AuthService.authentication;

        $scope.AddNaturalezaInteraccion = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.naturalezaInteraccion.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "NaturalezaInteraccion"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var naturalezaInteraccion = {
                                "nombre": $scope.naturalezaInteraccion.nombre.replace(/\n/g, ""),
                                "descripcion": $scope.naturalezaInteraccion.descripcion,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,
                            };
                            NaturalezasInteraccionCRService.create(naturalezaInteraccion)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("naturalezasInteraccionGet");
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