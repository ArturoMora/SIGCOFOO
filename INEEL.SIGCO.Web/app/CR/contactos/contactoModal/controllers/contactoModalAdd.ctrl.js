(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ContactoModalAddCtrl", [
        "AuthService",
        "$scope",
        "ContactosCRService",
        "$uibModal",
        "$uibModalInstance",
        ContactoModalAddCtrl
    ]);

    function ContactoModalAddCtrl(AuthService, $scope,  ContactosCRService, $uibModal, $uibModalInstance) {
        
        $scope.contacto = {};
        $scope.contactoCreado = {};
        $scope.contacto.nombreEmpresa = "";
        $scope.regFile = true;
        $scope.trabajoActual=true;

        
        if($scope.idFromEmpresa!=null){ //Esta propiedad viene desde el controlador(padre) donde se hace refencia a este(hijo), por ej: se utiliza cuando se quiere crear un contacto en una unidad organizacional de empresas
            $scope.contacto.empresaId = $scope.idFromEmpresa;
        }

        $scope.openEmpresa = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EmpresasGetGral.html',
                controller: 'EmpresasGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto.nombreEmpresa = selectedItem.nombreEmpresa;
                $scope.contacto.empresaId = selectedItem.empresaId;
            });

        }

        $scope.AddContacto = function () {
            if ($scope.contactoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                if (($scope.contacto.telefono == '' || $scope.contacto.telefono == undefined) &&
                    ($scope.contacto.celular == '' || $scope.contacto.celular == undefined) &&
                    ($scope.contacto.correo == '' || $scope.contacto.correo == undefined)) {
                                toastr.warning("Al menos un medio de comunicación debe ingresar, (Teléfono, Celular, Correo)");
                    return false;
                }
                else {
                    if($scope.trabajoActual && $scope.contacto.fechaFinal!=null){
                        $scope.contacto.fechaFinal=null;
                    }
                    $scope.contacto.autor = AuthService.authentication.nombreCompleto;
                    $scope.contacto.fechaRegistro = new Date();
                    $scope.contacto.estado = 1;
                    $scope.contacto.estadoContacto = 'En revisi\u00f3n';
                    $scope.desactivar = true;
                    ContactosCRService.createContact($scope.contacto).then(
                    function (result) {
                        toastr.success("Contacto creado correctamente!");
                        $scope.contactoCreado = result.data;
                        $scope.contacto.contactoId = $scope.contactoCreado.contactoId;
                        $scope.contacto.nombreCompleto = result.data.nombreCompleto;
                        if ($scope.agregaPuesto) {
                            $scope.contacto.contactoId = result.data.contactoId;

                            ContactosCRService.createPuestoHistorico($scope.contacto).then(function(res) { //Se crea el puesto del contacto
                                $uibModalInstance.close($scope.contacto);
                            },function(err) {
                                toastr.error("Error al registrar el puesto del contacto");
                                console.log(err);
                            });
                        }
                        $uibModalInstance.close($scope.contacto);
                        
                    },
                    function (err) {
                        $scope.desactivar = false;
                        toastr.error(err);
                    });
                }
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
