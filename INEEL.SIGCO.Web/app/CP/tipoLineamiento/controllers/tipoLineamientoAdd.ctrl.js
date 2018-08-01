(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TipoLineamientoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoLineamientoCPService",
        "comunService",
        TipoLineamientoAddCtrl
        ]);

    function TipoLineamientoAddCtrl(AuthService, $scope, $state, $filter, TipoLineamientoCPService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddLineamiento = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoLineamiento.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TituloPersona" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var tipoLineamiento = {
                            "nombre": $scope.tipoLineamiento.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.tipoLineamiento.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1

                        };
                        TipoLineamientoCPService.create(tipoLineamiento).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("TipoLineamientoGetAll");
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