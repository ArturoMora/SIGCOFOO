(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("CalificacionPersonalEditCtrl", ['AuthService', '$scope', 'CalificacionPersonalService', 'globalGet', '$state', '$stateParams','comunService', CalificacionPersonalEditCtrl]);
    function CalificacionPersonalEditCtrl(AuthService, $scope, CalificacionPersonalService, globalGet, $state, $stateParams,comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;
        //Obtene ambito
        CalificacionPersonalService.getById(id).then(
            function (result) {
                $scope.personal = result.data;
                $scope.excepcion = $scope.personal.nombre;
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
                var registro = { "dato": $scope.personal.nombre, "origen": "MT.califPer", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        CalificacionPersonalService.update($scope.personal).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("CalificacionPersonalGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });
            }
        }
    }
})();