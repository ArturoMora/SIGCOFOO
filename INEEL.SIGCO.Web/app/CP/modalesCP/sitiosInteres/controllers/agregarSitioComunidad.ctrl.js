(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarSitioComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "$filter",
            "SitiosInteresCPService",
            AgregarSitioComunidadCtrl
        ]);

    function AgregarSitioComunidadCtrl(AuthService, $scope, $uibModalInstance, $filter, SitiosInteresCPService) {
        $scope.sitiosInteres = {};
        
        $scope.obtenerCategorias=function() {
            SitiosInteresCPService.getCategoriasSitio().then(function(result) {
                $scope.categoriaSitio = result.data;
            },function(err) {
                toastr.error("Error al obtener los registros de categorías de sitios");
                console.log(err);
            });
        }

        $scope.agregarRegistro = function () {
            debugger;
            if ($scope.sitioAddForm.$invalid) {
                return false;
            } else {
                if ($scope.rol.administrador) {
                    $scope.sitiosInteres.idPersona = $scope.rol.datosMiembro.idPersonas;
                    $scope.sitiosInteres.idMiembroCP = null;
                } else {
                    $scope.sitiosInteres.idMiembroCP = $scope.rol.datosMiembro.miembroId;
                }
                
                $scope.sitiosInteres.idCP = $scope.comunidad.comunidadId;
                SitiosInteresCPService.create($scope.sitiosInteres).then(function (result) {
                    toastr.success("Registro creado exitosamente!");
                    debugger;
                    //$scope.comunidad.noticias.push(result.data);
                    $uibModalInstance.close(result.data);
                },function(err) {
                    toastr.error("Error al crear el registro");
                    console.log(err);
                });    
            }
            
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        $scope.obtenerCategorias();

    }

})();