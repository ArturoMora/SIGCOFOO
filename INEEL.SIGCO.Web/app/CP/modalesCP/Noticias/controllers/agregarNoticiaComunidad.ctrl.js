(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarNoticiaComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "$filter",
            "NoticiasCPService",
            AgregarNoticiaComunidadCtrl
        ]);

    function AgregarNoticiaComunidadCtrl(AuthService, $scope, $uibModalInstance, $filter, NoticiasCPService) {
        $scope.noticiasComunidad = {};
        
        $scope.agregarRegistro = function () {
            if ($scope.formNoticia.$invalid) {
                return false;
            } else {
                $scope.noticiasComunidad.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.noticiasComunidad.idComunidad = $scope.comunidad.comunidadId;
                $scope.noticiasComunidad.estado = true;

                NoticiasCPService.create($scope.noticiasComunidad).then(function (result) {
                    toastr.success("Registro creado exitosamente!");
                    $uibModalInstance.close(result.data);
                }, function (err) {
                    toastr.error("Error al crear el registro");
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