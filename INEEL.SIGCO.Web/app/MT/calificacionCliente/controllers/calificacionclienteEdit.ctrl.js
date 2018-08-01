(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("CalificacionClienteEditCtrl", ['AuthService', '$scope', 'CalificacionClienteService', 'globalGet', '$state', '$stateParams','comunService', CalificacionClienteEditCtrl]);
    function CalificacionClienteEditCtrl(AuthService, $scope, CalificacionClienteService, globalGet, $state, $stateParams,comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;
        //Obtene ambito
        CalificacionClienteService.getById(id).then(
            function (result) {
                $scope.cliente = result.data;
                $scope.excepcion = $scope.cliente.nombre;
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.cliente.nombre, "origen": "MT.califCte", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        CalificacionClienteService.update($scope.cliente).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("CalificacionClienteGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });
            }        }
    }
})();