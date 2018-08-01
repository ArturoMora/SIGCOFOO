(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("BuscarClientesGENCtrl", [
            "$scope",
            "$uibModalInstance",
            "buscarClientesGENService",
            BuscarClientesGENCtrl
        ])

    function BuscarClientesGENCtrl($scope,$uibModalInstance, buscarClientesGENService) {

        buscarClientesGENService.GetClientesWithUnidadesForModal().then(
            function(res){
                $scope.clientes=res.data;
            }, function(err){
                toastr.error("Error al cargar los datos de clientes");
                console.log(err);
            }
        );

        $scope.seleccionaRegistro = function (empresa, esEmpresa) {
            esEmpresa == true ? empresa.esEmpresa = true : empresa.esEmpresa = false;
            $uibModalInstance.close(empresa);
        }

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };


    }
})();
