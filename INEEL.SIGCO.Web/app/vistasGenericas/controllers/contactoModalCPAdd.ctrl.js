(function () {
    "use strict";

    angular
    .module("ineelCP")
    .controller("ContactoModalCPAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "globalGet",
        "MiembrosCPService",
        "$uibModal",
        "$uibModalInstance",
        ContactoModalCPAddCtrl
    ]);

    function ContactoModalCPAddCtrl(AuthService, $scope, $state, globalGet, MiembrosCPService, $uibModal, $uibModalInstance) {
        var API = globalGet.get("api");

        $scope.contacto = {};
        $scope.contactoCreado = {};
        $scope.contacto.nombreEmpresa = "";
     

        $scope.openEmpresa = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EmpresasCPGetGral.html',
                controller: 'EmpresasCPGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto.nombreEmpresa = selectedItem.nombreEmpresa;
                $scope.contacto.empresaId = selectedItem.empresaId;
            });

        }

        $scope.AddContacto = function () {
            if ($scope.contactoAddForm.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                //if (($scope.contacto.telefono == '' || $scope.contacto.telefono == undefined) &&
                //    ($scope.contacto.celular == '' || $scope.contacto.celular == undefined) &&
                //    ($scope.contacto.correo == '' || $scope.contacto.correo == undefined)) {
                //                toastr.warning("Al menos un medio de comunicación debe ingresar, (Teléfono, Celular, Correo)");
                //    return false;
                //}
                //else {
                    $scope.contacto.autor = AuthService.authentication.nombreCompleto;
                    $scope.contacto.fechaRegistro = new Date();
                    $scope.contacto.estado = 1;
                    $scope.contacto.estadoContacto = 'En revisi\u00f3n';
                    $scope.desactivar = true;
                    MiembrosCPService.createContact($scope.contacto).then(
                    function (result) {
                        toastr.success("Contacto creado correctamente!");
                        $scope.contactoCreado = result.data;
                        
                        //$scope.contacto.contactoId = $scope.contactoCreado.contactoId;
                        $uibModalInstance.close($scope.contactoCreado);
                    },
                    function (err) {
                        $scope.desactivar = false;
                        toastr.error(err);
                    });
                //}
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
