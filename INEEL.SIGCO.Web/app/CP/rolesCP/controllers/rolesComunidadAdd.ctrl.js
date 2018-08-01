(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("RolesCPAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "RolesCPService",
        "comunService",
        RolesCPAddCtrl
        ]);

    function RolesCPAddCtrl(AuthService, $scope, $state, $filter, RolesCPService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddRol = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.roles.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "RolesCP" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var roles = {
                            "nombre": $scope.roles.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.roles.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1
                        };
                        RolesCPService.create(roles).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("RolesCPGetAll");
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