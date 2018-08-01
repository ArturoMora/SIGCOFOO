(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ComentariosLineamientoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$rootScope",
            "MenuService",
            "$stateParams",
            "LineamientosCPService",
            ComentariosLineamientoComunidadCtrl
        ]);

    function ComentariosLineamientoComunidadCtrl(AuthService, $scope,$rootScope,MenuService, $stateParams, LineamientosCPService) {
        $scope.lineamientosComunidad = {};
        $scope.lineamientoId = $stateParams.id;

        $scope.idRol = MenuService.getRolId();

        LineamientosCPService.GetByLineamiento($scope.lineamientoId).then(function (result) {
            $scope.comentarios = result.data;
        },function(err) {
            toastr.error("Error al cargar los registros de lineamientos");
            console.log(err);
        });

        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }

})();