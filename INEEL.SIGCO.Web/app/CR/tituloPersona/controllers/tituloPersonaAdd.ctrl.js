(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TituloPersonaAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TituloPersonaCRService",
        "comunService",
        TituloPersonaAddCtrl
        ]);

    function TituloPersonaAddCtrl(AuthService, $scope, $state, $filter, TituloPersonaCRService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddTituloPersona = function () {
            
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tituloPersona.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TituloPersona" };
                comunService.ValidacionExistCR(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var tituloPersona = {
                            "nombre": $scope.tituloPersona.nombre.replace(/\n/g, ""),
                            "descripcion":$scope.tituloPersona.descripcion,
                            "fechaEfectiva": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,

                        };
                        TituloPersonaCRService.create(tituloPersona).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("tituloPersonaGetAll");
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