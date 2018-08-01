(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ListaOCEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "ListaOcService",
        "comunService",
        ListaOCEditCtrl
        ]);

    function ListaOCEditCtrl($scope, $state, $stateParams, ListaOcService, comunService) {

        ListaOcService.getById($stateParams.id).then(
            function (result) {
                $scope.lista = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveLista = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.lista.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "ListaOC",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            ListaOcService.update($scope.lista)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("ListaOcGetAll");
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