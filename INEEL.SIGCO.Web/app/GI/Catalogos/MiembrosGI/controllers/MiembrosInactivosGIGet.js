(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("MiembrosInactivosGIGet", ["AuthService", "$scope","$stateParams", "$uibModal", "MiembrosGIService", IdeaInnovadoraGet]);

    function IdeaInnovadoraGet(AuthService, $scope, $stateParams,$uibModal,  MiembrosGIService) {


        MiembrosGIService.getMiembrosInactivosByGrupo($stateParams.id).then(function (result) {
            $scope.miembros = result.data;
        }, function (err) {
            toastr.error("No se han podido cargar los registros de miembros.");
            console.log(err);
        });
        
        
        $scope.eliminaMiembro = function (miembro) {
            
            MiembrosGIService.DeleteWithRol(miembro.id)
                .then(function (result) {
                        var idx = $scope.miembros.indexOf(miembro);
                        $scope.miembros.splice(idx,1);
                        toastr.success("Registro eliminado exitosamente!");
                    },
                    function(err) {
                        toastr.error("No se ha podido dar de baja al miembro.");
                        console.log(err);
                    });
        }

        $scope.saveEstado = function (miembro) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (miembro.activo == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        miembro.activo = true;
                        MiembrosGIService.ActivaMiembro(miembro).then(
                            function (result) {
                                var idx = $scope.miembros.indexOf(miembro);
                                $scope.miembros.splice(idx, 1);
                                toastr.success("Registro actualizado exitosamente!");
                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.miembros.indexOf(miembro));
                        $scope.miembros[idx].activo = !$scope.miembros[idx].activo;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }



    }
})();