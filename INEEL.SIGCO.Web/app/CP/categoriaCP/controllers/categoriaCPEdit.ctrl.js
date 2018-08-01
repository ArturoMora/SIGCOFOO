(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("CategoriaCPEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "CategoriaCPService",
        "comunService",
        CategoriaCPEditCtrl
        ]);

    function CategoriaCPEditCtrl($scope, $state, $stateParams, CategoriaCPService, comunService) {


        CategoriaCPService.getCategoria($stateParams.id).then(
            function (result) {
                $scope.categoria = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveCategoria = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.categoria.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "CategoriaCP",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            CategoriaCPService.update($scope.categoria)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("categoriasCPGetAll");
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