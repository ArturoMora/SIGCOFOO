(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarCompromisoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "$filter",
            "MetasComunidadesCPService",
            AgregarCompromisoComunidadCtrl
        ]);

    function AgregarCompromisoComunidadCtrl(AuthService, $scope, $uibModalInstance, $filter, MetasComunidadesCPService) {
        $scope.compromiso = {};
        $scope.estado = [{ 'atributo': "Vigente", 'valor': 1 }, { 'atributo': "Terminado", 'valor': 2 },
            { 'atributo': "Suspendido", 'valor': 3 }, { 'atributo': "Cancelado", 'valor': 4 }];

        $scope.agregarRegistro = function () {
            if ($scope.form.$invalid) {
                return false;
            } else {
                $scope.compromiso.estadoMeta = $scope.est.atributo;
                $scope.compromiso.idCP = $scope.comunidad.comunidadId;
                $scope.compromiso.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                MetasComunidadesCPService.create($scope.compromiso).then(function (result) {
                    toastr.success(result.data);
                    $uibModalInstance.close();
                }, function (err) {
                    toastr.error("Error al crear el compromiso");
                    console.log(err);
                });
            }
            
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        

    }

})();