(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("RolesCPGetCtrl", [
            "AuthService",
            "$scope",
            "RolesCPService",
            "$uibModal",
            RolesCPGetCtrl
        ]);

    function RolesCPGetCtrl(AuthService, $scope, rolesCpService, $uibModal) {

        $scope.authentication = AuthService.authentication;
        rolesCpService.getAll().then(
            function (result) {
                $scope.rolesCP = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (rol) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (rol.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        rolesCpService.UpdateEstado(rol).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.rolesCP.indexOf(rol));
                        $scope.rolesCP[idx].estado = !$scope.rolesCP[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }

})();