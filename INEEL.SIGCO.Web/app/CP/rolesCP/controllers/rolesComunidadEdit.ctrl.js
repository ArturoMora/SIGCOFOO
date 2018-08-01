(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("RolesCPEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "RolesCPService",
        "comunService",
        RolesCPEditCtrl
        ]);

    function RolesCPEditCtrl($scope, $state, $stateParams, RolesCPService, comunService) {

        RolesCPService.getById($stateParams.id).then(
            function (result) {
                $scope.roles = result.data;
                $scope.excepcion = result.data.nombre.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.saveComunidad = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.roles.nombre.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "RolesCP",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCP(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            RolesCPService.update($scope.roles)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("RolesCPGetAll");
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