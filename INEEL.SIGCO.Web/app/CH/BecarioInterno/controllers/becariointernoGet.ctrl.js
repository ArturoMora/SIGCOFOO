(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("BecarioInternoGetCtrl", ["AuthService", "$scope", "BecarioInternoService", "$uibModal", BecarioInternoGetCtrl]);

    function BecarioInternoGetCtrl(AuthService, $scope, BecarioInternoService, $uibModal) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        $scope.claveEmpleado = AuthService.authentication.userprofile.clavePersona;

        //Obtener todos los registros del usuario que inicio sesion
        BecarioInternoService.getbyclave($scope.claveEmpleado).then(
            function (result) {
                $scope.registroResult = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de becario interno");
            }
            );
        //Eliminar registro SNI
        $scope.delete = function (registro, $uibModalInstance) {
            BecarioInternoService.delete(registro.becarioInternoId).then(
                    function (result) {
                        var idx = ($scope.registroResult.indexOf(registro));
                        $scope.registroResult.splice(idx, 1);
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };

        $scope.open = function (registro) {
            $scope.descripcionRow = "Registro";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };
    }
})();