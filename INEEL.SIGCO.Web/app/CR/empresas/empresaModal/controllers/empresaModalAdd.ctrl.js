(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EmpresaModalAddCtrl", [
            "AuthService",
            "$scope",
            "$filter",
            "$stateParams",
            "TiposOrganizacionCRService",
            "EmpresasCRService",
            "$uibModalInstance",
            EmpresaModalAddCtrl
        ]);

    function EmpresaModalAddCtrl(AuthService, $scope,  $filter, $stateParams, TiposOrganizacionCRService, EmpresasCRService, $uibModalInstance) {
        $scope.empresa = {};
        $scope.regFile = true;

        $scope.empresa_id = $stateParams.id;
        TiposOrganizacionCRService.getTiposOrganizacionByTrue().then(
            function (result) {
                $scope.tiposOrganizaciones = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.AddEmpresa = function () {
            if ($scope.empresaAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.empresa.autor = AuthService.authentication.nombreCompleto;
                $scope.empresa.fecharegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                $scope.empresa.estado = 1;
                $scope.empresa.estadoEmpresa="En revisión";
                if($scope.contacto!=null){
                    $scope.contacto.estadoEmpresa = 'En revisi\u00f3n';
                }
                
                $scope.desactivar = true;

                EmpresasCRService.createEmpres($scope.empresa).then(
                    function (result) {
                        debugger;
                        toastr.success("Empresa creada correctamente!");
                        $scope.empresa = result.data;
                        $uibModalInstance.close($scope.empresa);
                        
                    },
                    function (err) {
                        toastr.error(err.data.exceptionMessage);
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
