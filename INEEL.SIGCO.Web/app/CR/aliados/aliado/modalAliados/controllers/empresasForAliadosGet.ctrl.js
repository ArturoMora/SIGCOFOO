(function() {
    "use strict";
    angular.module("ineel.CR.services")
        .controller("EmpresasForAliadosGetCtrl",
        ["AuthService",
        "$scope",
        "$uibModalInstance",
        "EmpresasCRService", EmpresasForAliadosGetCtrl]);

    function EmpresasForAliadosGetCtrl(AuthService, $scope, $uibModalInstance, EmpresasCRService) {
        $scope.authentication = AuthService.authentication;

        EmpresasCRService.getEmpresasForAliados().then(function(result) {
            $scope.empresas = result.data;
        },function(err) {
            toastr.error("Error al cargar los registros de empresas");
            console.log(err);
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        $scope.EmpresaSeleccionada= function(e) {
            $uibModalInstance.close(e);
            toastr.clear();
        }

    }

}());