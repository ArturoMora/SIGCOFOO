(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ListaOCAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "ListaOcService",
        "comunService",
        ListaOCAddCtrl
        ]);

    function ListaOCAddCtrl(AuthService, $scope, $state, $filter, ListaOcService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddListaOC = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.lista.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "ListaOC" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var lista = {
                            "nombre": $scope.lista.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.lista.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1
                        };
                        ListaOcService.create(lista).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("ListaOcGetAll");
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