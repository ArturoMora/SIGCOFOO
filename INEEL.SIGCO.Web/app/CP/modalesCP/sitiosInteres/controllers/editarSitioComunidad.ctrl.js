(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarSitioComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "SitiosInteresCPService",
            EditarSitioComunidadCtrl
        ]);

    function EditarSitioComunidadCtrl(AuthService, $scope, $uibModalInstance, SitiosInteresCPService) {
        $scope.registro = $scope.registroEdit;
        $scope.idCategoria = $scope.registroEdit.idCategoria;
        $scope.titulo = $scope.registroEdit.titulo;
        $scope.descripcion = $scope.registroEdit.descripcion;
        $scope.ligaSitio = $scope.registroEdit.liga;

        $scope.actualizarRegistro = function () {
            if ($scope.sitioEditForm.$invalid) {
                return false;
            } else {
                $scope.registro.idCategoria = $scope.idCategoria;
                $scope.registro.titulo = $scope.titulo;
                $scope.registro.descripcion = $scope.descripcion;
                $scope.registro.liga = $scope.ligaSitio;

                SitiosInteresCPService.update($scope.registro).then(function (result) {
                    toastr.success("Registro actualizado correctamente!");
                    $uibModalInstance.close($scope.noticiaEditar);
                }, function (err) {
                    toastr.error("Error al actualizar el registro");
                    console.log(err);
                });
            }
        

        }

        $scope.obtenerCategorias = function () {
            SitiosInteresCPService.getCategoriasSitio().then(function (result) {
                $scope.categoriaSitio = result.data;
            }, function (err) {
                toastr.error("Error al obtener los registros de categorías de sitios");
                console.log(err);
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        $scope.obtenerCategorias();


    }


})();