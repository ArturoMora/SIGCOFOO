(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ContactoModalONEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "globalGet",
            "EmpresasCRService",
            "ContactosCRService",
            "$uibModal",
            "$uibModalInstance",
            ContactoModalONEditCtrl
        ]);

    function ContactoModalONEditCtrl(AuthService, $scope, $state, $stateParams, globalGet, EmpresasCRService, ContactosCRService, $uibModal, $uibModalInstance) {
        var API = globalGet.get("api");
        $scope.contacto = {};

        debugger;
        var contactoId = $scope.contactoId;

            ContactosCRService.getContacto(contactoId).then(
                function (result) {
                    $scope.contacto = result.data;
                    debugger;
                },
                function (err) {
                    console.error(err);
                });



        $scope.ok = function () {
            if ($scope.contactoEditForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                $scope.contacto.autor = AuthService.authentication.nombreCompleto;
                debugger;
                if($scope.contacto.empresa.empresaId != null){
                  EmpresasCRService.update($scope.contacto.empresa).then(
                      function (result) {
                          toastr.success(result.data);
                          $scope.recargarContacto();
                      },
                      function (err) {
                          toastr.error(err);
                      });
                }
                ContactosCRService.update($scope.contacto).then(
                    function (result) {
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargarContacto();
                    },
                    function (err) {
                        toastr.error(err);
                    });

            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
