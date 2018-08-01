(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("estadodelprocesogetCtrl", [
        "$scope"
        , "CatalogosPIService"
        , "$uibModal"
        , estadodelprocesogetCtrl]);
    function estadodelprocesogetCtrl($scope, CatalogosPIService, $uibModal) {

        $scope.estadosdelproceso = [];
        //obtener registros
        CatalogosPIService.getestadosdelproceso().then(
            function (result) {
                $scope.estadosdelproceso = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de estados del proceso");
            }
        );

        //Guardar estado
        $scope.cambiarestado = function (estado) {

            CatalogosPIService.updateestadodelproceso(estado).then(
                function (success) {
                    toastr.success(success.data)
                },
                function (err) {
                    toastr.error(err.data.exceptionMessage);
                    $scope.cancel();
                }
            );
        }

        $scope.cancel = function(estado){
            var pos = $scope.estadosdelproceso.indexOf(estado);
            $scope.estadosdelproceso[pos].estado = !estado.estado;
        }
    }
})();