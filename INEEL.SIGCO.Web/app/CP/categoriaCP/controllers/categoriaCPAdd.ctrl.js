(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("CategoriaCPAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "CategoriaCPService",
        "comunService",
        CategoriaCPAddCtrl
        ]);

    function CategoriaCPAddCtrl(AuthService, $scope, $state, $filter, CategoriaCPService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddCategoriaCP = function () {

            if ($scope.form.$invalid) {
                return false;
            } else {
                var registro = { "dato": $scope.categoria.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "CategoriaCP" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var categoria = {
                            "nombre": $scope.categoria.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.categoria.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,

                        };
                        CategoriaCPService.create(categoria).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("categoriasCPGetAll");
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