(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("GetMiembrosComunidadCtrl", [
            "$scope",
            "$uibModalInstance",
            "MiembrosCPService",
            "DTOptionsBuilder",
            GetMiembrosComunidadCtrl
        ]);

    function GetMiembrosComunidadCtrl($scope, $uibModalInstance, MiembrosCPService, DTOptionsBuilder) {
        var id = $scope.variable;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frtp');

        MiembrosCPService.getByComunidad(id).then(function(result) {
            $scope.miembros = result.data;
            if ($scope.autores.length > 0) {
                for (var c = 0; c < $scope.miembros.length; c++) {
                    for (var d = 0; d < $scope.autores.length; d++) {
                        if ($scope.miembros[c].miembroId == $scope.autores[d].idMiembro) {
                            $scope.miembros.splice(c, 1);
                        }
                    }
                }
            }
            
        },function(err) {
            toastr.error("Error al cargar los registros de los miembros");
            console.log(err);
        });

        $scope.retornaNombrePersona=function(object) {
            $scope.miembroSeleccionado = object;
            $uibModalInstance.close($scope.miembroSeleccionado);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

    }

})();