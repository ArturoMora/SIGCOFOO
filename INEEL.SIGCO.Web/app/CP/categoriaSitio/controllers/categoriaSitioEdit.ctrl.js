(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("CategoriaSitioEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "CategoriaSitioService",
        "comunService",
        CategoriaSitioEditCtrl
        ]);

    function CategoriaSitioEditCtrl($scope, $state, $stateParams, CategoriaSitioService, comunService) {

        CategoriaSitioService.getById($stateParams.id).then(
            function (result) {
                $scope.categoriaSitio = result.data;
                $scope.excepcion = result.data.nombreCategoria.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveCategoriaSitio = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.categoriaSitio.nombreCategoria.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "CategoriaSitio",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            CategoriaSitioService.update($scope.categoriaSitio)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("categoriaSitioGetAll");
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