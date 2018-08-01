(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("CategoriaSitioAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "CategoriaSitioService",
        "comunService",
        CategoriaSitioAddCtrl
        ]);

    function CategoriaSitioAddCtrl(AuthService, $scope, $state, $filter, CategoriaSitioService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddCategoriaSitio = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.categoriaSitio.nombreCategoria.replace(/ /g, "").replace(/\n/g, ""), "origen": "CategoriaSitio" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var categoriaSitio = {
                            "NombreCategoria": $scope.categoriaSitio.nombreCategoria.replace(/\n/g, ""),
                            "descripcion": $scope.categoriaSitio.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1
                        };
                        CategoriaSitioService.create(categoriaSitio).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("categoriaSitioGetAll");
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