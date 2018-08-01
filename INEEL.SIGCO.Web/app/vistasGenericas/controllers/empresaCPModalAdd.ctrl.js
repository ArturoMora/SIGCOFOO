(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EmpresaCPModalAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "MiembrosCPService",
            "$uibModalInstance",
            EmpresaCPModalAddCtrl
        ]);

    function EmpresaCPModalAddCtrl(AuthService, $scope, $state, $filter,  MiembrosCPService,  $uibModalInstance) {
        $scope.empresa = {};
        $scope.regFile = true;

        $scope.AddEmpresa = function () {
            if ($scope.empresaAddForm.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.empresa.autor = AuthService.authentication.nombreCompleto;
                $scope.empresa.fecharegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                $scope.empresa.estado = 1;
                $scope.contacto.estadoEmpresa = 'En revisi\u00f3n';
                $scope.desactivar = true;

                MiembrosCPService.createEmpres($scope.empresa).then(
                    function (result) {
                      
                        toastr.success("Empresa creada correctamente!");
                        $scope.empresa = result.data;
                        $uibModalInstance.close($scope.empresa);
                        
                    },
                    function (err) {
                        console.error(err);
                        $scope.desactivar = false;
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
