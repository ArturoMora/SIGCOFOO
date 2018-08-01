(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("LineamientosComunidadCtrl", [
            "AuthService",
            "$scope",
            "LineamientosCPService",
            LineamientosComunidadCtrl
        ]);

    function LineamientosComunidadCtrl(AuthService, $scope,  LineamientosCPService) {
        $scope.lineamientosComunidad = {};

        $scope.cargar = function () {
            LineamientosCPService.getAll().then(function (result) {
                $scope.lineamientos = result.data;
            }, function (err) {
                toastr.error("Error al cargar los registros de lineamientos");
                console.log(err);
            });
        }
        
        $scope.cargar();

        $scope.delete = function (id) {
            LineamientosCPService.delete(id).then(function (result) {
                $scope.cargar();
                toastr.success(result.data);
            }, function (err) {
                toastr.error("Error al cargar los registros de lineamientos");
                console.log(err);
            });
        }

    }

})();